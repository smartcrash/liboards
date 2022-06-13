import { dataSource } from "../dataSource";
import { User } from "../entity";

export const UserRepository = dataSource.getRepository(User)
