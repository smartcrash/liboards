
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import sqlite from "better-sqlite3";
import createSqliteStore from 'better-sqlite3-session-store';
import cors from 'cors';
import express from 'express';
import session from "express-session";
import http from 'http';
import "reflect-metadata";
import { buildSchema } from 'type-graphql';
import { NODE_ENV, PORT } from './constants';
import { dataSource } from './dataSource';
import { TContext } from './types';

async function createServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const SqliteStore = createSqliteStore(session)
  const db = new sqlite("sessions.db", {});

  app.use(cors({
    origin: ['https://studio.apollographql.com'],
    credentials: true,
  }))

  app.use(
    session({
      name: 'sid',
      saveUninitialized: false,
      store: new SqliteStore({
        client: db,
        expired: { clear: false }
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax',
        secure: NODE_ENV === 'production' // Whether the cookie is only visible over https
      },
      secret: "qneojn231on321io3j9012u490123j2n1in", // TODO: Move to .env
      resave: false,
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
    context: ({ req, res }) => ({ req, res, dataSource } as TContext)
  });

  await server.start()

  server.applyMiddleware({ app, cors: false });

  await new Promise<void>(resolve => httpServer.listen(PORT, resolve));

  return server
}

export { createServer };

