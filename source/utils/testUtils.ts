import { ApiResponse } from "@japa/api-client"
import { Expect } from "@japa/expect"
import { test } from "@japa/runner"

export const testThrowsIfNotAuthenticated = (queryData: string | object) => {
  test('should throw error not authenticated', async ({ expect, client }) => {
    const response = await client.post('/').json(queryData)
    const { errors } = response.body()

    expect(errors).toBeDefined()
    expect(errors).toHaveLength(1)
    // TODO: Change maybe
    expect(errors[0].message).toBe('not authenticated')
  })
}

export const assertIsForbiddenExeption = ({ response, expect }: { response: ApiResponse, expect: Expect }) => {
  const { errors } = response.body()

  expect(errors).toBeDefined()
  expect(errors).toHaveLength(1)
  expect(errors[0].message).toBe('Forbidden')
}
