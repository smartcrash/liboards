import { faker } from '@faker-js/faker'
import { User } from '../entity'
import { EntityFactory } from '../EntityFactory'

export const UserFactory = new EntityFactory(User, () => {
  const user = new User()
  user.username = faker.internet.userName()
  user.email = faker.internet.email()
  user.password = faker.internet.password()
  return user
})
