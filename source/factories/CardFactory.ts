import { faker } from '@faker-js/faker'
import { Card } from '../entity'
import { EntityFactory } from '../EntityFactory'

export const CardFactory = () => new EntityFactory(Card, () => {
  const card = new Card()
  card.title = faker.lorem.words(2)
  card.description = faker.lorem.sentences()
  return card
})
