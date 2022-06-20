
import { DataSource, DataSourceOptions } from "typeorm";
import { DB_CONNECTION, DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } from "./constants";

export const config = {
  type: DB_CONNECTION,
  database: DB_DATABASE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  logging: false,
  synchronize: false,
  dropSchema: false,
  migrationsRun: true,
  entities: [__dirname + "/entity/*{.ts,.js}"],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  subscribers: [__dirname + "/subscribers/*{.ts,.js}"],

  // See: https://www.npmjs.com/package/typeorm-seeding#%E2%9D%AF-installation
  seeds: [__dirname + '/seeds/*{.ts,.js}'],
  factories: [__dirname + '/factories/*{.ts,.js}'],
} as DataSourceOptions

export const dataSource = new DataSource(config)
