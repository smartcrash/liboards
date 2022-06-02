import "reflect-metadata";
import { dataSource } from "./dataSource";
import { createApolloServer } from './server';

async function main() {
  await dataSource.initialize()
  const { url } = await createApolloServer()

  console.log(`🚀 Server ready at ${url}`);
}

main()
