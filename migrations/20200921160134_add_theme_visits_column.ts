import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("theme_visits", (t) => {
    t.bigIncrements("id");
    t.bigInteger("theme_id").notNullable();
    t.foreign("theme_id").references("themes.id");
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("theme_visits");
}
