
import { DataSource, DataSourceOptions } from "typeorm";

const config: DataSourceOptions = {
  type: "sqlite", // TODO: Move to .env
  database: "database.sqlite",
  logging: true,
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  entities: ["source/entity/*.ts"],
  migrations: ["source/migrations/*.ts"],
  subscribers: ["source/subscribers/*.ts"],
}

export const dataSource = new DataSource(config)
