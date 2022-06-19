import { Board, User } from "../entity";
import { Policy } from "../types";

export class BoardPolicy implements Policy {
  viewAny(user: User) {
    return !!user
  }

  view(user: User, board: Board) {
    return user.id === board.createdById
  }

  create(user: User) {
    return !!user
  }

  update(user: User, board: Board) {
    return user.id === board.createdById
  }

  delete(user: User, board: Board) {
    return user.id === board.createdById
  }

  restore(user: User, board: Board) {
    return user.id === board.createdById
  }

  forceDelete(user: User, board: Board) {
    return user.id === board.createdById
  }
}
