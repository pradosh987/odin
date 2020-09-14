import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("images", (t) => {
    t.bigIncrements("id");
    t.string("remote_url").notNullable();
    t.bigInteger("theme_id").notNullable().index();
    t.foreign("theme_id").references("themes.id").onDelete("CASCADE");
    t.uuid("uuid").notNullable().defaultTo(knex.raw("uuid_generate_v4()"));
    t.boolean("local").defaultTo(false).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("images");
}
