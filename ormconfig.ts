
import { DataSourceOptions } from "typeorm";

const config = {
  type: "sqlite", // TODO: Move to .env
  database: "database.sqlite",
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
