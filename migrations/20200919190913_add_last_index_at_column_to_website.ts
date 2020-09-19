import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("websites", (t) => t.timestamp("last_indexed_at"));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("websites", (t) => t.dropColumn("last_indexed_at"));
}
