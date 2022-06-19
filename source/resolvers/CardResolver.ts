import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Between, FindOperator, MoreThan, MoreThanOrEqual } from "typeorm";
import { dataSource } from "../dataSource";
import { Card } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { CardRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Card)
export class CardResolver {
  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('view-card'))
  @Query(() => Card, { nullable: true })
  async findCardById(@Arg('id', () => Int) id: number) {
    const card = await CardRepository.findOneBy({ id })

    return card
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('create-card'))
  @Mutation(() => Card)
  async addCard(
    @Arg('title') title: string,
    @Arg('description', { nullable: true }) description: string | null,
    @Arg('columnId', () => Int) columnId: number,
    @Ctx() { }: ContextType): Promise<Card | null> {
    const card = new Card()

    card.title = title
    card.description = description
    card.columnId = columnId

    await CardRepository.save(card)

    return card
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('update-card'))
  @Mutation(() => Card, { nullable: true })
  async updateCard(
    @Arg('id', () => Int) id: number,
    @Arg('title', { nullable: true }) title: string | null,
    @Arg('description', { nullable: true }) description: string | null,
    @Ctx() { }: ContextType): Promise<Card | null> {
    const card = await CardRepository.findOneBy({ id })

    card.title = title ?? card.title
    card.description = description ?? card.description

    await CardRepository.save(card)

    return card
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('update-card'))
  @Mutation(() => Card, { nullable: true })
  async moveCard(
    @Arg('id', () => Int) id: number,
    @Arg('toIndex', () => Int) toIndex: number,
    @Arg('toColumnId', () => Int) toColumnId: number,
    @Ctx() { }: ContextType): Promise<Card | null> {
    const card = await CardRepository.findOneBy({ id })
    const fromIndex = card.index
    const fromColumnId = card.columnId

    await dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Card)

      // Is moving within the same column
      if (fromColumnId === toColumnId) {
        let method: "increment" | 'decrement' = undefined
        let operator: FindOperator<number> = undefined

        const isMovingUp = toIndex > fromIndex
        if (isMovingUp) {
          method = 'decrement'
          operator = Between(fromIndex + 1, toIndex)
        } else {
          method = 'increment'
          operator = MoreThanOrEqual(toIndex)
        }

        await repository[method]({ index: operator, columnId: toColumnId }, 'index', 1)
      } else {
        await repository.decrement({ index: MoreThan(fromIndex), columnId: fromColumnId }, 'index', 1)
        await repository.increment({ index: MoreThanOrEqual(toIndex), columnId: toColumnId }, 'index', 1)
      }

      card.index = toIndex
      card.columnId = toColumnId

      await repository.save(card)
    })

    return card
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('delete-card'))
  @Mutation(() => Int, { nullable: true })
  async removeCard(
    @Arg('id', () => Int) id: number,
    @Ctx() { }: ContextType): Promise<number | null> {
    const { index, columnId } = await CardRepository.findOneBy({ id })

    await dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Card)

      await repository.decrement({ index: MoreThan(index), columnId }, 'index', 1)
      await repository.delete({ id })
    })

    return id
  }
}
