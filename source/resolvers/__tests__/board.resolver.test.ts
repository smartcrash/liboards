import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { SESSION_COOKIE } from '../../constants';
import { dataSource } from '../../dataSource';
import { Board } from '../../entity';
import { createRandomBoard, testThrowsIfNotAuthenticated } from '../../utils/testUtils';

const CreateBoardMutation = `
  mutation CreateBoard($description: String, $title: String!) {
    board: createBoard(description: $description, title: $title) {
      id
      title
      description
    }
  }
`

const FindBoardByIdQuery = `
  query FindBoardByIdQuery ($id: Int!) {
    board: findBoardById(id: $id) {
      id
      title
      description
      createdBy { id }
    }
  }
`

const AllBoardsQuery = `
  {
    boards: allBoards {
      id
      createdBy { id }
    }
  }
`

const AllDeletedBoardsQuery = `
  {
    boards: allDeletedBoards {
      id
    }
  }
`

const UpdateBoardMutation = `
  mutation UpdateBoard($id: Int!, $title: String, $description: String) {
    board: updateBoard(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`

const DeleteBoardMutation = `
  mutation DeleteBoard($id: Int!) {
    id: deleteBoard(id: $id)
  }
`

const RestoreBoardMutation = `
  mutation RestoreBoard($id: Int!) {
    id: restoreBoard(id: $id)
  }
`

test.group('createBoard', () => {
  testThrowsIfNotAuthenticated({
    query: CreateBoardMutation,
    variables: { title: '', description: '', }
  })

  test('should create board', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const title = faker.lorem.words()
    const description = faker.lorem.sentences()

    const queryData = {
      query: CreateBoardMutation,
      variables: {
        title,
        description
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.board).toBeDefined()
    expect(data.board.title).toBe(title)
    expect(data.board.description).toBe(description)

    const { id } = data.board
    const board = await dataSource.getRepository(Board).findOneBy({ id })

    expect(board).toBeDefined()
    expect(board).toMatchObject({ title, description })
    expect(board.createdById).toBe(user.id)
  })
})

test.group('allBoards', () => {
  testThrowsIfNotAuthenticated({
    query: AllBoardsQuery,
    variables: {}
  })

  test('should return only user\'s boards', async ({ expect, client, createUser }) => {
    const [user1] = await createUser(client)
    const [user2, cookie] = await createUser(client)

    const _ = await createRandomBoard(user1.id)
    const board2 = await createRandomBoard(user2.id)

    const queryData = { query: AllBoardsQuery };
    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(data.boards).toHaveLength(1)
    expect(data.boards[0].id).toBe(board2.id)
    expect(data.boards[0].createdBy.id).toBe(user2.id)
  })

  test('should omit deleted boards', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    await createRandomBoard(user.id)
    await createRandomBoard(user.id)
    const { id } = await createRandomBoard(user.id)
    await dataSource.getRepository(Board).softDelete({ id })


    const queryData = { query: AllBoardsQuery };
    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.boards).toHaveLength(2)
    expect(data.boards).not.toContain(expect.arrayContaining([{ id }]))
  })
})

test.group('allDeletedBoards', () => {
  testThrowsIfNotAuthenticated({
    query: AllDeletedBoardsQuery,
    variables: { id: -1 }
  })

  test('should only include deleted boards', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    await createRandomBoard(user.id)
    await createRandomBoard(user.id)
    const { id } = await createRandomBoard(user.id)
    await dataSource.getRepository(Board).softDelete({ id })

    const queryData = { query: AllDeletedBoardsQuery };
    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.boards).toHaveLength(1)
    expect(data.boards[0].id).toBe(id)
  })
})

