import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Board } from "../entity";
import { isAuth } from "../middlewares/isAuth";
import { TContext } from '../types';

@Resolver()
export class BoardResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Board)
  async createBoard(
    @Arg('title', { nullable: true }) title: string,
    @Arg('description', { nullable: true }) description: string,
    @Ctx() { req, dataSource }: TContext
  ): Promise<Board> {
    const repository = dataSource.getRepository(Board)

    const board = new Board()

    board.title = title
    board.description = description
    board.authorId = req.session.userId

    await repository.save(board)

    return board
  }

}
