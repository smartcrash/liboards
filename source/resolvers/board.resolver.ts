import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsNull, Not } from "typeorm";
import { Board } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { BoardRepository } from "../repository";
import { ContextType } from '../types';

@Resolver(Board)
export class BoardResolver {
  @UseMiddleware(Authenticate)
  @Query(() => [Board])
  async allBoards(
    @Ctx() { user }: ContextType
  ): Promise<Board[]> {
    const boards = await BoardRepository.findBy({ createdById: user.id })

    return boards
  }

  @UseMiddleware(Authenticate)
  @Query(() => [Board])
  async allDeletedBoards(
    @Ctx() { user }: ContextType
  ): Promise<Board[]> {
    return BoardRepository
      .find({
        where: {
          createdById: user.id,
          deletedAt: Not(IsNull()),
        },
        withDeleted: true
      })
  }

  @UseMiddleware(Authenticate)
  @Query(() => Board, { nullable: true })
  async findBoardById(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: ContextType
  ): Promise<Board> {
    return BoardRepository
      .findOne({
        relations: { createdBy: true },
        where: { id, createdById: user.id }
      })
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Board)
  async createBoard(
    @Arg('title') title: string,
    @Ctx() { user }: ContextType
  ): Promise<Board> {
    const board = new Board()

    board.title = title
    board.createdById = user.id

    await BoardRepository.save(board)

    return board
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('update-board'))
  @Mutation(() => Board, { nullable: true })
  async updateBoard(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string | null,
    @Ctx() { user }: ContextType
  ): Promise<Board | null> {
    const board = await BoardRepository.findOneBy({ id, createdById: user.id })

    if (!board) return null

    board.title = title ?? board.title

    await BoardRepository.save(board)

    return board
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('delete-board'))
  @Mutation(() => Int, { nullable: true })
  async deleteBoard(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: ContextType
  ): Promise<number | null> {
    await BoardRepository.softDelete({ id, createdById: user.id })

    return id
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('restore-board'))
  @Mutation(() => Int, { nullable: true })
  async restoreBoard(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: ContextType
  ): Promise<number | null> {
    await BoardRepository.restore({ id, createdById: user.id })

    return id
  }
}
