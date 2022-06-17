import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Board } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { BoardRepository, UserRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Board)
export class FavoritesResolver {
  @UseMiddleware(Authenticate)
  @Query(() => [Board])
  async allFavorites(
    @Ctx() { req }: ContextType): Promise<Board[]> {
    const { userId } = req.session
    const user = await UserRepository.findOneOrFail({
      where: { id: userId },
      relations: { favorites: true }
    })

    return user.favorites
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('view-board'))
  @Mutation(() => Boolean)
  async addToFavorites(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: ContextType): Promise<Boolean | null> {
    const { userId } = req.session
    const board = await BoardRepository.findOneByOrFail({ id })
    const user = await UserRepository.findOneOrFail({
      where: { id: userId },
      relations: { favorites: true }
    })

    user.favorites = [...user.favorites, board]

    await UserRepository.save(user)

    return true
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('view-board'))
  @Mutation(() => Boolean)
  async removeFromFavorites(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: ContextType): Promise<Boolean | null> {
    const { userId } = req.session
    const user = await UserRepository.findOneOrFail({
      where: { id: userId },
      relations: { favorites: true }
    })
    user.favorites = user.favorites.filter((favorite) => favorite.id !== id)
    await UserRepository.save(user)

    return true
  }
}
