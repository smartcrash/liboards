import { MiddlewareFn } from "type-graphql";
import { userRepository } from "../repository";
import { ContextType } from '../types';

export const Authenticate: MiddlewareFn<ContextType> = async ({ context }, next) => {
  const { userId } = context.req.session
  const user = await userRepository.findOneBy({ id: userId })

  if (!userId || !user) {
    throw new Error("not authenticated");
  }

  context.user = user

  return next()
}
