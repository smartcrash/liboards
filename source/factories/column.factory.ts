import { faker } from '@faker-js/faker'
import { define, factory } from 'typeorm-seeding'
import { Column } from '../entity'

define(Column, () => {
  const column = new Column()
  column.title = faker.lorem.words(2)
  // column.index = faker.datatype.number() // TODO: Maybe set default `index` at entity level
  column.cards = []
  return column
})

export const columnFactory = factory(Column)()
