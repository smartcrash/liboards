import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { dataSource } from '../dataSource';
import { User } from '../entity';

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

    const { id } = data.createUser
    const user = await dataSource.getRepository(User).findOneBy({ id })

    expect(user).toBeDefined()
    expect(user).toMatchObject({ username, email })
    expect(user.password).not.toBe(password)

    expect(response.cookie('sid')).toBeDefined()
    expect(response.cookie('sid').value).not.toHaveLength(0)
  })
})

test.group('loginWithEmailAndPassword', () => {
  test('should return error if email does\'nt exist', async ({ expect, client }) => {
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    const queryData = {
      query: `
        mutation($email: String!, $password: String!) {
          loginWithEmailAndPassword(email: $email, password: $password) {
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

    expect(data.loginWithEmailAndPassword.user).toBeNull()

    expect(data.loginWithEmailAndPassword.errors).not.toBeNull()
    expect(data.loginWithEmailAndPassword.errors).toHaveLength(1)
    expect(data.loginWithEmailAndPassword.errors[0].field).toBe('email')
    expect(data.loginWithEmailAndPassword.errors[0].message).toBe("This email does\'nt exists.")
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
          loginWithEmailAndPassword(email: $email, password: $password) {
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

    expect(data.loginWithEmailAndPassword.user).toBeNull()

    expect(data.loginWithEmailAndPassword.errors).not.toBeNull()
    expect(data.loginWithEmailAndPassword.errors).toHaveLength(1)
    expect(data.loginWithEmailAndPassword.errors[0].field).toBe('password')
    expect(data.loginWithEmailAndPassword.errors[0].message).toBe("Incorrect password, try again.")
  })

  test('cookie session should not exist if invalid data is given', async ({ expect, client }) => {
    const email = faker.internet.exampleEmail()
    const password = faker.internet.password()

    const queryData = {
      query: `
        mutation($email: String!, $password: String!) {
          loginWithEmailAndPassword(email: $email, password: $password) {
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

    expect(response.cookie('sid')).toBeUndefined()
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
          loginWithEmailAndPassword(email: $email, password: $password) {
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

    expect(data.loginWithEmailAndPassword.errors).toBeNull()
    expect(data.loginWithEmailAndPassword.user).toBeDefined()
    expect(data.loginWithEmailAndPassword.user).toMatchObject({ username, email })
    expect(typeof data.loginWithEmailAndPassword.user.id).toBe('number')

    expect(response.cookie('sid')).toBeDefined()
    expect(response.cookie('sid').value).not.toHaveLength(0)
  })
})

