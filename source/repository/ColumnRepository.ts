import { dataSource } from "../dataSource";
import { Column } from "../entity";

export const ColumnRepository = dataSource.getRepository(Column)
