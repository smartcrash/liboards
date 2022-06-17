import { dataSource } from "../dataSource";
import { Board } from "../entity";

export const boardRepository = dataSource.getRepository(Board)
