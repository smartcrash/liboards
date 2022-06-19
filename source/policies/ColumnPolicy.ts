import { Column, User } from "../entity";
import { boardRepository } from "../repository";
import { Policy } from "../types";

export class ColumnPolicy implements Policy {
  viewAny(user: User) {
    return !!user
  }

  async view(user: User, column: Column) {
    const board = await boardRepository.findOneByOrFail({
      id: column.boardId,
      createdById: user.id
    })

    return !!board
  }

  async create(user: User, column: Column) {
    const board = await boardRepository.findOneByOrFail({
      id: column.boardId,
      createdById: user.id
    })

    return !!board
  }

  async update(user: User, column: Column) {
    const board = await boardRepository.findOneByOrFail({
      id: column.boardId,
      createdById: user.id
    })

    return !!board
  }

  async delete(user: User, column: Column) {
    const board = await boardRepository.findOneByOrFail({
      id: column.boardId,
      createdById: user.id
    })

    return !!board
  }

  async restore(user: User, column: Column) {
    const board = await boardRepository.findOneByOrFail({
      id: column.boardId,
      createdById: user.id
    })

    return !!board
  }

  async forceDelete(user: User, column: Column) {
    const board = await boardRepository.findOneByOrFail({
      id: column.boardId,
      createdById: user.id
    })

    return !!board
  }
}
