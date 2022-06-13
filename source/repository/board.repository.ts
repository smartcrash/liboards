import { dataSource } from "../dataSource";
import { Board } from "../entity";

export const BoardRepository = dataSource.getRepository(Board)
