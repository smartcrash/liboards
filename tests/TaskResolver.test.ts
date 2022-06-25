import { faker } from "@faker-js/faker"
import { test } from "@japa/runner"
import { SESSION_COOKIE } from "../source/constants"
import { BoardFactory, CardFactory, ColumnFactory, TaskFactory, UserFactory } from "../source/factories"
import { CardRepository, TaskRepository } from "../source/repository"
import { assertIsForbiddenExeption, testThrowsIfNotAuthenticated } from "../source/utils/testUtils"

const AddTaskMutation = `
  mutation AddTask($cardId: Int!, $content: String!) {
    task: addTask(cardId: $cardId, content: $content) {
      id
      content
      completed
      card {
        id
      }
    }
  }
`

const UpdateTaskMutation = `
  mutation UpdateTask($id: Int!, $content: String, $completed: Boolean) {
    task: updateTask(id: $id, content: $content, completed: $completed) {
      id
      content
      completed
    }
  }
`

const RemoveTaskMutation = `
  mutation RemoveTask($id: Int!) {
    id: removeTask(id: $id)
  }
`

test.group('addTodo', () => {
  testThrowsIfNotAuthenticated({
    query: AddTaskMutation,
    variables: { content: '', cardId: 0 }
  })

  test('add task to card', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await BoardFactory.create({ createdBy: user })
    const column = await ColumnFactory.create({ board })
    const card = await CardFactory.create({ column })

    const content = faker.lorem.words()

    const queryData = {
      query: AddTaskMutation,
      variables: { content, cardId: card.id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(typeof data.task.id).toBe('number')
    expect(data.task.content).toBe(content)
    expect(data.task.completed).toBe(false)
    expect(data.task.card.id).toBe(card.id)

    const { createdById, cardId } = await TaskRepository.findOneBy({ id: data.task.id })

    expect(createdById).toBe(user.id)
    expect(cardId).toBe(card.id)
  })

  test('try to add a task to someone else\'s card', async ({ expect, client, createUser }) => {
    const otherUser = await UserFactory.create()
    const [user, cookie] = await createUser(client)
    const board = await BoardFactory.create({ createdBy: otherUser })
    const column = await ColumnFactory.create({ board })
    const card = await CardFactory.create({ column })

    const queryData = {
      query: AddTaskMutation,
      variables: {
        content: faker.lorem.words(),
        cardId: card.id,
      }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const { tasks } = await CardRepository.findOne({
      where: { id: card.id },
      relations: { tasks: true }
    })

    expect(tasks).toHaveLength(0)
  })
})

test.group('updateTask', () => {
  testThrowsIfNotAuthenticated({
    query: UpdateTaskMutation,
    variables: { content: '', id: 0 }
  })

  test('update card', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await BoardFactory.create({ createdBy: user })
    const column = await ColumnFactory.create({ board })
    const card = await CardFactory.create({ column })
    const { id } = await TaskFactory.create({ card, createdBy: user })

    const content = faker.lorem.words()

    const queryData = {
      query: UpdateTaskMutation,
      variables: { content, id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.task.id).toBe(id)
    expect(data.task.content).toBe(content)
    expect(data.task.completed).toBe(false)

    const task = await TaskRepository.findOneBy({ id })

    expect(task.content).toBe(content)
  })

  test('try to add a task to someone else\'s card', async ({ expect, client, createUser }) => {
    const otherUser = await UserFactory.create()
    const [user, cookie] = await createUser(client)
    const board = await BoardFactory.create({ createdBy: otherUser })
    const column = await ColumnFactory.create({ board })
    const card = await CardFactory.create({ column })
    const { id, content } = await TaskFactory.create({ card, createdBy: user })

    const queryData = {
      query: UpdateTaskMutation,
      variables: {
        id,
        content: faker.lorem.words(),
      }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const task = await TaskRepository.findOneBy({ id })

    expect(task.content).toBe(content)
  })

  test('setting `completed` property to `true` set `completedAt` to current time', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await BoardFactory.create({ createdBy: user })
    const column = await ColumnFactory.create({ board })
    const card = await CardFactory.create({ column })
    const { id, completedAt } = await TaskFactory.create({ card, createdBy: user })

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

    const task = await TaskRepository.findOneBy({ id })

    expect(task.completedAt.toDateString()).toBe(new Date().toDateString())
  })

  test('setting `completed` property to `false` set `completedAt` to `null`', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const board = await BoardFactory.create({ createdBy: user })
    const column = await ColumnFactory.create({ board })
    const card = await CardFactory.create({ column })
    const { id, completedAt } = await TaskFactory.create({ card, createdBy: user, completedAt: new Date() })

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

    const task = await TaskRepository.findOneBy({ id })

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
    const board = await BoardFactory.create({ createdBy: user })
    const column = await ColumnFactory.create({ board })
    const card = await CardFactory.create({ column })
    const { id } = await TaskFactory.create({ card, createdBy: user })

    const queryData = {
      query: RemoveTaskMutation,
      variables: { id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.id).toBe(id)

    const task = await TaskRepository.findOneBy({ id })

    expect(task).toBeFalsy()
  })

  test('try to remove someone else\'s task', async ({ expect, client, createUser }) => {
    const otherUser = await UserFactory.create()
    const [user, cookie] = await createUser(client)
    const board = await BoardFactory.create({ createdBy: otherUser })
    const column = await ColumnFactory.create({ board })
    const card = await CardFactory.create({ column })
    const { id } = await TaskFactory.create({ card, createdBy: user })

    const queryData = {
      query: RemoveTaskMutation,
      variables: { id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const task = await TaskRepository.findOneBy({ id })

    expect(task).toBeTruthy()
  })
})
