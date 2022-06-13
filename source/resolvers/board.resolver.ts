import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsNull, Not } from "typeorm";
import { dataSource } from "../dataSource";
import { Board } from "../entity";
import { Authenticate } from "../middlewares/Authenticate";
import { ContextType } from '../types';

@Resolver(Board)
export class BoardResolver {
  @UseMiddleware(Authenticate)
  @Query(() => [Board])
  async allBoards(
    @Ctx() { req }: ContextType
  ): Promise<Board[]> {
    const { userId } = req.session

    return dataSource.getRepository(Board).findBy({ createdById: userId })
  }

  @UseMiddleware(Authenticate)
  @Query(() => [Board])
  async allDeletedBoards(
    @Ctx() { req }: ContextType
  ): Promise<Board[]> {
    const { userId } = req.session

    return dataSource
      .getRepository(Board)
      .find({
        where: {
          createdById: userId,
          deletedAt: Not(IsNull()),
        },
        withDeleted: true
      })
  }

  @UseMiddleware(Authenticate)
  @Query(() => Board, { nullable: true })
  async findBoardById(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: ContextType
  ): Promise<Board> {
    const { userId } = req.session

    return dataSource
      .getRepository(Board)
      .findOne({
        relations: { createdBy: true },
        where: { id, createdById: userId }
      })
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Board)
  async createBoard(
    @Arg('title') title: string,
    @Arg('description', () => String, { nullable: true }) description: string,
    @Ctx() { req }: ContextType
  ): Promise<Board> {
    const { userId } = req.session
    const repository = dataSource.getRepository(Board)

    const board = new Board()

    board.title = title
    board.description = description
    board.createdById = userId

    await repository.save(board)

    return board
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Board, { nullable: true })
  async updateBoard(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string | null,
    @Arg('description', () => String, { nullable: true }) description: string | null,
    @Ctx() { req }: ContextType
  ): Promise<Board | null> {
    const { userId } = req.session
    const repository = dataSource.getRepository(Board)

    const board = await repository.findOneBy({ id, createdById: userId })

    if (!board) return null

    board.title = title ?? board.title
    board.description = description ?? board.description

    await repository.save(board)

    return board
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Int, { nullable: true })
  async deleteBoard(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: ContextType
  ): Promise<number | null> {
    const { userId } = req.session
    const repository = dataSource.getRepository(Board)
    const board = await repository.findOneBy({ id, createdById: userId })

    await repository.softDelete({ id, createdById: userId })

    return board.id
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Int, { nullable: true })
  async restoreBoard(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: ContextType
  ): Promise<number | null> {
    const { userId } = req.session

    await dataSource.getRepository(Board).restore({ id, createdById: userId })

    return id
  }
}
