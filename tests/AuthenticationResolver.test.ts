import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { verify } from 'argon2';
import { subHours } from 'date-fns';
import { SESSION_COOKIE } from '../source/constants';
import { User } from '../source/entity';
import { PasswordResetFactory, UserFactory } from '../source/factories';
import { UserRepository } from '../source/repository';

const LoginWithPasswordMutation = `
  mutation($email: String!, $password: String!) {
    loginWithPassword(email: $email, password: $password) {
      errors { field, message }
      user {
        id
        userName
        email
      }
    }
  }
`

const CreateUserMutation = `
  mutation($userName: String!, $email: String!, $password: String!) {
    createUser(userName: $userName, email: $email, password: $password) {
      errors { field, message }
      user {
        id
        userName
        email
      }
    }
  }
`

const ResetPasswordMutation = `
  mutation ResetPassword($newPassword: String!, $token: String!) {
    resetPassword(newPassword: $newPassword, token: $token) {
      errors {
        field
        message
      }
      user {
        id
      }
    }
  }
`

test.group('createUser', () => {
  test('should create user', async ({ expect, client }) => {
    const userName = faker.internet.userName()
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    const queryData = {
      query: CreateUserMutation,
      variables: {
        userName,
        email,
        password,
      }
    };

    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.createUser.errors).toBeNull()
    expect(data.createUser.user).toBeDefined()
    expect(data.createUser.user).toMatchObject({ userName, email })
    expect(typeof data.createUser.user.id).toBe('number')

    const { id } = data.createUser.user
    const user = await UserRepository.findOneBy({ id })

    expect(user).toBeDefined()
    expect(user).toMatchObject({ userName, email })
    expect(user.password).not.toBe(password)

    expect(response.cookie(SESSION_COOKIE)).toBeDefined()
    expect(response.cookie(SESSION_COOKIE).value).not.toHaveLength(0)
  })

  test('should validate values', async ({ expect, client }) => {
    const userName = 'al'
    const email = 'not an email'
    const password = '123'

    const queryData = {
      query: CreateUserMutation,
      variables: {
        userName,
        email,
        password,
      }
    };

    const response = await client.post('/').json(queryData)

    const { data } = response.body()

    expect(data.createUser.user).toBeNull()

    expect(data.createUser.errors).toBeDefined()
    expect(data.createUser.errors).toHaveLength(3)
    expect(data.createUser.errors).toContainEqual({ field: 'userName', message: 'The userName must contain at least 4 characters.' })
    expect(data.createUser.errors).toContainEqual({ field: 'email', message: 'Invalid email.' })
    expect(data.createUser.errors).toContainEqual({ field: 'password', message: 'The password must contain at least 4 characters.' })
  })

  test('should prevent duplicate `userName` and `email`', async ({ expect, client }) => {
    const userName = faker.internet.userName()
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    await UserFactory.create({ userName, email, password })

    const queryData = {
      query: CreateUserMutation,
      variables: {
        userName,
        email,
        password,
      }
    };

    const response = await client.post('/').json(queryData)

    const { data } = response.body()

    expect(data.createUser.user).toBeNull()

    expect(data.createUser.errors).toBeDefined()
    expect(data.createUser.errors).toHaveLength(2)
    expect(data.createUser.errors).toContainEqual({ field: 'userName', message: 'This userName already exists.' })
    expect(data.createUser.errors).toContainEqual({ field: 'email', message: 'This email is already in use.' })
  })
})

