import { faker } from "@faker-js/faker"
import { test } from "@japa/runner"
import { SESSION_COOKIE } from "../../constants"
import { boardFactory, cardFactory, columnFactory, userFactory } from "../../factories"
import { cardRepository, taskRepository } from "../../repository"
import { assertIsForbiddenExeption, testThrowsIfNotAuthenticated } from "../../utils/testUtils"

const AddTaskMutation = `
  mutation AddTask($cardId: Int!, $description: String!) {
    task: addTask(cardId: $cardId, description: $description) {
      id
      description
      completed
      card {
        id
      }
    }
  }
`

const UpdateCardMutation = `
`

const RemoveCardMutation = `
`

test.group('addCard', () => {
  testThrowsIfNotAuthenticated({
    query: AddTaskMutation,
    variables: { description: '', cardId: 0 }
  })

  test('add task to card', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await boardFactory().create({ createdBy: user })
    const column = await columnFactory().create({ board })
    const card = await cardFactory().create({ column })

    const description = faker.lorem.words()

    const queryData = {
      query: AddTaskMutation,
      variables: { description, cardId: card.id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(typeof data.task.id).toBe('number')
    expect(data.task.description).toBe(description)
    expect(data.task.completed).toBe(false)
    expect(data.task.card.id).toBe(card.id)

    const { createdById, cardId } = await taskRepository.findOneBy({ id: data.task.id })

    expect(createdById).toBe(user.id)
    expect(cardId).toBe(card.id)
  })

  test('try to add a task to someone else\'s card', async ({ expect, client, createUser }) => {
    const otherUser = await userFactory().create()
    const [user, cookie] = await createUser(client)
    const board = await boardFactory().create({ createdBy: otherUser })
    const column = await columnFactory().create({ board })
    const card = await cardFactory().create({ column })

    const queryData = {
      query: AddTaskMutation,
      variables: {
        description: faker.lorem.words(),
        cardId: card.id,
      }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const { tasks } = await cardRepository.findOne({
      where: { id: card.id },
      relations: { tasks: true }
    })

    expect(tasks).toHaveLength(0)
  })
})
