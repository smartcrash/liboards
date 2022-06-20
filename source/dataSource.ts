
import { DataSource, DataSourceOptions } from "typeorm";
import { APP_DEBUG, APP_ENV, DB_CONNECTION, DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } from "./constants";

export const config = {
  type: DB_CONNECTION,
  database: DB_DATABASE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  logging: APP_DEBUG,
  synchronize: APP_ENV === 'test',
  dropSchema: APP_ENV === 'test',
  migrationsRun: APP_ENV !== 'test',
  entities: [__dirname + "/entity/*{.ts,.js}"],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  subscribers: [__dirname + "/subscribers/*{.ts,.js}"],
} as DataSourceOptions

export const dataSource = new DataSource(config)
