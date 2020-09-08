import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("websites", (t) => {
    t.bigIncrements("id");
    t.string("name").notNullable();
    t.string("url").notNullable().unique();
    t.boolean("active").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("websites");
}
