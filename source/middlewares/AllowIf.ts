
import { MiddlewareFn, ResolverData } from "type-graphql";
import { boardRepository, cardRepository, columnRepository } from "../repository";
import { ContextType } from '../types';

type GateFn = (action: ResolverData<ContextType>) => Promise<boolean>

const gates: Readonly<Record<string, GateFn>> = {
  /* -------------------------------------------------------------------------- */
  /*                                    Board                                   */
  /* -------------------------------------------------------------------------- */

  async 'view-board'({ context: { user }, args }) {
    const { id } = args
    const board = await boardRepository.findOneBy({ id })

    return user.id === board.createdById
  },

  async 'update-board'({ context: { user }, args }) {
    const { id } = args
    const board = await boardRepository.findOneBy({ id })

    return user.id === board.createdById
  },

  async 'delete-board'({ context: { user }, args }) {
    const { id } = args
    const board = await boardRepository.findOneBy({ id })

    return user.id === board.createdById
  },

  async 'restore-board'({ context: { user }, args }) {
    const { id } = args
    const board = await boardRepository.findOne({ where: { id }, withDeleted: true })

    return user.id === board.createdById
  },

  /* -------------------------------------------------------------------------- */
  /*                                   Column                                   */
  /* -------------------------------------------------------------------------- */

  async 'create-column'({ context: { user }, args }) {
    const { boardId } = args
    const board = await boardRepository.findOneBy({ id: boardId, createdById: user.id })

    return !!board
  },

  async 'update-column'({ context: { user }, args }) {
    const { id } = args
    const column = await columnRepository.findOne({ where: { id }, relations: ['board'] })

    return column.board.createdById === user.id
  },

  async 'delete-column'({ context: { user }, args }) {
    const { id } = args
    const column = await columnRepository.findOne({ where: { id }, relations: ['board'] })

    return column.board.createdById === user.id

  },

  /* -------------------------------------------------------------------------- */
  /*                                    Card                                    */
  /* -------------------------------------------------------------------------- */

  async 'view-card'({ context: { user }, args }) {
    const { id } = args

    const card = await cardRepository.findOneBy({ id })

    const column = await columnRepository.findOne({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  async 'create-card'({ context: { user }, args }) {
    const { columnId } = args

    const column = await columnRepository.findOne({
      where: { id: columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  async 'update-card'({ context: { user }, args }) {
    const { id } = args
    const card = await cardRepository.findOneBy({ id })

    const column = await columnRepository.findOne({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  async 'delete-card'({ context: { user }, args }) {
    const { id } = args
    const card = await cardRepository.findOneBy({ id })

    const column = await columnRepository.findOne({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },
}

export const AllowIf = (gateKey: keyof typeof gates): MiddlewareFn<ContextType> => {
  return async (action, next) => {
    const handler = gates[gateKey]
    const allowed = await handler(action)

    if (!allowed) throw new Error("Forbidden");

    return next()
  }
}

