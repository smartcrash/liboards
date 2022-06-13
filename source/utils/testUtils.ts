import { faker } from "@faker-js/faker"
import { dataSource } from "../dataSource"
import { Board } from "../entity"

export const createRandomBoard = async (userId: number): Promise<Board> => {
  const repository = dataSource.getRepository(Board)

  const board = new Board()

  board.title = faker.lorem.words()
  board.description = faker.lorem.paragraphs()
  board.userId = userId

  await repository.save(board)

  return board
}
