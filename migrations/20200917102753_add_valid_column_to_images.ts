import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("images", (t) => t.boolean("valid"));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("images", (t) => t.dropColumn("valid"));
}
