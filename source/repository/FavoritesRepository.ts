import { dataSource } from "../dataSource";
import { Favorite } from "../entity";

export const FavoritesRepository = dataSource.getRepository(Favorite)
