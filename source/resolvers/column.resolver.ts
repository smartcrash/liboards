
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { dataSource } from "../dataSource";
import { Board, Column } from "../entity";
import { Authenticate } from "../middlewares/Authenticate";
import { ContextType } from "../types";

@Resolver(Column)
export class ColumnResolver {
  @UseMiddleware(Authenticate)
  @Mutation(() => Column, { nullable: true })
  async addColumn(
    @Arg('boardId', () => Int) boardId: number,
    @Arg('title') title: string,
    @Arg('index', () => Int, { nullable: true }) index: number = 0,
    @Ctx() { req }: ContextType): Promise<Column | null> {
    const { userId } = req.session
    const board = await dataSource.getRepository(Board).findOneBy({ id: boardId, createdById: userId })

    if (!board) return null

    const column = new Column()

    column.title = title
    column.index = index
    column.boardId = boardId

    await dataSource.getRepository(Column).save(column)

    return column
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Column, { nullable: true })
  async updateColumn(
    @Arg('id', () => Int) id: number,
    @Arg('title', { nullable: true }) title: string | null,
    @Arg('index', () => Int, { nullable: true }) index: number | null,
    @Ctx() { req }: ContextType): Promise<Column | null> {
    const { userId } = req.session
    const repository = dataSource.getRepository(Column)
    const column = await repository.findOne({ where: { id }, relations: ['board'] })

    if (column.board.createdById !== userId) return null

    column.title = title ?? column.title
    column.index = index ?? column.index

    await repository.save(column)

    return column
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Int, { nullable: null })
  async deleteColumn(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: ContextType): Promise<number | null> {
    const { userId } = req.session
    const repository = dataSource.getRepository(Column)
    const column = await repository.findOne({ where: { id }, relations: ['board'] })

    if (column.board.createdById !== userId) return null

    await repository.delete({ id })

    return column.id
  }
}
