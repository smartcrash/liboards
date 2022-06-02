import "reflect-metadata";
import { PORT } from "./constants";
import { dataSource } from "./dataSource";
import { createServer } from './server';

async function main() {
  await dataSource.initialize()
  await createServer()

  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

main()
