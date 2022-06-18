import { faker } from '@faker-js/faker'
import { define, factory } from 'typeorm-seeding'
import { User } from '../entity'

define(User, () => {
  const user = new User()
  user.username = faker.internet.userName()
  user.email = faker.internet.email()
  user.password = faker.internet.password()
  return user
})

export const userFactory = factory(User)()
