# Liboards

## Getting started

Clone the repo locally:

```bash
git clone https://github.com/smartcrash/liboards.git
cd liboards
```

Setup the GraphQL server:
```bash
npm i                    # Install NPM dependencies
cp .env.example .env     # Setup configuration

# Run the dev server (the output will give the address)
npm start
```

On another terminal setup and start the client:

```bash
cd ./client              # Go to the client's source folder
npm i
cp .env.example .env
npm run dev              # Run the dev server (the output will give the address)
```

You're ready to go! Visit **Liboards** in your browser (default to [http://localhost:3000](http://localhost:3000)), and create an account.



## Running tests

I suggest to run your test in a sqlite in memory database, for this you need to create a `.env.test` file with the following:

```
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
```

And with that you are ready to go and run some tests.

- To run e2e tests (with [Cypress](https://www.cypress.io/)) execute:
```bash
npm run cypress # or cypress:open
```

- To run integration tests (with [Japa](https://japa.dev/)) execute:
```bash
npm test
```

- And finally run run unit tests (using [vitest](https://vitest.dev/)) for the React components execute:
```bash
cd ./client
npm tests
```
