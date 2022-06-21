import { faker } from '@faker-js/faker'
import { PasswordReset, User } from '../entity'
import { EntityFactory } from '../EntityFactory'

export const PasswordResetFactory = new EntityFactory(PasswordReset, () => {
  const pwdReset = new PasswordReset()
  pwdReset.email = faker.internet.email()
  pwdReset.token = faker.internet.password()
  return pwdReset
})
