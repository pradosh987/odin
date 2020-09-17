import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("images", (t) => t.boolean("featured").notNullable().defaultTo(false));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("images", (t) => t.dropColumn("featured"));
}
