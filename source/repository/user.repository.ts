import { dataSource } from "../dataSource";
import { User } from "../entity";

export const userRepository = dataSource.getRepository(User)
