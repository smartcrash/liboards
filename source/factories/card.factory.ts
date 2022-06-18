import { faker } from '@faker-js/faker'
import { define, factory } from 'typeorm-seeding'
import { Card } from '../entity'

define(Card, () => {
  const card = new Card()
  card.title = faker.lorem.words(2)
  card.description = faker.lorem.sentences()
  return card
})

export const cardFactory = factory(Card)()
