import { dataSource } from "../dataSource";
import { Favorite } from "../entity";

export const favoritesRepository = dataSource.getRepository(Favorite)
