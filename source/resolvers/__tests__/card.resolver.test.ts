import { faker } from "@faker-js/faker";
import { test } from "@japa/runner";
import { SESSION_COOKIE } from "../../constants";
import { CardRepository } from "../../repository";
import { assertIsForbiddenExeption, createRandomBoard, createRandomCard, createRandomColumn, testThrowsIfNotAuthenticated } from "../../utils/testUtils";

const AddCardMutation = `
  mutation AddCard($columnId: Int!, $title: String!, $description: String, $index: Int) {
    card: addCard(columnId: $columnId, title: $title, description: $description, index: $index) {
      id
      title
      description
      index
    }
  }
`

const UpdateCardMutation = `
  mutation UpdateCard($id: Int!, $title: String, $description: String, $index: Int) {
    card: updateCard(id: $id, title: $title, description: $description, index: $index) {
      id
      title
      description
      index
    }
  }
`

const RemoveCardMutation = `
  mutation RemoveCard($id: Int!) {
    id: removeCard(id: $id)
  }
`


test.group('addCard', () => {
  testThrowsIfNotAuthenticated({
    query: AddCardMutation,
    variables: {
      columnId: -1,
      title: '',
    }
  })

  test('should create card', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id: columnId } = await createRandomColumn(boardId)

    const title = faker.lorem.words()
    const description = faker.lorem.sentences()
    const index = faker.datatype.number()

    const queryData = {
      query: AddCardMutation,
      variables: {
        columnId,
        title,
        description,
        index
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()

    expect(data.card).toBeTruthy()
    expect(typeof data.card.id).toBe('number')
    expect(data.card.title).toBe(title)
    expect(data.card.description).toBe(description)
    expect(data.card.index).toBe(index)

    const { id } = data.card
    const card = await CardRepository.findOneBy({ id })

    expect(card).toBeTruthy()
    expect(card.columnId).toBe(columnId)
  })

  test('assigns correct `index` by default if was not provided', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id: columnId } = await createRandomColumn(boardId)

    await createRandomCard(columnId, 0)
    await createRandomCard(columnId, 1)
    await createRandomCard(columnId, 2)

    const queryData = {
      query: AddCardMutation,
      variables: {
        columnId,
        title: faker.lorem.words(),
        description: faker.lorem.sentences(),
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.card).toBeTruthy()
    expect(data.card.index).toBe(3)
  })

  test('should not allow to create a card on someone else\'s board', async ({ expect, client, createUser }) => {
    const [user] = await createUser(client)
    const [, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id: columnId } = await createRandomColumn(boardId)

    const queryData = {
      query: AddCardMutation,
      variables: {
        columnId,
        title: faker.lorem.words(),
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })
  })
})


test.group('updateCard', () => {
  testThrowsIfNotAuthenticated({
    query: UpdateCardMutation,
    variables: { id: -1 }
  })

  test('should update card', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id: columnId } = await createRandomColumn(boardId)
    const { id } = await createRandomCard(columnId)

    const title = faker.lorem.words()
    const description = faker.lorem.sentences()
    const index = faker.datatype.number()

    const queryData = {
      query: UpdateCardMutation,
      variables: {
        id,
        title,
        description,
        index
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()

    expect(data.card).toBeTruthy()
    expect(data.card.id).toBe(id)
    expect(data.card.title).toBe(title)
    expect(data.card.description).toBe(description)
    expect(data.card.index).toBe(index)

    const card = await CardRepository.findOneBy({ id })

    expect(card).toMatchObject({ title, index })
  })

  test('should not allow update someone else\'s card', async ({ expect, client, createUser }) => {
    const [user] = await createUser(client)
    const [, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id: columnId } = await createRandomColumn(boardId)
    const { id, title } = await createRandomCard(columnId)

    const queryData = {
      query: UpdateCardMutation,
      variables: {
        id,
        title: faker.lorem.words()
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const card = await CardRepository.findOneBy({ id })

    expect(card.title).toBe(title)
  })
})

test.group('removeCard', () => {
  testThrowsIfNotAuthenticated({
    query: RemoveCardMutation,
    variables: { id: -1 }
  })

  test('should delete card', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id: columnId } = await createRandomColumn(boardId)
    const { id } = await createRandomCard(columnId)

    const queryData = {
      query: RemoveCardMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data.id).toBe(id)

    const card = await CardRepository.findOneBy({ id })

    expect(card).toBeFalsy()
  })

  test('should not allow delete someone else\'s card', async ({ expect, client, createUser }) => {
    const [user] = await createUser(client)
    const [, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id: columnId } = await createRandomColumn(boardId)
    const { id } = await createRandomCard(columnId)

    const queryData = {
      query: UpdateCardMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const card = await CardRepository.findOneBy({ id })

    expect(card).toBeTruthy()
  })
})
