
import { MiddlewareFn, ResolverData } from "type-graphql";
import { BoardRepository } from "../repository";
import { ContextType } from '../types';

const gates = {
  async 'update-board'({ context: { user }, args }: ResolverData<ContextType>) {
    const { id } = args
    const board = await BoardRepository.findOneBy({ id })

    return user.id === board.createdById
  },

  async 'delete-board'({ context: { user }, args }: ResolverData<ContextType>) {
    const { id } = args
    const board = await BoardRepository.findOneBy({ id })

    return user.id === board.createdById
  },

  async 'restore-board'({ context: { user }, args }: ResolverData<ContextType>) {
    const { id } = args
    const board = await BoardRepository.findOne({ where: { id }, withDeleted: true })

    return user.id === board.createdById
  }
} as const

export const AllowIf = (gateKey: keyof typeof gates): MiddlewareFn<ContextType> => {
  return async (action, next) => {
    const handler = gates[gateKey]
    const allowed = await handler(action)

    if (!allowed) throw new Error("Forbidden");

    return next()
  }
}

