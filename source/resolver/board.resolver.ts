import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Board } from "../entity";
import { isAuth } from "../middlewares/isAuth";
import { TContext } from '../types';

@Resolver(Board)
export class BoardResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Board)
  async createBoard(
    @Arg('title', () => String, { nullable: true }) title: string,
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

}
