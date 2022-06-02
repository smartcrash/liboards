
import { DataSource } from "typeorm";
import { NODE_ENV } from "./constants";
import { User } from "./entity";

export const dataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  logging: false,
  synchronize: false,
  dropSchema: NODE_ENV === 'development',
  migrationsRun: true,
  entities: [User],
  migrations: ["source/migration/**/*.ts"],
  subscribers: ["source/subscriber/**/*.ts"],
})
