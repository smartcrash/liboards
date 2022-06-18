import { faker } from '@faker-js/faker'
import { define, factory } from 'typeorm-seeding'
import { Card } from '../entity'

define(Card, () => {
  const card = new Card()
  card.title = faker.lorem.words(2)
  card.description = faker.lorem.sentences()
  card.index = faker.datatype.number() // TODO: Maybe set default `index` at entity level
  return card
})

export const cardFactory = factory(Card)()
