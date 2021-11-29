import { User } from "../entity/User";
import "dotenv/config";
import { createConnection } from "typeorm";

export const testConnection = (drop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: process.env.DATABASE_PASSWORD,
    database: "typegraphql_example-test",
    synchronize: drop,
    dropSchema: drop,
    entities: [User],
  });
};
