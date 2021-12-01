import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createConnection } from "typeorm";
import cors from "cors";
import { createSchema } from "./constants/schema";
import { User } from "./entity/User";
import path from "path";

(async () => {
  try {
    const connection = await createConnection({
      type: "postgres",
      database: "typegraphql_example",
      username: "postgres",
      password: process.env.DATABASE_PASSWORD,
      entities: [User],
      migrations: [path.join(__dirname + "./migrations/*")],
    });
    await connection.runMigrations();
    const schema = await createSchema();

    const app = express();

    app.use(
      cors({
        credentials: true,
        origin: ["https://studio.apollographql.com", "http://localhost:3000"],
      })
    );

    const server = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
    });

    await server.start();

    server.applyMiddleware({ app });

    app.listen(4000, () =>
      console.log("server started at http://localhost:4000/graphql")
    );
  } catch (err) {
    console.log(err);
  }
})();
