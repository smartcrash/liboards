import { dataSource } from "../dataSource";
import { Comment } from "../entity";

export const commentRepository = dataSource.getRepository(Comment)
