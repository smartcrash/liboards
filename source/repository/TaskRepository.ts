import { dataSource } from "../dataSource";
import { Task } from "../entity";

export const TaskRepository = dataSource.getRepository(Task)
