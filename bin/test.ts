import { faker } from '@faker-js/faker'
import { ApiClient, apiClient } from '@japa/api-client'
import { expect } from '@japa/expect'
import { runFailedTests } from '@japa/run-failed-tests'
import { configure, PluginFn, processCliArgs, run } from '@japa/runner'
import { specReporter } from '@japa/spec-reporter'
import sinon from 'sinon'
import { PORT, SESSION_COOKIE } from '../source/constants'
import { dataSource } from '../source/dataSource'
import { User } from '../source/entity'
import { createServer } from '../source/server'

const authPlugin = (): PluginFn => (config, runner, { Test, TestContext, Group }) => {
  TestContext.macro('createUser', async (client: ApiClient, username: string = faker.internet.userName(), email: string = faker.internet.email(), password: string = faker.internet.password()) => {
    const queryData = {
      query: `
        mutation($username: String!, $email: String!, $password: String!) {
          createUser(username: $username, email: $email, password: $password) {
            errors { field, message }
            user {
              id
              username
              email
              createdAt
              updatedAt
            }
          }
        }
      `,
      variables: {
        username,
        email,
        password,
      }
    };

    const response = await client.post('/').json(queryData)

    const { data } = response.body()

    const user: User = data.createUser.user
    const cookie: string = response.cookie(SESSION_COOKIE).value

    return [{ ...user, password }, cookie]
  })

  TestContext.macro('login', async (client: ApiClient, email: string, password: string): Promise<string> => {
    const queryData = {
      query: `
        mutation LoginWithPassword($email: String!, $password: String!) {
          loginWithPassword(email: $email, password: $password) {
            errors {
              field
              message
            }
            user {
              id
            }
          }
        }
      `,
      variables: {
        email,
        password,
      }
    };

    const response = await client.post('/').json(queryData)
    const cookie = response.cookie(SESSION_COOKIE)

    return cookie?.value
  })

}


/*
|--------------------------------------------------------------------------
| Configure tests
|--------------------------------------------------------------------------
|
| The configure method accepts the configuration to configure the Japa
| tests runner.
|
| The first method call "processCliArgs" process the command line arguments
| and turns them into a config object. Using this method is not mandatory.
|
| Please consult japa.dev/runner-config for the config docs.
*/
configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['source/**/*.test.ts'],
    plugins: [expect(), runFailedTests(), apiClient(`http://localhost:${PORT}/graphql`), authPlugin()],
    reporters: [specReporter()],
    forceExit: true,
    importer: (filePath) => import(filePath),
    configureSuite(suite) {
      suite.onGroup((group) => group.each.teardown(() => sinon.restore()))

      suite.setup(async () => {
        await dataSource.initialize()
        const server = await createServer()

        return () => server.stop()
      })
    }
  },
})

/*
|--------------------------------------------------------------------------
| Run tests
|--------------------------------------------------------------------------
|
| The following "run" method is required to execute all the tests.
|
*/
run()
