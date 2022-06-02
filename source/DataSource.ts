
import { DataSource } from "typeorm";
import { isDev } from "./constants";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  logging: isDev,
  synchronize: false,
  dropSchema: isDev,
  migrationsRun: true,
  entities: ["source/entity/**/*.ts"],
  migrations: ["source/migration/**/*.ts"],
  subscribers: ["source/subscriber/**/*.ts"],
})
