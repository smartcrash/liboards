import { faker } from '@faker-js/faker'
import { define, factory } from 'typeorm-seeding'
import { Column } from '../entity'

define(Column, () => {
  const column = new Column()
  column.title = faker.lorem.words(2)
  column.cards = []
  return column
})

export const ColumnFactory = factory(Column)
