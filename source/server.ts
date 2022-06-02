
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import "reflect-metadata";
import { buildSchema } from 'type-graphql';

async function createApolloServer({ port = 4000 }: { port?: number } = {}) {
  const app = express();
  const httpServer = http.createServer(app);


  const schema = await buildSchema({
    resolvers: [__dirname + "/resolver/*.resolver.ts"],
    dateScalarMode: 'isoDate',
  })

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise<void>(resolve => httpServer.listen(port, resolve));

  return {
    server,
    url: `http://localhost:${port}${server.graphqlPath}`
  }
}

export { createApolloServer }
