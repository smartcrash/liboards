
import { MiddlewareFn, ResolverData } from "type-graphql";
import { boardRepository, cardRepository, columnRepository, taskRepository } from "../repository";
import { ContextType } from '../types';

type GateFn = (action: ResolverData<ContextType>) => Promise<boolean>

const gates: Readonly<Record<string, GateFn>> = {
  /* -------------------------------------------------------------------------- */
  /*                                    Board                                   */
  /* -------------------------------------------------------------------------- */

  async 'view-board'({ context: { user }, args }) {
    const { id } = args
    const board = await boardRepository.findOneByOrFail({ id })

    return user.id === board.createdById
  },

  async 'update-board'({ context: { user }, args }) {
    const { id } = args
    const board = await boardRepository.findOneByOrFail({ id })

    return user.id === board.createdById
  },

  async 'delete-board'({ context: { user }, args }) {
    const { id } = args
    const board = await boardRepository.findOneByOrFail({ id })

    return user.id === board.createdById
  },

  async 'restore-board'({ context: { user }, args }) {
    const { id } = args
    const board = await boardRepository.findOneOrFail({ where: { id }, withDeleted: true })

    return user.id === board.createdById
  },

  /* -------------------------------------------------------------------------- */
  /*                                   Column                                   */
  /* -------------------------------------------------------------------------- */

  async 'create-column'({ context: { user }, args }) {
    const { boardId } = args
    const board = await boardRepository.findOneByOrFail({ id: boardId, createdById: user.id })

    return !!board
  },

  async 'update-column'({ context: { user }, args }) {
    const { id } = args
    const column = await columnRepository.findOneOrFail({ where: { id }, relations: ['board'] })

    return column.board.createdById === user.id
  },

  async 'delete-column'({ context: { user }, args }) {
    const { id } = args
    const column = await columnRepository.findOneOrFail({ where: { id }, relations: ['board'] })

    return column.board.createdById === user.id

  },

  /* -------------------------------------------------------------------------- */
  /*                                    Card                                    */
  /* -------------------------------------------------------------------------- */

  async 'view-card'({ context: { user }, args }) {
    const { id } = args

    const card = await cardRepository.findOneByOrFail({ id })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  async 'create-card'({ context: { user }, args }) {
    const { columnId } = args

    const column = await columnRepository.findOneOrFail({
      where: { id: columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  async 'update-card'({ context: { user }, args }) {
    const { id } = args
    const card = await cardRepository.findOneByOrFail({ id })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  async 'delete-card'({ context: { user }, args }) {
    const { id } = args
    const card = await cardRepository.findOneByOrFail({ id })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  /* -------------------------------------------------------------------------- */
  /*                                    Task                                    */
  /* -------------------------------------------------------------------------- */

  async 'create-task'({ context: { user }, args }) {
    const { cardId } = args
    const card = await cardRepository.findOneByOrFail({ id: cardId })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  async 'update-task'({ context: { user }, args }) {
    const { id } = args
    const task = await taskRepository.findOneByOrFail({ id })
    const card = await cardRepository.findOneByOrFail({ id: task.cardId })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  async 'delete-task'({ context: { user }, args }) {
    const { id } = args
    const task = await taskRepository.findOneByOrFail({ id })
    const card = await cardRepository.findOneByOrFail({ id: task.cardId })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },

  /* -------------------------------------------------------------------------- */
  /*                                  Comments                                  */
  /* -------------------------------------------------------------------------- */

  async 'create-comment'({ context: { user }, args }) {
    const { cardId } = args
    const card = await cardRepository.findOneByOrFail({ id: cardId })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  },
}

export const AllowIf = (gateKey: keyof typeof gates): MiddlewareFn<ContextType> => {
  return async (action, next) => {
    const handler = gates[gateKey]
    let allowed = false

    try {
      allowed = await handler(action)
    } catch (error) {
      // If the handler throws that means that one `findByOrFail` failed
      // because the entity was not faund. In that case we shouldn't allow
      // the user to do anything eather.
    }

    if (!allowed) throw new Error("Forbidden");

    return next()
  }
}

