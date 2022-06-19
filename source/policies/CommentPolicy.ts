
import { Comment, User } from "../entity";
import { CardRepository, ColumnRepository } from "../repository";
import { Policy } from "../types";

export class CommentPolicy implements Policy {
  viewAny(user: User) {
    return !!user
  }

  async view(user: User, comment: Comment) {
    const card = await CardRepository.findOneByOrFail({ id: comment.cardId })

    const column = await ColumnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  async create(user: User, comment: Comment) {
    const card = await CardRepository.findOneByOrFail({ id: comment.cardId })

    const column = await ColumnRepository.findOneOrFail({
      where: { id: card.columnId },
      relations: { board: true }
    })

    return column.board.createdById === user.id
  }

  update(user: User, comment: Comment) {
    return comment.userId === user.id
  }

  delete(user: User, comment: Comment) {
    return comment.userId === user.id
  }

  restore(user: User, comment: Comment) {
    return comment.userId === user.id
  }

  forceDelete(user: User, comment: Comment) {
    return comment.userId === user.id
  }
}
