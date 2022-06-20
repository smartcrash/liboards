import { faker } from '@faker-js/faker'
import { Column } from '../entity'
import { EntityFactory } from '../EntityFactory'


export const ColumnFactory = () => new EntityFactory(Column, () => {
  const column = new Column()
  column.title = faker.lorem.words(2)
  column.cards = []
  return column
})
