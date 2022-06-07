
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis'
import cors from 'cors';
import express from 'express';
import session from "express-session";
import http from 'http';
import { createClient as createRedisClient } from 'redis';
import "reflect-metadata";
import { buildSchema } from 'type-graphql';
import { NODE_ENV, PORT, SESSION_COOKIE } from './constants';
import { dataSource } from './dataSource';
import { redisClient } from './redisClient';
import { TContext } from './types';

async function createServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors({
    origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    credentials: true,
  }))

  const RedisStore = connectRedis(session)
  const client = createRedisClient({ legacyMode: true })
  await client.connect()

  app.use(
    session({
      name: SESSION_COOKIE,
      secret: "keyboard cat", // TODO: Move to .env
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({
        client,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax',
        secure: NODE_ENV === 'production', // Whether the cookie is only visible over https
      },
    })
  )

  const schema = await buildSchema({
    resolvers: [__dirname + "/resolver/*.resolver.ts"],
    dateScalarMode: 'isoDate',
    validate: false
  })

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req, res }) => ({ req, res, dataSource, redisClient } as TContext)
  });

  await server.start()

  server.applyMiddleware({ app, cors: false });

  await new Promise<void>(resolve => httpServer.listen(PORT, resolve));

  return server
}

export { createServer };

