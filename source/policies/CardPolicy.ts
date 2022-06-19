import { Card, User } from "../entity";
import { ColumnRepository } from "../repository";
import { Policy } from "../types";

export class CardPolicy implements Policy {
  viewAny(user: User) {
    return !!user
  }

  async view(user: User, card: Card) {
    const column = await ColumnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  async create(user: User, card: Card) {
    const column = await ColumnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  async update(user: User, card: Card) {
    const column = await ColumnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  async delete(user: User, card: Card) {
    const column = await ColumnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  async restore(user: User, card: Card) {
    const column = await ColumnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  async forceDelete(user: User, card: Card) {
    const column = await ColumnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }
}
