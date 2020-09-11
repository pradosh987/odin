import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("websites", (t) => {
    t.bigInteger("homepage_id");
    t.foreign("homepage_id").references("urls.id").onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("websites", (t) => {
    t.dropColumn("homepage_id");
  });
}
