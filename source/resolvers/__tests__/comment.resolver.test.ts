import { faker } from "@faker-js/faker";
import { test } from "@japa/runner";
import { SESSION_COOKIE } from "../../constants";
import { boardFactory, columnFactory, cardFactory } from "../../factories";
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
  group.tap((test) => test.pin())

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
