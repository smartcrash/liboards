import { apiClient } from '@japa/api-client'
import { expect } from '@japa/expect'
import { runFailedTests } from '@japa/run-failed-tests'
import { configure, processCliArgs, run } from '@japa/runner'
import { specReporter } from '@japa/spec-reporter'
import { PORT } from '../source/constants'
import { dataSource } from '../source/dataSource'
import { createServer } from '../source/server'
import sinon from 'sinon'

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
    plugins: [expect(), runFailedTests(), apiClient(`http://localhost:${PORT}/graphql`)],
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
