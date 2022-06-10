import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { SESSION_COOKIE } from '../constants';
import { dataSource } from '../dataSource';
import { User } from '../entity';
import { redisClient } from '../redisClient';
import { verify } from 'argon2';
import sinon from 'sinon'

test.group('createUser', () => {
  test('should create user', async ({ expect, client }) => {
    const username = faker.internet.userName()
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    const queryData = {
      query: `
        mutation($username: String!, $email: String!, $password: String!) {
          createUser(username: $username, email: $email, password: $password) {
            errors { field, message }
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        username,
        email,
        password,
      }
    };

    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.createUser.errors).toBeNull()
    expect(data.createUser.user).toBeDefined()
    expect(data.createUser.user).toMatchObject({ username, email })
    expect(typeof data.createUser.user.id).toBe('number')

    const { id } = data.createUser.user
    const user = await dataSource.getRepository(User).findOneBy({ id })

    expect(user).toBeDefined()
    expect(user).toMatchObject({ username, email })
    expect(user.password).not.toBe(password)

    expect(response.cookie(SESSION_COOKIE)).toBeDefined()
    expect(response.cookie(SESSION_COOKIE).value).not.toHaveLength(0)
  })

  test('should validate values', async ({ expect, client }) => {
    const username = 'al'
    const email = 'not an email'
    const password = '123'

    const queryData = {
      query: `
        mutation($username: String!, $email: String!, $password: String!) {
          createUser(username: $username, email: $email, password: $password) {
            errors { field, message }
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        username,
        email,
        password,
      }
    };

    const response = await client.post('/').json(queryData)

    const { data } = response.body()

    expect(data.createUser.user).toBeNull()

    expect(data.createUser.errors).toBeDefined()
    expect(data.createUser.errors).toHaveLength(3)
    expect(data.createUser.errors).toContainEqual({ field: 'username', message: 'The username must contain at least 4 characters.' })
    expect(data.createUser.errors).toContainEqual({ field: 'email', message: 'Invalid email.' })
    expect(data.createUser.errors).toContainEqual({ field: 'password', message: 'The password must contain at least 4 characters.' })
  })

  test('should prevent duplicate `username` and `email`', async ({ expect, client }) => {
    const username = faker.internet.userName()
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    const user = new User()

    user.username = username
    user.email = email
    user.password = password

    await dataSource.getRepository(User).save(user)

    const queryData = {
      query: `
        mutation($username: String!, $email: String!, $password: String!) {
          createUser(username: $username, email: $email, password: $password) {
            errors { field, message }
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        username,
        email,
        password,
      }
    };

    const response = await client.post('/').json(queryData)

    const { data } = response.body()

    expect(data.createUser.user).toBeNull()

    expect(data.createUser.errors).toBeDefined()
    expect(data.createUser.errors).toHaveLength(2)
    expect(data.createUser.errors).toContainEqual({ field: 'username', message: 'This username already exists.' })
    expect(data.createUser.errors).toContainEqual({ field: 'email', message: 'This email is already in use.' })
  })
})

test.group('loginWithPassword', () => {
  test('should return error if email does\'nt exist', async ({ expect, client }) => {
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    const queryData = {
      query: `
        mutation($email: String!, $password: String!) {
          loginWithPassword(email: $email, password: $password) {
            errors { field, message }
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: { email, password, }
    }

    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.loginWithPassword.user).toBeNull()

    expect(data.loginWithPassword.errors).not.toBeNull()
    expect(data.loginWithPassword.errors).toHaveLength(1)
    expect(data.loginWithPassword.errors[0].field).toBe('email')
    expect(data.loginWithPassword.errors[0].message).toBe("This email does\'nt exists.")
  })

  test('should return error if password is incorrect', async ({ expect, client }) => {
    const username = faker.internet.userName()
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    // Create user
    await client.post('/').json({
      query: `
        mutation($username: String!, $email: String!, $password: String!) {
          createUser(username: $username, email: $email, password: $password) {
            errors { field, message }
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        username,
        email,
        password,
      }
    })

    const otherPassword = faker.internet.password()
    const queryData = {
      query: `
        mutation($email: String!, $password: String!) {
          loginWithPassword(email: $email, password: $password) {
            errors { field, message }
            user {
              id
              username
              email
            }
          }
        }
      `,
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
      query: `
        mutation($email: String!, $password: String!) {
          loginWithPassword(email: $email, password: $password) {
            errors { field, message }
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: { email, password, }
    }

    const response = await client.post('/').json(queryData)

    expect(response.cookie(SESSION_COOKIE)).toBeUndefined()
  })

  test('should start session if valid data is given', async ({ expect, client }) => {
    const username = faker.internet.userName()
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    // Create user
    await client.post('/').json({
      query: `
        mutation($username: String!, $email: String!, $password: String!) {
          createUser(username: $username, email: $email, password: $password) {
            errors { field, message }
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        username,
        email,
        password,
      }
    })

    const queryData = {
      query: `
        mutation($email: String!, $password: String!) {
          loginWithPassword(email: $email, password: $password) {
            errors { field, message }
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: { email, password, }
    }

    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.loginWithPassword.errors).toBeNull()
    expect(data.loginWithPassword.user).toBeDefined()
    expect(data.loginWithPassword.user).toMatchObject({ username, email })
    expect(typeof data.loginWithPassword.user.id).toBe('number')

    expect(response.cookie(SESSION_COOKIE)).toBeDefined()
    expect(response.cookie(SESSION_COOKIE).value).not.toHaveLength(0)
  })
})

test.group('resetPassword', () => {
  test('should return error is token is expired', async ({ expect, client }) => {
    sinon.replace(redisClient, 'get', sinon.fake.resolves('') as any)

    const queryData = {
      query: `
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
        }`,
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

  test('should handle non-existing user', async ({ expect, client }) => {
    sinon.replace(redisClient, 'get', sinon.fake.resolves('9999999999') as any)

    const queryData = {
      query: `
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
        }`,
      variables: {
        token: 'invalid token',
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

    const user = new User()

    user.username = faker.internet.userName()
    user.email = faker.internet.exampleEmail()
    user.password = oldPassword

    const { id } = await dataSource.getRepository(User).save(user)

    sinon.replace(redisClient, 'get', sinon.fake.resolves(`${id}`) as any)

    const queryData = {
      query: `
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
        }`,
      variables: {
        token: 'valid token',
        newPassword,
      }
    }
    const response = await client.post('/').json(queryData)
    const { data } = response.body()

    expect(data.resetPassword.errors).toBeNull()
    expect(data.resetPassword.user).toBeDefined()
    expect(data.resetPassword.user.id).toBe(id)

    const { password } = await dataSource.getRepository(User).findOneBy({ id })
    expect(await verify(password, oldPassword)).toBe(false)
    expect(await verify(password, newPassword)).toBe(true)

    sinon.restore()
  })
})

test.group('logout', () => {
  test('should end session', async ({ expect, client }) => {
    const username = faker.internet.userName()
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    const user = new User()

    user.username = username
    user.email = email
    user.password = password

    await dataSource.getRepository(User).save(user)

    {
      const queryData = {
        query: `
        mutation($email: String!, $password: String!) {
          loginWithPassword(email: $email, password: $password) {
            errors { field, message }
            user {
              id
              username
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

