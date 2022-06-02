import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: ["source/entity/**/*.ts"],
  migrations: ["source/migration/**/*.ts"],
  subscribers: ["source/subscriber/**/*.ts"],
})

AppDataSource.initialize().then(async (dataSource) => {
  console.log("Inserting a new user into the database...");
  const user = new User();
  user.firstName = "Timber";
  user.lastName = "Saw";
  user.age = 25;
  await dataSource.manager.save(user);
  console.log("Saved a new user with id: " + user.id);

  console.log("Loading users from the database...");
  const users = await dataSource.manager.find(User);
  console.log("Loaded users: ", users);
})
