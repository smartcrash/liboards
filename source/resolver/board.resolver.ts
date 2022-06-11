import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsNull, Not } from "typeorm";
import { Board } from "../entity";
import { isAuth } from "../middlewares/isAuth";
import { TContext } from '../types';

@Resolver(Board)
export class BoardResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Board])
  async allBoards(
    @Ctx() { req, dataSource }: TContext
  ): Promise<Board[]> {
    const { userId } = req.session

    return dataSource.getRepository(Board).findBy({ userId })
  }

  @UseMiddleware(isAuth)
  @Query(() => [Board])
  async allDeletedBoards(
    @Ctx() { req, dataSource }: TContext
  ): Promise<Board[]> {
    const { userId } = req.session

    return dataSource
      .getRepository(Board)
      .find({
        where: {
          userId,
          deletedAt: Not(IsNull()),
        },
        withDeleted: true
      })
  }

  @UseMiddleware(isAuth)
  @Query(() => Board, { nullable: true })
  async findBoardById(
    @Arg('id', () => Int) id: number,
    @Ctx() { req, dataSource }: TContext
  ): Promise<Board> {
    return dataSource
      .getRepository(Board)
      .findOne({
        relations: { user: true },
        where: {
          id,
          userId: req.session.userId
        }
      })
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Board)
  async createBoard(
    @Arg('title') title: string,
    @Arg('description', () => String, { nullable: true }) description: string,
    @Ctx() { req, dataSource }: TContext
  ): Promise<Board> {
    const repository = dataSource.getRepository(Board)

    const board = new Board()

    board.title = title
    board.description = description
    board.userId = req.session.userId

    await repository.save(board)

    return board
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Board, { nullable: true })
  async updateBoard(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string | null,
    @Arg('description', () => String, { nullable: true }) description: string | null,
    @Ctx() { req, dataSource }: TContext
  ): Promise<Board | null> {
    const { userId } = req.session
    const repository = dataSource.getRepository(Board)

    const board = await repository.findOneBy({ id, userId })

    if (!board) return null

    board.title = title ?? board.title
    board.description = description ?? board.description

    await repository.save(board)

    return board
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Int, { nullable: true })
  async deleteBoard(
    @Arg('id', () => Int) id: number,
    @Ctx() { req, dataSource }: TContext
  ): Promise<number | null> {
    const { userId } = req.session
    const repository = dataSource.getRepository(Board)
    const board = await repository.findOneBy({ id, userId })

    await repository.softDelete({ id, userId })

    return board.id
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Int, { nullable: true })
  async restoreBoard(
    @Arg('id', () => Int) id: number,
    @Ctx() { req, dataSource }: TContext
  ): Promise<number | null> {
    const { userId } = req.session

    await dataSource.getRepository(Board).restore({ id, userId })

    return id
  }
}
