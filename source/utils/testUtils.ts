import { faker } from "@faker-js/faker"
import { dataSource } from "../dataSource"
import { Board, Card, Column } from "../entity"

export const createRandomBoard = async (userId: number): Promise<Board> => {
  const repository = dataSource.getRepository(Board)

  const board = new Board()

  board.title = faker.lorem.words()
  board.description = faker.lorem.paragraphs()
  board.userId = userId

  await repository.save(board)

  return board
}

export const createRandomColumn = async (boardId: number): Promise<Column> => {
  const column = new Column()

  column.title = faker.lorem.words()
  column.index = faker.datatype.number()
  column.boardId = boardId

  await dataSource.getRepository(Column).save(column)

  return column
}

export const createRandomCard = async (columnId: number): Promise<Card> => {
  const card = new Card()

  card.title = faker.lorem.words()
  card.content = faker.lorem.sentences()
  card.index = faker.datatype.number()
  card.columnId = columnId

  await dataSource.getRepository(Card).save(card)

  return card
}
