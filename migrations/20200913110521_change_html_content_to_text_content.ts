import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("themes", (t) => {
    t.renameColumn("html_content", "text_content");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("themes", (t) => {
    t.renameColumn("text_content", "html_content");
  });
}
