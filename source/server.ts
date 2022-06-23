
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import session from "express-session";
import http from 'http';
import "reflect-metadata";
import { buildSchema } from 'type-graphql';
import { ApolloServerLoaderPlugin } from "type-graphql-dataloader";
import { APP_ENV, APP_PORT, CORS_ORIGIN, SESSION_COOKIE, SESSION_SECRET } from './constants';
import { dataSource } from './dataSource';
import { ContextType } from './types';

async function createServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.set('trust proxy', 1)

  app.use(cors({
    origin: [CORS_ORIGIN, 'https://studio.apollographql.com'],
    credentials: true,
  }))

  // const RedisStore = connectRedis(session)
  // const client = createRedisClient({ url: REDIS_URL, legacyMode: true })
  // await client.connect()

  app.use(
    session({
      name: SESSION_COOKIE,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      /*
        WARNING: The default server-side session storage, MemoryStore, is
        purposely not designed for a production environment. It will leak
        memory under most conditions, does not scale past a single process,
        and is meant for debugging and developing.
      */
      // store: new RedisStore({
      //   client,
      //   disableTouch: true
      // }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax',
        secure: APP_ENV === 'production', // Whether the cookie is only visible over https
        domain: '.vercel.app'
      },
    })
  )

  const schema = await buildSchema({
    resolvers: [__dirname + "/resolvers/*{.ts,.js}"],
    dateScalarMode: 'isoDate',
    validate: false
  })

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerLoaderPlugin({ typeormGetConnection: () => dataSource })
    ],
    context: ({ req, res }) => ({ req, res } as ContextType)
  });

  await server.start()

  server.applyMiddleware({ app, cors: false });

  await new Promise<void>(resolve => httpServer.listen(APP_PORT, resolve));

  return server
}

export { createServer };

