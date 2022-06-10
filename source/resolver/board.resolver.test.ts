import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { SESSION_COOKIE } from '../constants';
import { dataSource } from '../dataSource';
import { Board } from '../entity';

const createBoard = async (userId: number): Promise<Board> => {
  const repository = dataSource.getRepository(Board)

  const board = new Board()

  board.title = faker.lorem.words()
  board.description = faker.lorem.paragraphs()
  board.userId = userId

  await repository.save(board)

  return board
}

test.group('createBoard', () => {
  test('should throw error not authenticated', async ({ expect, client }) => {
    const queryData = {
      query: `
        mutation CreateBoard {
          createBoard {
            id
            title
            description
          }
        }
      `,
      variables: {}
    };

    const response = await client.post('/').json(queryData)
    const { data, errors } = response.body()

    expect(data).toBeNull()
    expect(errors).toBeDefined()
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toBe('not authenticated')
  })

  test('should create board', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const title = faker.lorem.words()
    const description = faker.lorem.sentences()

    const queryData = {
      query: `
        mutation Mutation($description: String, $title: String) {
          createBoard(description: $description, title: $title) {
            id
            title
            description
          }
        }
      `,
      variables: {
        title,
        description
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.createBoard).toBeDefined()
    expect(data.createBoard.title).toBe(title)
    expect(data.createBoard.description).toBe(description)

    const { id } = data.createBoard
    const board = await dataSource.getRepository(Board).findOneBy({ id })

    expect(board).toBeDefined()
    expect(board).toMatchObject({ title, description })
    expect(board.userId).toBe(user.id)
  })
})

test.group('boards', () => {
  test('should throw error not authenticated', async ({ expect, client }) => {
    const queryData = {
      query: `
        {
          boards {
            id
          }
        }
      `,
      variables: {}
    };

    const response = await client.post('/').json(queryData)
    const { data, errors } = response.body()

    expect(data).toBeNull()
    expect(errors).toBeDefined()
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toBe('not authenticated')
  })

  test('should return only user\'s boards', async ({ expect, client, createUser }) => {
    const [user1] = await createUser(client)
    const [user2, cookie] = await createUser(client)


    const _ = await createBoard(user1.id)
    const board2 = await createBoard(user2.id)

    const queryData = {
      query: `
        {
          boards {
            id
            user { id }
          }
        }
      `,
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.boards).toHaveLength(1)
    expect(data.boards[0].id).toBe(board2.id)
    expect(data.boards[0].user.id).toBe(user2.id)
  })
})

test.group('updateBoard', () => {
  test('should throw error not authenticated', async ({ expect, client }) => {
    const queryData = {
      query: `
        mutation UpdateBoard($id: Int!) {
          updateBoard(id: $id) {
            id
          }
        }
      `,
      variables: { id: 1 }
    };

    const response = await client.post('/').json(queryData)
    const { data, errors } = response.body()

    expect(data.updateBoard).toBeNull()
    expect(errors).toBeDefined()
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toBe('not authenticated')
  })

  test('should update Board and return updated entity', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id } = await createBoard(user.id)
    const title = faker.lorem.words()
    const description = faker.lorem.paragraphs()

    const queryData = {
      query: `
      mutation UpdateBoard($id: Int!, $title: String, $description: String) {
        board: updateBoard(id: $id, title: $title, description: $description) {
          id
          title
          description
        }
      }`,
      variables: {
        id,
        title,
        description
      }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.board.id).toBe(id)
    expect(data.board.title).toBe(title)
    expect(data.board.description).toBe(description)
  })

  test('should only set given properties', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id, title } = await createBoard(user.id)
    const description = faker.lorem.paragraphs()

    const queryData = {
      query: `
        mutation UpdateBoard($id: Int!, $title: String, $description: String) {
          board: updateBoard(id: $id, title: $title, description: $description) {
            id
            title
            description
          }
        }`,
      variables: {
        id,
        description
      }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.board.id).toBe(id)
    expect(data.board.title).toBe(title)
    expect(data.board.description).toBe(description)
  })

  test('should only be allowed to update if is owner, return `null` otherwise', async ({ expect, client, createUser }) => {
    const [user1] = await createUser(client)
    const [, cookie] = await createUser(client)

    const board1 = await createBoard(user1.id)

    const queryData = {
      query: `
        mutation UpdateBoard($id: Int!, $title: String, $description: String) {
          board: updateBoard(id: $id, title: $title, description: $description) {
            id
            title
            description
          }
        }`,
      variables: {
        id: board1.id,
        description: faker.lorem.paragraph()
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.board).toBeNull()

    const board = await dataSource.getRepository(Board).findOneBy({ id: board1.id })

    expect(board).toBeDefined()
    expect(board.description).toBe(board1.description) // It should not have changed
  })
})
