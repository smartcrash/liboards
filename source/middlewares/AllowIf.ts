
import { MiddlewareFn, ResolverData } from "type-graphql";
import { BoardRepository, CardRepository, ColumnRepository } from "../repository";
import { ContextType } from '../types';

const gates = {
  /* -------------------------------------------------------------------------- */
  /*                                    Board                                   */
  /* -------------------------------------------------------------------------- */

  async 'update-board'({ context: { user }, args }: ResolverData<ContextType>): Promise<boolean> {
    const { id } = args
    const board = await BoardRepository.findOneBy({ id })

    return user.id === board.createdById
  },

  async 'delete-board'({ context: { user }, args }: ResolverData<ContextType>): Promise<boolean> {
    const { id } = args
    const board = await BoardRepository.findOneBy({ id })

    return user.id === board.createdById
  },

  async 'restore-board'({ context: { user }, args }: ResolverData<ContextType>): Promise<boolean> {
    const { id } = args
    const board = await BoardRepository.findOne({ where: { id }, withDeleted: true })

    return user.id === board.createdById
  },

  /* -------------------------------------------------------------------------- */
  /*                                   Column                                   */
  /* -------------------------------------------------------------------------- */

  async 'create-column'({ context: { user }, args }: ResolverData<ContextType>): Promise<boolean> {
    const { boardId } = args
    const board = await BoardRepository.findOneBy({ id: boardId, createdById: user.id })

    return !!board
  },

  async 'update-column'({ context: { user }, args }: ResolverData<ContextType>): Promise<boolean> {
    const { id } = args
    const column = await ColumnRepository.findOne({ where: { id }, relations: ['board'] })

    return column.board.createdById === user.id
  },

  async 'delete-column'({ context: { user }, args }: ResolverData<ContextType>): Promise<boolean> {
    const { id } = args
    const column = await ColumnRepository.findOne({ where: { id }, relations: ['board'] })

    return column.board.createdById === user.id

  },

  /* -------------------------------------------------------------------------- */
  /*                                    Card                                    */
  /* -------------------------------------------------------------------------- */

  async 'create-card'({ context: { user }, args }: ResolverData<ContextType>): Promise<boolean> {
    const { columnId } = args

    const column = await ColumnRepository.findOne({
      where: { id: columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  async 'update-card'({ context: { user }, args }: ResolverData<ContextType>): Promise<boolean> {
    const { id } = args
    const card = await CardRepository.findOneBy({ id })

    const column = await ColumnRepository.findOne({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  async 'delete-card'({ context: { user }, args }: ResolverData<ContextType>): Promise<boolean> {
    const { id } = args
    const card = await CardRepository.findOneBy({ id })

    const column = await ColumnRepository.findOne({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },
} as const

export const AllowIf = (gateKey: keyof typeof gates): MiddlewareFn<ContextType> => {
  return async (action, next) => {
    const handler = gates[gateKey]
    const allowed = await handler(action)

    if (!allowed) throw new Error("Forbidden");

    return next()
  }
}

