import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Board } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { FavoritesRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Board)
export class FavoritesResolver {
  @UseMiddleware(Authenticate)
  @Query(() => [Board])
  async allFavorites(
    @Ctx() { user }: ContextType): Promise<Board[]> {
    const favorites = await FavoritesRepository.find({
      where: { user: { id: user.id } },
      relations: { board: true }
    })

    return favorites
      .map(({ board }) => board)
      .filter(board => !!board) // Some boards may be soft-deleted, that's why we filter the falsy elements
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('view-board'))
  @Mutation(() => Boolean)
  async addToFavorites(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: ContextType): Promise<Boolean | null> {
    await FavoritesRepository.upsert({
      userId: user.id,
      boardId: id,
    },
      ['userId', 'boardId']
    )

    return true
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('view-board'))
  @Mutation(() => Boolean)
  async removeFromFavorites(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: ContextType): Promise<Boolean | null> {
    await FavoritesRepository.delete({ userId: user.id, boardId: id })

    return true
  }
}
