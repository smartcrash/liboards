import { groupBy } from "lodash";
import type DataLoader from "dataloader";
import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { In, IsNull, Not } from "typeorm";
import { Board } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { BoardRepository, FavoritesRepository } from "../repository";
import { ContextType } from '../types';

@Resolver(Board)
export class BoardResolver {
  @FieldResolver(() => Boolean)
  @Loader<number, boolean>(async (ids, { context }) => {
    const { id: userId } = (context as ContextType).user

    const favorites = await FavoritesRepository.find({
      where: {
        userId,
        boardId: In([...ids])
      }
    })
    const favoritesById = groupBy(favorites, 'boardId')
    return ids.map((id) => !!favoritesById[id]);

  })
  async favorite(@Root() root: Board) {
    return (dataloader: DataLoader<number, boolean>) => dataloader.load(root.id);
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('viewAny-board'))
  @Query(() => [Board])
  async allBoards(
    @Ctx() { user }: ContextType
  ): Promise<Board[]> {
    const boards = await BoardRepository.findBy({ createdById: user.id })

    return boards
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('viewAny-board'))
  @Query(() => [Board])
  async allDeletedBoards(@Ctx() { user }: ContextType): Promise<Board[]> {
    return BoardRepository
      .find({
        where: { deletedAt: Not(IsNull()), createdById: user.id },
        order: { deletedAt: 'DESC' },
        withDeleted: true
      })
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('view-board'))
  @Query(() => Board, { nullable: true })
  async findBoardById(@Arg('id', () => Int) id: number): Promise<Board> {
    return BoardRepository.findOneBy({ id })
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('create-board'))
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
  @Mutation(() => Board)
  async updateBoard(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string | null,
  ): Promise<Board | null> {
    const board = await BoardRepository.findOneBy({ id })

    if (!board) return null

    board.title = title ?? board.title

    await BoardRepository.save(board)

    return board
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('delete-board'))
  @Mutation(() => Int)
  async deleteBoard(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: ContextType
  ): Promise<number | null> {
    await FavoritesRepository.delete({ userId: user.id, boardId: id })
    await BoardRepository.softDelete({ id })

    return id
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('restore-board'))
  @Mutation(() => Int, { nullable: true })
  async restoreBoard(@Arg('id', () => Int) id: number): Promise<number | null> {
    await BoardRepository.restore({ id })

    return id
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('forceDelete-board'))
  @Mutation(() => Int)
  async forceDeleteBoard(@Arg('id', () => Int) id: number): Promise<number | null> {
    await BoardRepository.delete({ id })

    return id
  }
}
