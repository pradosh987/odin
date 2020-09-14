import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("search_requests", (t) => {
    t.bigIncrements("id");
    t.bigInteger("search_keyword_id").notNullable().index();
    t.foreign("search_keyword_id").references("search_keywords.id");
    t.string("ip");
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("search_requests");
}
