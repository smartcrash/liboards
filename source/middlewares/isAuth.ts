import { MiddlewareFn } from "type-graphql";
import { TContext } from '../types'


export const isAuth: MiddlewareFn<TContext> = async ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated");
  }

  return next()
}
