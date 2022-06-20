import { faker } from '@faker-js/faker'
import { Board } from '../entity'
import { EntityFactory } from '../EntityFactory'

export const BoardFactory = () => new EntityFactory(Board, () => {
  const board = new Board()
  board.title = faker.lorem.words(2)
  return board
})
