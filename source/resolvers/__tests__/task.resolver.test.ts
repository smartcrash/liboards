import { test } from "@japa/runner"
import { testThrowsIfNotAuthenticated } from "../../utils/testUtils"

const AddTaskMutation = `
  mutation AddTask($toCardId: Int!, $description: String!) {
    addTask(toCardId: $toCardId, description: $description) {
      id
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
    variables: { description: '', toCardId: 0 }
  })

  test('add task to card', async ({ expect, client, createUser }) => {

  })

  test('try to add a task to someone else\'s card', async ({ expect, client, createUser }) => {
  })
})
