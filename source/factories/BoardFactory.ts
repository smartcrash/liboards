import { faker } from '@faker-js/faker'
import { Board } from '../entity'
import { EntityFactory } from '../EntityFactory'
import slug from '../utils/slug'

export const BoardFactory = new EntityFactory(Board, () => {
  const board = new Board()
  board.title = faker.lorem.words(2)
  board.slug = slug(board.title, faker.datatype.number())
  return board
})