test.group('findBoardById', () => {
  testThrowsIfNotAuthenticated({
    query: FindBoardByIdQuery,
    variables: { id: 1 }
  })

  test('should return single board', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id, title, description } = await createRandomBoard(user.id)

    const queryData = {
      query: FindBoardByIdQuery,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.board).toBeDefined()
    expect(data.board).toMatchObject({
      id,
      title,
      description,
      createdBy: { id: user.id }
    })
  })

  test('should return `null` if it was not created by the user', async ({ expect, client, createUser }) => {
    const [user] = await createUser(client)
    const [cookie] = await createUser(client)
    const { id } = await createRandomBoard(user.id)

    const queryData = {
      query: FindBoardByIdQuery,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.board).toBeNull()
  })
})

test.group('updateBoard', () => {
  testThrowsIfNotAuthenticated({
    query: UpdateBoardMutation,
    variables: { id: 1 }
  })

  test('should update Board and return updated entity', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id } = await createRandomBoard(user.id)
    const title = faker.lorem.words()
    const description = faker.lorem.paragraphs()

    const queryData = {
      query: UpdateBoardMutation,
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
    const { id, title } = await createRandomBoard(user.id)
    const description = faker.lorem.paragraphs()

    const queryData = {
      query: UpdateBoardMutation,
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

    const board1 = await createRandomBoard(user1.id)

    const queryData = {
      query: UpdateBoardMutation,
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

test.group('deletBoard', () => {
  testThrowsIfNotAuthenticated({
    query: DeleteBoardMutation,
    variables: { id: -1 }
  })

  test('should soft delete board', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const { id } = await createRandomBoard(user.id)

    const queryData = {
      query: DeleteBoardMutation,
      variables: { id }
    };


    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.id).toBeDefined()
    expect(data.id).toBe(id)

    const board = await dataSource.getRepository(Board).findOne({ where: { id }, withDeleted: true })

    expect(board).not.toBeNull()
    expect(board.deletedAt).toBeDefined()
    expect(board.deletedAt.toDateString()).toBe(new Date().toDateString())
  })

  test('should not be able to delete someone else\'s board', async ({ expect, client, createUser }) => {
    const [user1] = await createUser(client)
    const [, cookie] = await createUser(client)

    const { id } = await createRandomBoard(user1.id)

    const queryData = {
      query: DeleteBoardMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.id).toBeNull()

    const board = await dataSource.getRepository(Board).findOne({ where: { id }, withDeleted: true })

    expect(board).toBeDefined()
    expect(board.deletedAt).toBeNull()
  })
})

test.group('restoreBoard', () => {
  testThrowsIfNotAuthenticated({
    query: RestoreBoardMutation,
    variables: { id: -1 }
  })

  test('should restore deleted board', async ({ expect, client, createUser }) => {
    const repository = dataSource.getRepository(Board)
    const [user, cookie] = await createUser(client)

    const { id } = await createRandomBoard(user.id)
    await repository.softDelete({ id })

    // Ensure that is initialy deleted
    expect((await repository.findOne({
      where: { id },
      withDeleted: true
    })).deletedAt).not.toBeNull()

    const queryData = {
      query: RestoreBoardMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.id).toBeDefined()
    expect(data.id).toBe(id)

    const board = await repository.findOneBy({ id })

    expect(board).not.toBeNull()
    expect(board.deletedAt).toBeNull()
  })

  test('should only be able to restore owned boards', async ({ expect, client, createUser }) => {
    const repository = dataSource.getRepository(Board)
    const [user] = await createUser(client)
    const [, cookie] = await createUser(client)

    const { id } = await createRandomBoard(user.id)
    await repository.softDelete({ id })

    // Ensure that is initialy deleted
    expect((await repository.findOne({
      where: { id },
      withDeleted: true
    })).deletedAt).not.toBeNull()

    const queryData = {
      query: RestoreBoardMutation,
      variables: { id }
    };

    await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    const board = await repository.findOne({
      where: { id },
      withDeleted: true
    })

    expect(board).not.toBeNull()
    expect(board.deletedAt).not.toBeNull()
  })
})
