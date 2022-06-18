import { faker } from "@faker-js/faker";
import { test } from "@japa/runner";
import { SESSION_COOKIE } from "../../constants";
import { boardFactory, columnFactory, cardFactory, CommentFactory, userFactory } from "../../factories";
import { commentRepository } from "../../repository";
import { assertIsForbiddenExeption, testThrowsIfNotAuthenticated } from "../../utils/testUtils";

const AddCommentMutation = `
  mutation AddComment($cardId: Int!, $content: String!) {
    comment: addComment(cardId: $cardId, content: $content) {
      id
      content
    }
  }
`

const UpdateCommentMutation = `
  mutation UpdateComment($content: String!, $id: Int!) {
    comment: updateComment(content: $content, id: $id) {
      id
      content
    }
  }
`

const RemoveCommentMutation = `
  mutation RemoveComment($id: Int!) {
    id: removeComment(id: $id)
  }
`

test.group('addComment', (group) => {
  testThrowsIfNotAuthenticated({
    query: AddCommentMutation,
    variables: {
      cardId: 0,
      content: '',
    }
  })

  test('add comment to card', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await boardFactory.create({ createdBy: user })
    const column = await columnFactory.create({ board })
    const card = await cardFactory.create({ column })

    const content = faker.lorem.sentence()

    const queryData = {
      query: AddCommentMutation,
      variables: {
        cardId: card.id,
        content,
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(typeof data.comment.id).toBe('number')
    expect(data.comment.content).toBe(content)

    const comments = await commentRepository.findBy({ cardId: card.id })

    expect(comments).toHaveLength(1)
    expect(comments[0].id).toBe(data.comment.id)
    expect(comments[0].content).toBe(content)
    expect(comments[0].cardId).toBe(card.id)
    expect(comments[0].userId).toBe(user.id)
  })

  test('add comment to someone else\'s card', async ({ expect, client, createUser }) => {
    const [otherUser] = await createUser(client)
    const [, cookie] = await createUser(client)
    const board = await boardFactory.create({ createdBy: otherUser })
    const column = await columnFactory.create({ board })
    const card = await cardFactory.create({ column })

    const queryData = {
      query: AddCommentMutation,
      variables: {
        cardId: card.id,
        content: faker.lorem.sentence(),
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const comments = await commentRepository.findBy({ cardId: card.id })

    expect(comments).toHaveLength(0)
  })
})

test.group('updateComment', (group) => {
  testThrowsIfNotAuthenticated({
    query: UpdateCommentMutation,
    variables: { id: 0, content: '' }
  })

  test('update comment\'s content', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await boardFactory.create({ createdBy: user })
    const column = await columnFactory.create({ board })
    const card = await cardFactory.create({ column })
    const { id } = await CommentFactory.create({ card, user })

    const content = faker.lorem.sentence()

    const queryData = {
      query: UpdateCommentMutation,
      variables: {
        id,
        content,
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.comment.id).toBe(id)
    expect(data.comment.content).toBe(content)

    const comment = await commentRepository.findOneBy({ id })

    expect(comment.content).toBe(content)
  })


  test('can only update own comments', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const otherUser = await userFactory.create()
    const board = await boardFactory.create({ createdBy: user })
    const column = await columnFactory.create({ board })
    const card = await cardFactory.create({ column })
    const { id, content } = await CommentFactory.create({ card, user: otherUser })

    const queryData = {
      query: UpdateCommentMutation,
      variables: {
        id,
        content: faker.lorem.sentence(),
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const comment = await commentRepository.findOneBy({ id })

    expect(comment.content).toBe(content)
  })
})

test.group('removeComment', (group) => {
  testThrowsIfNotAuthenticated({
    query: RemoveCommentMutation,
    variables: { id: 0 }
  })

  test('removes a comment from card', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await boardFactory.create({ createdBy: user })
    const column = await columnFactory.create({ board })
    const card = await cardFactory.create({ column })
    const { id } = await CommentFactory.create({ card, user })

    const content = faker.lorem.sentence()

    const queryData = {
      query: RemoveCommentMutation,
      variables: {
        id,
        content,
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.id).toBe(id)

    const comment = await commentRepository.findOneBy({ id })

    expect(comment).toBeFalsy()
  })


  test('can only remove own comments', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const otherUser = await userFactory.create()
    const board = await boardFactory.create({ createdBy: user })
    const column = await columnFactory.create({ board })
    const card = await cardFactory.create({ column })
    const { id } = await CommentFactory.create({ card, user: otherUser })

    const queryData = {
      query: RemoveCommentMutation,
      variables: {
        id,
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const comment = await commentRepository.findOneBy({ id })

    expect(comment).toBeTruthy()
  })
})
