import "reflect-metadata";
import { AppDataSource } from "./DataSource";
import { createApolloServer } from './server';

async function main() {
  await AppDataSource.initialize()
  const { url } = await createApolloServer()

  console.log(`🚀 Server ready at ${url}`);
}

main()
