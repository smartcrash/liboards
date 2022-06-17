import { dataSource } from "../dataSource";
import { Favorite } from "../entity";

export const favoriteRepository = dataSource.getRepository(Favorite)
