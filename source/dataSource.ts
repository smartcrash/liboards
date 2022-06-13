
import { DataSource } from "typeorm";
import { User, Board, Column, Card } from "./entity";

export const dataSource = new DataSource({
  type: "sqlite", // TODO: Move to .env
  database: "database.sqlite",
  logging: false,
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  entities: [User, Board, Column, Card],
  // migrations: ["source/migrations/**/*.ts"],
  // subscribers: ["source/subscribers/**/*.ts"],
})
