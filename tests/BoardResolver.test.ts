import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { SESSION_COOKIE } from '../source/constants';
import { BoardFactory, UserFactory } from '../source/factories';
import { BoardRepository } from '../source/repository';
import slug from '../source/utils/slug';
import { assertIsForbiddenExeption, testThrowsIfNotAuthenticated } from '../source/utils/testUtils';

const CreateBoardMutation = `
  mutation CreateBoard($title: String!) {
    board: createBoard(title: $title) {
      id
      title
      slug
    }
  }
`

const FindBoardByIdQuery = `
  query FindBoardByIdQuery ($id: Int!) {
    board: findBoardById(id: $id) {
      id
      title
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
  mutation UpdateBoard($id: Int!, $title: String) {
    board: updateBoard(id: $id, title: $title) {
      id
      title
      slug
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

const ForceDeleteBoardMutation = `
  mutation ForceDeleteBoard($id: Int!) {
    id: forceDeleteBoard(id: $id)
  }
`

test.group('createBoard', () => {
  testThrowsIfNotAuthenticated({
    query: CreateBoardMutation,
    variables: { title: '' }
  })

  test('should create board', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const title = faker.lorem.words()

    const queryData = {
      query: CreateBoardMutation,
      variables: { title, }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.board).toBeDefined()
    expect(data.board.title).toBe(title)

    const { id } = data.board
    const board = await BoardRepository.findOneBy({ id })

    expect(board).toBeDefined()
    expect(board.title).toBe(title)
    expect(board.createdById).toBe(user.id)
  })

  test('should generate board\'s slug correctly', async ({ expect, client, createUser }) => {
    const [, cookie] = await createUser(client)

    const title = faker.lorem.words()

    const queryData = {
      query: CreateBoardMutation,
      variables: { title, }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.board.slug).toBe(slug(title, data.board.id))
  })
})

test.group('allBoards', () => {
  testThrowsIfNotAuthenticated({
    query: AllBoardsQuery,
    variables: {}
  })

  test('should return only user\'s boards', async ({ expect, client, createUser }) => {
    const otherUser = await UserFactory.create()
    const [user, cookie] = await createUser(client)

    await BoardFactory.create({ createdBy: otherUser })
    const board2 = await BoardFactory.create({ createdBy: user })

    const queryData = { query: AllBoardsQuery };
    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.boards).toHaveLength(1)
    expect(data.boards[0].id).toBe(board2.id)
    expect(data.boards[0].createdBy.id).toBe(user.id)
  })

  test('should omit deleted boards', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    await BoardFactory.create({ createdBy: user })
    await BoardFactory.create({ createdBy: user })
    const { id } = await BoardFactory.create({ createdBy: user })
    await BoardRepository.softDelete({ id })

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

    await BoardFactory.create({ createdBy: user })
    await BoardFactory.create({ createdBy: user })
    const { id } = await BoardFactory.create({ createdBy: user })
    await BoardRepository.softDelete({ id })

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
    const { id, title } = await BoardFactory.create({ createdBy: user })

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
      createdBy: { id: user.id }
    })
  })

  test('should return `null` if it was not created by the user', async ({ expect, client, createUser }) => {
    const [user] = await createUser(client)
    const [cookie] = await createUser(client)
    const { id } = await BoardFactory.create({ createdBy: user })

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
    const { id } = await BoardFactory.create({ createdBy: user })
    const title = faker.lorem.words()

    const queryData = {
      query: UpdateBoardMutation,
      variables: {
        id,
        title,
      }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.board.id).toBe(id)
    expect(data.board.title).toBe(title)
  })

  test('should update Board\'s `slug` when `title` is changed', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id } = await BoardFactory.create({ createdBy: user })
    const newTitle = faker.lorem.words()

    const queryData = {
      query: UpdateBoardMutation,
      variables: {
        id,
        title: newTitle,
      }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.board.slug).toBe(slug(newTitle, id))
  })

  test('should only be allowed to update if is owner', async ({ expect, client, createUser }) => {
    const [user1] = await createUser(client)
    const [, cookie] = await createUser(client)

    const { id, title } = await BoardFactory.create({ createdBy: user1 })

    const queryData = {
      query: UpdateBoardMutation,
      variables: {
        id,
        title: faker.lorem.paragraph()
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const board = await BoardRepository.findOneBy({ id })

    expect(board).toBeDefined()
    expect(board.title).toBe(title) // It should not have changed
  })
})

test.group('deletBoard', () => {
  testThrowsIfNotAuthenticated({
    query: DeleteBoardMutation,
    variables: { id: -1 }
  })

  test('should soft delete board', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const { id } = await BoardFactory.create({ createdBy: user })

    const queryData = {
      query: DeleteBoardMutation,
      variables: { id }
    };


    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.id).toBeDefined()
    expect(data.id).toBe(id)

    const board = await BoardRepository.findOne({ where: { id }, withDeleted: true })

    expect(board).not.toBeNull()
    expect(board.deletedAt).toBeDefined()
    expect(board.deletedAt.toDateString()).toBe(new Date().toDateString())
  })

  test('should not be able to delete someone else\'s board', async ({ expect, client, createUser }) => {
    const [user1] = await createUser(client)
    const [, cookie] = await createUser(client)

    const { id } = await BoardFactory.create({ createdBy: user1 })

    const queryData = {
      query: DeleteBoardMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const board = await BoardRepository.findOne({ where: { id }, withDeleted: true })

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
    const [user, cookie] = await createUser(client)

    const { id } = await BoardFactory.create({ createdBy: user })
    await BoardRepository.softDelete({ id })

    // Ensure that is initialy deleted
    expect((await BoardRepository.findOne({
      where: { id },
      withDeleted: true
    })).deletedAt).not.toBeNull()

    const queryData = {
      query: RestoreBoardMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.id).toBeDefined()
    expect(data.id).toBe(id)

    const board = await BoardRepository.findOneBy({ id })

    expect(board).not.toBeNull()
    expect(board.deletedAt).toBeNull()
  })

  test('should only be able to restore owned boards', async ({ expect, client, createUser }) => {
    const otherUser = await UserFactory.create()
    const [, cookie] = await createUser(client)

    const { id } = await BoardFactory.create({ createdBy: otherUser })
    await BoardRepository.softDelete({ id })

    // Ensure that is initialy deleted
    expect((await BoardRepository.findOne({
      where: { id },
      withDeleted: true
    })).deletedAt).not.toBeNull()

    const queryData = {
      query: RestoreBoardMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const board = await BoardRepository.findOne({
      where: { id },
      withDeleted: true
    })

    expect(board).not.toBeNull()
    expect(board.deletedAt).not.toBeNull()
  })
})

test.group('forceDeletboard', () => {
  testThrowsIfNotAuthenticated({
    query: ForceDeleteBoardMutation,
    variables: { id: -1 }
  })

  test('should delete (for real) the board', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id } = await BoardFactory.create({ createdBy: user })

    const queryData = {
      query: ForceDeleteBoardMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.id).toBeDefined()
    expect(data.id).toBe(id)

    const board = await BoardRepository.findOne({ where: { id }, withDeleted: true })

    expect(board).toBeFalsy()
  })

  test('should not be able to delete someone else\'s booard', async ({ expect, client, createUser }) => {
    const otherUser = await UserFactory.create()
    const [, cookie] = await createUser(client)

    const { id } = await BoardFactory.create({ createdBy: otherUser })

    const queryData = {
      query: ForceDeleteBoardMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const board = await BoardRepository.findOne({ where: { id }, withDeleted: true })

    expect(board).toBeDefined()
    expect(board.deletedAt).toBeNull()
  })
})
