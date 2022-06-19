import { faker } from "@faker-js/faker"
import { ApiResponse } from "@japa/api-client"
import { Expect } from "@japa/expect"
import { test } from "@japa/runner"
import { Board, Card, Column } from "../entity"
import { BoardRepository, CardRepository, ColumnRepository } from "../repository"

export const createRandomBoard = async (userId: number): Promise<Board> => {
  const board = new Board()

  board.title = faker.lorem.words()
  board.createdById = userId

  await BoardRepository.save(board)

  return board
}

export const createRandomColumn = async (boardId: number, index = faker.datatype.number()): Promise<Column> => {
  const column = new Column()

  column.title = faker.lorem.words()
  // column.index = index
  column.boardId = boardId

  await ColumnRepository.save(column)

  return column
}

export const createRandomCard = async (columnId: number, index = faker.datatype.number(), title = faker.lorem.words()): Promise<Card> => {
  const card = new Card()

  card.title = title
  card.description = faker.lorem.sentences()
  card.index = index
  card.columnId = columnId

  await CardRepository.save(card)

  return card
}

export const testThrowsIfNotAuthenticated = (queryData: string | object) => {
  test('should throw error not authenticated', async ({ expect, client }) => {
    const response = await client.post('/').json(queryData)
    const { errors } = response.body()

    expect(errors).toBeDefined()
    expect(errors).toHaveLength(1)
    // TODO: Change maybe
    expect(errors[0].message).toBe('not authenticated')
  })
}

export const assertIsForbiddenExeption = ({ response, expect }: { response: ApiResponse, expect: Expect }) => {
  const { errors } = response.body()

  expect(errors).toBeDefined()
  expect(errors).toHaveLength(1)
  expect(errors[0].message).toBe('Forbidden')
}
