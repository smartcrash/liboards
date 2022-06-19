
import { DataSourceOptions } from "typeorm";
import { DB_CONNECTION, DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } from "./source/constants";

const config = {
  type: DB_CONNECTION,
  database: DB_DATABASE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  logging: false,
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  entities: ["source/entity/*.ts"],
  migrations: ["source/migrations/*.ts"],
  subscribers: ["source/subscribers/*.ts"],
  seeds: ['source/seeds/*.ts'],
  factories: ['source/factories/*.ts'],
} as DataSourceOptions

export default config
