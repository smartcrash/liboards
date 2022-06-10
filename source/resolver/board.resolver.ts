import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
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
    return dataSource
      .getRepository(Board)
      .find({
        relations: { user: true },
        where: { userId: req.session.userId }
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
    @Arg('title', () => String, { nullable: true }) title: string | null,
    @Arg('description', () => String, { nullable: true }) description: string | null,
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
  ): Promise<Board | undefined> {
    const { userId } = req.session
    const repository = dataSource.getRepository(Board)

    const board = await repository.findOneBy({ id, userId })

    if (!board) return null

    board.title = title ?? board.title
    board.description = description ?? board.description

    await repository.save(board)

    return board
  }
}
