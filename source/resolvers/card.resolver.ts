import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Card } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { CardRepository, ColumnRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Card)
export class CardResolver {
  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('create-card'))
  @Mutation(() => Card)
  async addCard(
    @Arg('title') title: string,
    @Arg('description', { nullable: true }) description: string | null,
    @Arg('index', () => Int, { nullable: true }) index: number | null,
    @Arg('columnId', () => Int) columnId: number,
    @Ctx() { }: ContextType): Promise<Card | null> {
    const card = new Card()

    card.title = title
    card.description = description
    card.index = index ?? ((await CardRepository.countBy({ columnId })))
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
    @Arg('index', () => Int, { nullable: true }) index: number | null,
    @Ctx() { }: ContextType): Promise<Card | null> {
    const card = await CardRepository.findOneBy({ id })

    card.title = title ?? card.title
    card.description = description ?? card.description
    card.index = index ?? card.index

    await CardRepository.save(card)

    return card
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('delete-card'))
  @Mutation(() => Int, { nullable: true })
  async removeCard(
    @Arg('id', () => Int) id: number,
    @Ctx() { }: ContextType): Promise<number | null> {
    await CardRepository.delete({ id })

    return id
  }
}
