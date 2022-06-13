import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { dataSource } from "../dataSource";
import { Card, Column } from "../entity";
import { Authenticate } from "../middlewares/Authenticate";
import { ContextType } from "../types";

@Resolver(Card)
export class CardResolver {
  @UseMiddleware(Authenticate)
  @Mutation(() => Card, { nullable: true })
  async createCard(
    @Arg('columnId', () => Int) columnId: number,
    @Arg('title') title: string,
    @Arg('content', { nullable: true }) content: string | null,
    @Arg('index', () => Int, { nullable: true }) index: number = 0,
    @Ctx() { req }: ContextType): Promise<Card | null> {
    const { userId } = req.session
    const column = await dataSource
      .getRepository(Column)
      .findOne({
        where: { id: columnId },
        relations: ['board']
      })

    if (column.board.createdById !== userId) return null

    const card = new Card()

    card.title = title
    card.content = content
    card.index = index
    card.columnId = columnId

    await dataSource.getRepository(Card).save(card)

    return card
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Card, { nullable: true })
  async updateCard(
    @Arg('id', () => Int) id: number,
    @Arg('title', { nullable: true }) title: string | null,
    @Arg('content', { nullable: true }) content: string | null,
    @Arg('index', () => Int, { nullable: true }) index: number | null,
    @Ctx() { req }: ContextType): Promise<Card | null> {
    const { userId } = req.session
    const card = await dataSource.getRepository(Card).findOneBy({ id })

    if (!card) return null

    const column = await dataSource
      .getRepository(Column)
      .findOne({
        where: { id: card.columnId },
        relations: ['board']
      })

    if (column.board.createdById !== userId) return null

    card.title = title ?? card.title
    card.content = content ?? card.content
    card.index = index ?? card.index

    await dataSource.getRepository(Card).save(card)

    return card
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Int, { nullable: true })
  async deleteCard(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: ContextType): Promise<number | null> {
    const { userId } = req.session
    const card = await dataSource.getRepository(Card).findOneBy({ id })

    if (!card) return null

    const column = await dataSource
      .getRepository(Column)
      .findOne({
        where: { id: card.columnId },
        relations: ['board']
      })

    if (column.board.createdById !== userId) return null

    await dataSource.getRepository(Card).delete({ id })

    return card.id
  }
}
