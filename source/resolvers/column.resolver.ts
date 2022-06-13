
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Column } from "../entity";
import { Authenticate } from "../middlewares/Authenticate";
import { BoardRepository, ColumnRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Column)
export class ColumnResolver {
  @UseMiddleware(Authenticate)
  @Mutation(() => Column, { nullable: true })
  async addColumn(
    @Arg('boardId', () => Int) boardId: number,
    @Arg('title') title: string,
    @Arg('index', () => Int, { nullable: true }) index: number = 0,
    @Ctx() { user }: ContextType): Promise<Column | null> {
    const board = await BoardRepository.findOneBy({ id: boardId, createdById: user.id })

    if (!board) return null

    const column = new Column()

    column.title = title
    column.index = index
    column.boardId = boardId

    await ColumnRepository.save(column)

    return column
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Column, { nullable: true })
  async updateColumn(
    @Arg('id', () => Int) id: number,
    @Arg('title', { nullable: true }) title: string | null,
    @Arg('index', () => Int, { nullable: true }) index: number | null,
    @Ctx() { user }: ContextType): Promise<Column | null> {
    const column = await ColumnRepository.findOne({ where: { id }, relations: ['board'] })

    if (column.board.createdById !== user.id) return null

    column.title = title ?? column.title
    column.index = index ?? column.index

    await ColumnRepository.save(column)

    return column
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Int, { nullable: null })
  async deleteColumn(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: ContextType): Promise<number | null> {
    const column = await ColumnRepository.findOne({ where: { id }, relations: ['board'] })

    if (column.board.createdById !== user.id) return null

    await ColumnRepository.delete({ id })

    return column.id
  }
}
