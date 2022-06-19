import { dataSource } from "../dataSource";
import { Comment } from "../entity";

export const CommentRepository = dataSource.getRepository(Comment)
