import { ApiClient } from '@japa/api-client'
import '@japa/runner'
import { User } from '../source/entity'

declare module '@japa/runner' {
  interface TestContext {
    // notify TypeScript about custom context properties
    createUser(client: ApiClient, username?: string, email?: string, password?: string): Promise<[User, string]>
  }

  interface Test<TestData> {
    // notify TypeScript about custom test properties
  }
}
