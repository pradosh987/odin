import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("themes", (t) => {
    t.dropIndex("url_id");
    t.unique(["url_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {}
