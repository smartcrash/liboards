import { dataSource } from "../dataSource";
import { Column } from "../entity";

export const columnRepository = dataSource.getRepository(Column)
