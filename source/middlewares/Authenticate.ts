import { MiddlewareFn } from "type-graphql";
import { dataSource } from "../dataSource";
import { User } from "../entity";
import { ContextType } from '../types'

export const Authenticate: MiddlewareFn<ContextType> = async ({ context }, next) => {
  const { userId } = context.req.session
  const userRepository = dataSource.getRepository(User)
  const user = await userRepository.findOneBy({ id: userId })

  if (!userId || !user) {
    throw new Error("not authenticated");
  }

  context.user = user

  return next()
}
