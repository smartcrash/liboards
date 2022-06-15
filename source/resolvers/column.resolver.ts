
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Column } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { ColumnRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Column)
export class ColumnResolver {
  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('create-column'))
  @Mutation(() => Column)
  async addColumn(
    @Arg('title') title: string,
    @Arg('boardId', () => Int) boardId: number,
    @Ctx() { }: ContextType): Promise<Column | null> {
    const column = new Column()

    column.title = title
    column.index = await ColumnRepository.countBy({ boardId })
    column.boardId = boardId

    await ColumnRepository.save(column)

    return column
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('update-column'))
  @Mutation(() => Column, { nullable: true })
  async updateColumn(
    @Arg('id', () => Int) id: number,
    @Arg('title', { nullable: true }) title: string | null,
    @Ctx() { }: ContextType): Promise<Column | null> {
    const column = await ColumnRepository.findOneBy({ id })

    column.title = title ?? column.title

    await ColumnRepository.save(column)

    return column
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Int, { nullable: null })
  @UseMiddleware(AllowIf('delete-column'))
  async removeColumn(
    @Arg('id', () => Int) id: number,
    @Ctx() { }: ContextType): Promise<number | null> {
    await ColumnRepository.delete({ id })

    return id
  }
}
