import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Card } from "../entity";
import { Authenticate } from "../middlewares/Authenticate";
import { CardRepository, ColumnRepository } from "../repository";
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
    @Ctx() { user }: ContextType): Promise<Card | null> {
    const column = await ColumnRepository.findOne({
      where: { id: columnId },
      relations: ['board']
    })

    if (column.board.createdById !== user.id) return null

    const card = new Card()

    card.title = title
    card.content = content
    card.index = index
    card.columnId = columnId

    await CardRepository.save(card)

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
    const card = await CardRepository.findOneBy({ id })

    if (!card) return null

    const column = await ColumnRepository
      .findOne({
        where: { id: card.columnId },
        relations: ['board']
      })

    if (column.board.createdById !== userId) return null

    card.title = title ?? card.title
    card.content = content ?? card.content
    card.index = index ?? card.index

    await CardRepository.save(card)

    return card
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Int, { nullable: true })
  async deleteCard(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: ContextType): Promise<number | null> {
    const { userId } = req.session
    const card = await CardRepository.findOneBy({ id })

    if (!card) return null

    const column = await ColumnRepository
      .findOne({
        where: { id: card.columnId },
        relations: ['board']
      })

    if (column.board.createdById !== userId) return null

    await CardRepository.delete({ id })

    return card.id
  }
}
