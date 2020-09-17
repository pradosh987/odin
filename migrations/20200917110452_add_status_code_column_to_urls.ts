import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("urls", (u) => u.integer("status_code"));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("urls", (u) => u.dropColumn("status_code"));
}
