import { dataSource } from "../dataSource";
import { Task } from "../entity";

export const taskRepository = dataSource.getRepository(Task)
