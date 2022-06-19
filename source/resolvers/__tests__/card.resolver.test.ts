import { faker } from "@faker-js/faker";
import { test } from "@japa/runner";
import { In } from "typeorm";
import { SESSION_COOKIE } from "../../constants";
import { BoardFactory, CardFactory, ColumnFactory } from "../../factories";
import { CardRepository } from "../../repository";
import { assertIsForbiddenExeption, createRandomBoard, createRandomCard, createRandomColumn, testThrowsIfNotAuthenticated } from "../../utils/testUtils";

const FindCardByIdQuery = `
  query FindQueryById($id: Int!) {
    card: findCardById(id: $id) {
      id
      title
      description
      column {
        id
        title
      }
      # TODO: Add createdBy field
      # createdBy {
      #   id
      #   username
      # }
    }
  }
`

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
      column {
        id
      }
    }
  }
`


test.group('findCardById', () => {
  testThrowsIfNotAuthenticated({
    query: FindCardByIdQuery,
    variables: { id: 0 }
  })

  test('should get card\'s details using it\'s `id`', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await createRandomBoard(user.id)
    const column = await createRandomColumn(board.id)
    const card = await createRandomCard(column.id)


    const queryData = {
      query: FindCardByIdQuery,
      variables: { id: card.id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data.card).toBeTruthy()
    // expect(data.card.createdBy.id).toBe(user.id)
    // expect(data.card.createdBy.username).toBe(user.username)

    expect(data.card).toMatchObject({
      id: card.id,
      title: card.title,
      description: card.description,
      column: {
        id: column.id,
        title: column.title,
      },
      // createdBy: {
      //   id: user.id,
      //   username: user.username
      // }
    })
  })

  test('should not be able to see some else\'s card', async ({ expect, client, createUser }) => {
    const [user] = await createUser(client)
    const [, cookie] = await createUser(client)
    const board = await createRandomBoard(user.id)
    const column = await createRandomColumn(board.id)
    const card = await createRandomCard(column.id)

    const queryData = {
      query: FindCardByIdQuery,
      variables: { id: card.id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })
  })
})

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
    const board = await BoardFactory().create({ createdBy: user })
    const column = await ColumnFactory().create({ board })

    await CardFactory().createMany(3, { column })

    const queryData = {
      query: AddCardMutation,
      variables: {
        columnId: column.id,
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

  test('moves the card to another column (empty)', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await BoardFactory().create({ createdBy: user })
    const fromColumn = await ColumnFactory().create({ board })
    const toColumn = await ColumnFactory().create({ board })

    const card = await CardFactory().create({ column: fromColumn })

    const queryData = {
      query: MoveCardMutation,
      variables: {
        id: card.id,
        toIndex: 0,
        toColumnId: toColumn.id,
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.card).toBeTruthy()
    expect(data.card.id).toBe(card.id)
    expect(data.card.index).toBe(0)
    expect(data.card.column.id).toBe(toColumn.id)

    expect(await CardRepository.countBy({ column: { id: fromColumn.id } })).toBe(0)
    expect(await CardRepository.countBy({ column: { id: toColumn.id } })).toBe(1)
  })

  test('moves card to specific position to a another column (non-empty)', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await BoardFactory().create({ createdBy: user })
    const fromColumn = await ColumnFactory().create({ board })
    const toColumn = await ColumnFactory().create({ board })

    await CardFactory().createMany(3, { column: toColumn })
    const [, card,] = await CardFactory().createMany(3, { column: fromColumn })
    const toIndex = 1

    const queryData = {
      query: MoveCardMutation,
      variables: {
        id: card.id,
        toIndex,
        toColumnId: toColumn.id,
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.card).toBeTruthy()
    expect(data.card.id).toBe(card.id)
    expect(data.card.index).toBe(toIndex)
    expect(data.card.column.id).toBe(toColumn.id)


    const fromColumnCards = await CardRepository.find({ where: { column: { id: fromColumn.id } }, order: { index: 'ASC' } })
    const toColumnCards = await CardRepository.find({ where: { column: { id: toColumn.id } }, order: { index: 'ASC' } })

    expect(fromColumnCards).toHaveLength(2)
    expect(toColumnCards).toHaveLength(4)

    fromColumnCards.forEach((card, index) => expect(card.index).toBe(index))
    toColumnCards.forEach((card, index) => expect(card.index).toBe(index))
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
