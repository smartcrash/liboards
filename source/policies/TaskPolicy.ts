import { Task, User } from "../entity";
import { cardRepository, columnRepository } from "../repository";
import { Policy } from "../types";

export class TaskPolicy implements Policy {
  viewAny(user: User) {
    return !!user
  }

  async view(user: User, task: Task) {
    const card = await cardRepository.findOneByOrFail({ id: task.cardId })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  async create(user: User, task: Task) {
    const card = await cardRepository.findOneByOrFail({ id: task.cardId })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  async update(user: User, task: Task) {
    const card = await cardRepository.findOneByOrFail({ id: task.cardId })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  async delete(user: User, task: Task) {
    const card = await cardRepository.findOneByOrFail({ id: task.cardId })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  async restore(user: User, task: Task) {
    const card = await cardRepository.findOneByOrFail({ id: task.cardId })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  async forceDelete(user: User, task: Task) {
    const card = await cardRepository.findOneByOrFail({ id: task.cardId })

    const column = await columnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }
}