test.group('loginWithPassword', () => {
  test('should return error if email does\'nt exist', async ({ expect, client }) => {
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    const queryData = {
      query: LoginWithPasswordMutation,
      variables: { email, password, }
    }

    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.loginWithPassword.user).toBeNull()

    expect(data.loginWithPassword.errors).not.toBeNull()
    expect(data.loginWithPassword.errors).toHaveLength(1)
    expect(data.loginWithPassword.errors[0].field).toBe('email')
    expect(data.loginWithPassword.errors[0].message).toBe("This user does\'nt exists.")
  })

  test('should return error if password is incorrect', async ({ expect, client }) => {
    const userName = faker.internet.userName()
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()
    const otherPassword = faker.internet.password()

    await UserFactory.create({ userName: userName, email, password })


    const queryData = {
      query: LoginWithPasswordMutation,
      variables: { email, password: otherPassword }
    }

    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.loginWithPassword.user).toBeNull()

    expect(data.loginWithPassword.errors).not.toBeNull()
    expect(data.loginWithPassword.errors).toHaveLength(1)
    expect(data.loginWithPassword.errors[0].field).toBe('password')
    expect(data.loginWithPassword.errors[0].message).toBe("Incorrect password, try again.")
  })

  test('cookie session should not exist if invalid data is given', async ({ expect, client }) => {
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    const queryData = {
      query: LoginWithPasswordMutation,
      variables: { email, password, }
    }

    const response = await client.post('/').json(queryData)

    expect(response.cookie(SESSION_COOKIE)).toBeUndefined()
  })

  test('should start session if valid data is given', async ({ expect, client }) => {
    const userName = faker.internet.userName()
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    await UserFactory.create({ userName: userName, email, password })

    const queryData = {
      query: LoginWithPasswordMutation,
      variables: { email, password, }
    }

    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.loginWithPassword.errors).toBeNull()
    expect(data.loginWithPassword.user).toBeDefined()
    expect(data.loginWithPassword.user).toMatchObject({ userName, email })
    expect(typeof data.loginWithPassword.user.id).toBe('number')

    expect(response.cookie(SESSION_COOKIE)).toBeDefined()
    expect(response.cookie(SESSION_COOKIE).value).not.toHaveLength(0)
  })


  test('can login with `userName` instead of `email`', async ({ expect, client }) => {
    const userName = faker.internet.userName()
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    await UserFactory.create({ userName: userName, email, password })

    const queryData = {
      query: LoginWithPasswordMutation,
      variables: { email: userName, password, }
    }

    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.loginWithPassword.errors).toBeNull()
    expect(data.loginWithPassword.user).toBeDefined()
    expect(data.loginWithPassword.user).toMatchObject({ userName, email })

    expect(response.cookie(SESSION_COOKIE)).toBeDefined()
    expect(response.cookie(SESSION_COOKIE).value).not.toHaveLength(0)

  })

  test('`email` is case-insensitive', async ({ expect, client }) => {
    const userName = faker.internet.userName()
    const email = faker.internet.exampleEmail().toLowerCase()
    const password = faker.internet.password()

    await UserFactory.create({ userName: userName, email, password })

    const queryData = {
      query: LoginWithPasswordMutation,
      variables: { email: email.toUpperCase(), password }
    }

    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.loginWithPassword.errors).toBeFalsy()
    expect(data.loginWithPassword.user).toBeTruthy()
  })

  test('`userName` is case-insensitive', async ({ expect, client }) => {
    const userName = faker.internet.userName().toLowerCase()
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    await UserFactory.create({ userName: userName, email, password })

    const queryData = {
      query: LoginWithPasswordMutation,
      variables: { email: userName.toUpperCase(), password }
    }

    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.loginWithPassword.errors).toBeFalsy()
    expect(data.loginWithPassword.user).toBeTruthy()
  })
})

test.group('resetPassword', (group) => {
  test('should return error is token does not exists', async ({ expect, client }) => {
    const queryData = {
      query: ResetPasswordMutation,
      variables: {
        token: 'invalid token',
        newPassword: '12345'
      }
    }
    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.resetPassword.errors).toBeDefined()
    expect(data.resetPassword.errors).toHaveLength(1)
    expect(data.resetPassword.errors).toContainEqual({ field: 'token', message: 'Sorry, your token seems to have expired. Please try again.' })
  })

  test('should return error is token is expired', async ({ expect, client }) => {
    const user = await UserFactory.create()
    const pwdReset = await PasswordResetFactory.create({ email: user.email, createdAt: subHours(new Date(), 5) })

    const queryData = {
      query: ResetPasswordMutation,
      variables: {
        token: pwdReset.email,
        newPassword: '12345'
      }
    }
    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.resetPassword.errors).toBeDefined()
    expect(data.resetPassword.errors).toHaveLength(1)
    expect(data.resetPassword.errors).toContainEqual({ field: 'token', message: 'Sorry, your token seems to have expired. Please try again.' })
  })

  test('should handle non-existing user', async ({ expect, client }) => {
    const pwdReset = await PasswordResetFactory.create()

    const queryData = {
      query: ResetPasswordMutation,
      variables: {
        token: pwdReset.token,
        newPassword: '12345'
      }
    }
    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.resetPassword.errors).toBeDefined()
    expect(data.resetPassword.errors).toHaveLength(1)
    expect(data.resetPassword.errors).toContainEqual({ field: 'token', message: 'User no longer exists.' })
  })

  test('should change password with token', async ({ expect, client }) => {
    const oldPassword = faker.internet.password()
    const newPassword = faker.internet.password()

    const user = await UserFactory.create()
    const pwdReset = await PasswordResetFactory.create({ email: user.email })

    const queryData = {
      query: ResetPasswordMutation,
      variables: {
        token: pwdReset.token,
        newPassword,
      }
    }
    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.resetPassword.errors).toBeNull()
    expect(data.resetPassword.user).toBeDefined()
    expect(data.resetPassword.user.id).toBe(user.id)

    const { password } = await UserRepository.findOneBy({ id: user.id })
    expect(await verify(password, oldPassword)).toBe(false)
    expect(await verify(password, newPassword)).toBe(true)
  })
})

test.group('logout', () => {
  test('should end session', async ({ expect, client }) => {
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    await UserFactory.create({ email, password })

    {
      const queryData = {
        query: `
        mutation($email: String!, $password: String!) {
          loginWithPassword(email: $email, password: $password) {
            errors { field, message }
            user {
              id
              userName
              email
            }
          }
        }
      `,
        variables: { email, password, }
      }

      await client.post('/').json(queryData)
    }

    {
      const queryData = {
        query: `
          mutation Logout {
            logout
          }
      `,
      }
      const response = await client.post('/').json(queryData)

      const { data } = response.body()

      expect(data.logout).toBe(true)
      expect(response.cookie(SESSION_COOKIE).value).toBe('')
    }
  })
})

