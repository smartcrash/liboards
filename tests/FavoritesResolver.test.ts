import { test } from "@japa/runner"
import { SESSION_COOKIE } from "../source/constants"
import { BoardFactory } from "../source/factories"
import { BoardRepository, FavoritesRepository, UserRepository } from "../source/repository"
import { assertIsForbiddenExeption, testThrowsIfNotAuthenticated } from "../source/utils/testUtils"

const AllFavoritesQuery = `
  query AllFavorites {
    favorites: allFavorites {
      id
    }
  }
`

const AddToFavoritesMutation = `
  mutation AddToFavorites($id: Int!) {
    addToFavorites(id: $id)
  }
`

const RemoveFromFavoritesMutation = `
  mutation RemoveFromFavorites($id: Int!) {
    removeFromFavorites(id: $id)
  }
`


test.group('allFavorites', () => {
  testThrowsIfNotAuthenticated({
    query: AllFavoritesQuery,
    variables: {}
  })

  test('get user\'s favorites list', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const [board1, board2, board3] = await BoardFactory.createMany(3, { createdBy: user })

    await FavoritesRepository.insert([
      { userId: user.id, boardId: board2.id },
      { userId: user.id, boardId: board3.id },
    ])

    const queryData = {
      query: AllFavoritesQuery,
      variables: {}
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(Array.isArray(data.favorites)).toBeTruthy()
    expect(data.favorites).toHaveLength(2)
    expect(data.favorites).not.toContain(expect.arrayContaining([{ id: board1.id }]))
  })

  test('should work if contains soft-deleted elements', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const board = await BoardFactory.create({ createdBy: user })
    await BoardRepository.softDelete({ id: board.id })

    await FavoritesRepository.insert({ userId: user.id, boardId: board.id })

    const queryData = {
      query: AllFavoritesQuery,
      variables: {}
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(Array.isArray(data.favorites)).toBe(true)
    expect(data.favorites).toHaveLength(0)
  })
})

test.group('addToFavorites', () => {
  testThrowsIfNotAuthenticated({
    query: AddToFavoritesMutation,
    variables: { id: 0 }
  })

  test('it add board to user\'s favorites', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const { id } = await BoardFactory.create({ createdBy: user })
    await BoardFactory.create({ createdBy: user })

    const queryData = {
      query: AddToFavoritesMutation,
      variables: { id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()
    expect(data.addToFavorites).toBe(true)

    const { favorites } = await UserRepository.findOne({
      where: { id: user.id },
      relations: { favorites: true }
    })

    expect(favorites).toHaveLength(1)
    expect(favorites[0].boardId).toBe(id)
  })

  test('can only favorite boards that has access to', async ({ expect, client, createUser }) => {
    const [otherUser,] = await createUser(client)
    const [loggedUser, cookie] = await createUser(client)

    const { id } = await BoardFactory.create({ createdBy: otherUser })

    await FavoritesRepository.insert({ userId: otherUser.id, boardId: id })

    const queryData = {
      query: AddToFavoritesMutation,
      variables: { id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const { favorites } = await UserRepository.findOne({
      where: { id: loggedUser.id },
      relations: { favorites: true }
    })

    expect(favorites).toHaveLength(0)
  })
})

test.group('removeFromFavorites', () => {
  testThrowsIfNotAuthenticated({
    query: RemoveFromFavoritesMutation,
    variables: { id: 0 }
  })

  test('it removes board from user\'s favorites', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await BoardFactory.create({ createdBy: user })


    const queryData = {
      query: RemoveFromFavoritesMutation,
      variables: { id: board.id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()
    expect(data.removeFromFavorites).toBe(true)

    const { favorites } = await UserRepository.findOne({
      where: { id: user.id },
      relations: { favorites: true }
    })

    expect(favorites).toHaveLength(0)
  })
})
