import Knex from "knex";
import { Model } from "objection";
import { config } from "./config";

const knex = Knex({
  client: "postgresql",
  connection: {
    database: config.database.database,
    user: config.database.username,
    password: config.database.password,
  },
  pool: {
    min: 2,
    max: Number(config.database.connections),
  },
  migrations: {
    tableName: "knex_migrations",
  },
});

// Give the knex instance to objection.
Model.knex(knex);
