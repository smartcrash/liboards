import { faker } from "@faker-js/faker";
import { test } from "@japa/runner";
import { In } from "typeorm";
import { SESSION_COOKIE } from "../../constants";
import { CardRepository } from "../../repository";
import { assertIsForbiddenExeption, createRandomBoard, createRandomCard, createRandomColumn, testThrowsIfNotAuthenticated } from "../../utils/testUtils";

const AddCardMutation = `
  mutation AddCard($columnId: Int!, $title: String!, $description: String) {
    card: addCard(columnId: $columnId, title: $title, description: $description) {
      id
      title
      description
      index
    }
  }
`

const UpdateCardMutation = `
  mutation UpdateCard($id: Int!, $title: String, $description: String) {
    card: updateCard(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`

const RemoveCardMutation = `
  mutation RemoveCard($id: Int!) {
    id: removeCard(id: $id)
  }
`

const MoveCardMutation = `
  mutation MoveCard($toIndex: Int!, $toColumnId: Int!, $id: Int!) {
    card: moveCard(toIndex: $toIndex, toColumnId: $toColumnId, id: $id) {
      id
      index
    }
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

    const queryData = {
      query: AddCardMutation,
      variables: {
        columnId,
        title,
        description,
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()

    expect(data.card).toBeTruthy()
    expect(typeof data.card.id).toBe('number')
    expect(data.card.title).toBe(title)
    expect(data.card.description).toBe(description)

    const { id } = data.card
    const card = await CardRepository.findOneBy({ id })

    expect(card).toBeTruthy()
    expect(card.columnId).toBe(columnId)
  })

  test('assigns correct `index` by default', async ({ expect, client, createUser }) => {
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

    const queryData = {
      query: UpdateCardMutation,
      variables: {
        id,
        title,
        description,
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()

    expect(data.card).toBeTruthy()
    expect(data.card.id).toBe(id)
    expect(data.card.title).toBe(title)
    expect(data.card.description).toBe(description)

    const card = await CardRepository.findOneBy({ id })

    expect(card).toMatchObject({ title, description })
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


test.group('moveCard', () => {
  testThrowsIfNotAuthenticated({
    query: MoveCardMutation,
    variables: {
      id: 0,
      toIndex: 0,
      toColumnId: 0,
    }
  })

  test('moves the card up to the specified position in same column', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id: columnId } = await createRandomColumn(boardId)

    const card1 = await createRandomCard(columnId, 0, 'card-1')
    const card2 = await createRandomCard(columnId, 1, 'card-2')
    const card3 = await createRandomCard(columnId, 2, 'card-3')

    const toIndex = 2
    const toColumnId = columnId

    const queryData = {
      query: MoveCardMutation,
      variables: {
        id: card1.id,
        toIndex,
        toColumnId,
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.card).toBeTruthy()
    expect(data.card.id).toBe(card1.id)
    expect(data.card.index).toBe(toIndex)

    const cards = await CardRepository.find({
      select: { id: true, index: true, title: true },
      where: { id: In([card1.id, card2.id, card3.id]) },
      order: { index: 'ASC' },
    })

    expect(cards).toMatchObject([{ id: card2.id }, { id: card3.id }, { id: card1.id }])
  })

  test('moves the card down to the specified position in same column', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id: columnId } = await createRandomColumn(boardId)

    const card1 = await createRandomCard(columnId, 0, 'card-1')
    const card2 = await createRandomCard(columnId, 1, 'card-2')
    const card3 = await createRandomCard(columnId, 2, 'card-3')

    const toIndex = 0
    const toColumnId = columnId

    const queryData = {
      query: MoveCardMutation,
      variables: {
        id: card3.id,
        toIndex,
        toColumnId,
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.card).toBeTruthy()
    expect(data.card.id).toBe(card3.id)
    expect(data.card.index).toBe(toIndex)

    const cards = await CardRepository.find({
      select: { id: true, index: true, title: true },
      where: { id: In([card1.id, card2.id, card3.id]) },
      order: { index: 'ASC' },
    })

    expect(cards).toMatchObject([{ id: card3.id }, { id: card1.id }, { id: card2.id }])
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

  test('shift remaining cards\'s indexes to keep sequense', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id: columnId } = await createRandomColumn(boardId, 0)

    const card1 = await createRandomCard(columnId, 0)
    const card2 = await createRandomCard(columnId, 1)
    const card3 = await createRandomCard(columnId, 2)

    const queryData = {
      query: RemoveCardMutation,
      variables: { id: card2.id }
    };

    await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    const cards = await CardRepository.find({
      select: { id: true, index: true },
      where: { columnId },
      order: { index: "ASC" }
    })

    expect(cards).toHaveLength(2)
    expect(cards).toMatchObject([{ id: card1.id, index: 0 }, { id: card3.id, index: 1 }])
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
