import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Board } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { favoriteRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Board)
export class FavoritesResolver {
  @UseMiddleware(Authenticate)
  @Query(() => [Board])
  async allFavorites(
    @Ctx() { req }: ContextType): Promise<Board[]> {
    const { userId } = req.session

    const favorites = await favoriteRepository.find({
      where: { userId },
      relations: { board: true }
    })

    return favorites.map(({ board }) => board)
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('view-board'))
  @Mutation(() => Boolean)
  async addToFavorites(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: ContextType): Promise<Boolean | null> {
    const { userId } = req.session

    await favoriteRepository.upsert({ userId, boardId: id }, ['userId', 'boardId'])

    return true
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('view-board'))
  @Mutation(() => Boolean)
  async removeFromFavorites(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: ContextType): Promise<Boolean | null> {
    const { userId } = req.session

    await favoriteRepository.delete({ userId, boardId: id })

    return true
  }
}
