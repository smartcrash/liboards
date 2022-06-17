import { faker } from '@faker-js/faker'
import { define, factory } from 'typeorm-seeding'
import { Board } from '../entity'

define(Board, () => {
  const board = new Board()
  board.title = faker.lorem.words(2)
  return board
})

export const boardFactory = () => factory(Board)()
