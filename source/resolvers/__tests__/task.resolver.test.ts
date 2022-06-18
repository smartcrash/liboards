import { faker } from "@faker-js/faker"
import { test } from "@japa/runner"
import { SESSION_COOKIE } from "../../constants"
import { boardFactory, cardFactory, columnFactory, taskFactory, userFactory } from "../../factories"
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

const UpdateTaskMutation = `
  mutation UpdateTask($id: Int!, $description: String, $completed: Boolean) {
    task: updateTask(id: $id, description: $description, completed: $completed) {
      id
      description
      completed
    }
  }
`

const RemoveTaskMutation = `
  mutation RemoveTask($id: Int!) {
    id: removeTask(id: $id)
  }
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

test.group('updateCard', () => {
  testThrowsIfNotAuthenticated({
    query: UpdateTaskMutation,
    variables: { description: '', id: 0 }
  })

  test('update card', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await boardFactory().create({ createdBy: user })
    const column = await columnFactory().create({ board })
    const card = await cardFactory().create({ column })
    const { id } = await taskFactory().create({ card, createdBy: user })

    const description = faker.lorem.words()

    const queryData = {
      query: UpdateTaskMutation,
      variables: { description, id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.task.id).toBe(id)
    expect(data.task.description).toBe(description)
    expect(data.task.completed).toBe(false)

    const task = await taskRepository.findOneBy({ id })

    expect(task.description).toBe(description)
  })

  test('try to add a task to someone else\'s card', async ({ expect, client, createUser }) => {
    const otherUser = await userFactory().create()
    const [user, cookie] = await createUser(client)
    const board = await boardFactory().create({ createdBy: otherUser })
    const column = await columnFactory().create({ board })
    const card = await cardFactory().create({ column })
    const { id, description } = await taskFactory().create({ card, createdBy: user })

    const queryData = {
      query: UpdateTaskMutation,
      variables: {
        id,
        description: faker.lorem.words(),
      }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const task = await taskRepository.findOneBy({ id })

    expect(task.description).toBe(description)
  })

  test('setting `completed` property to `true` set `completedAt` to current time', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await boardFactory().create({ createdBy: user })
    const column = await columnFactory().create({ board })
    const card = await cardFactory().create({ column })
    const { id, completedAt } = await taskFactory().create({ card, createdBy: user })

    expect(completedAt).toBeFalsy()

    const queryData = {
      query: UpdateTaskMutation,
      variables: { id, completed: true }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.task.id).toBe(id)
    expect(data.task.completed).toBe(true)

    const task = await taskRepository.findOneBy({ id })

    expect(task.completedAt.toDateString()).toBe(new Date().toDateString())
  })

  test('setting `completed` property to `false` set `completedAt` to `null`', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await boardFactory().create({ createdBy: user })
    const column = await columnFactory().create({ board })
    const card = await cardFactory().create({ column })
    const { id, completedAt } = await taskFactory().create({ card, createdBy: user, completedAt: new Date() })

    expect(completedAt).toBeTruthy()

    const queryData = {
      query: UpdateTaskMutation,
      variables: { id, completed: false }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.task.id).toBe(id)
    expect(data.task.completed).toBe(false)

    const task = await taskRepository.findOneBy({ id })

    expect(task.completedAt).toBeNull()
  })
})

test.group('removeTask', () => {
  testThrowsIfNotAuthenticated({
    query: RemoveTaskMutation,
    variables: { id: 0 }
  })

  test('remove task', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await boardFactory().create({ createdBy: user })
    const column = await columnFactory().create({ board })
    const card = await cardFactory().create({ column })
    const { id } = await taskFactory().create({ card, createdBy: user })

    const queryData = {
      query: RemoveTaskMutation,
      variables: { id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.id).toBe(id)

    const task = await taskRepository.findOneBy({ id })

    expect(task).toBeFalsy()
  })

  test('try to remove someone else\'s task', async ({ expect, client, createUser }) => {
    const otherUser = await userFactory().create()
    const [user, cookie] = await createUser(client)
    const board = await boardFactory().create({ createdBy: otherUser })
    const column = await columnFactory().create({ board })
    const card = await cardFactory().create({ column })
    const { id } = await taskFactory().create({ card, createdBy: user })

    const queryData = {
      query: RemoveTaskMutation,
      variables: { id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const task = await taskRepository.findOneBy({ id })

    expect(task).toBeTruthy()
  })
})
