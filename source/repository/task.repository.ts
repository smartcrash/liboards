import { dataSource } from "../dataSource";
import { Taks } from "../entity";

export const taskRepository = dataSource.getRepository(Taks)
