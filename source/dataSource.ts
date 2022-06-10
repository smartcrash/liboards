
import { DataSource } from "typeorm";
import { User, Board } from "./entity";

export const dataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  logging: false,
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  entities: [User, Board],
  // migrations: ["source/migration/**/*.ts"],
  // subscribers: ["source/subscriber/**/*.ts"],
})
