import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("search_keywords", (t) => {
    t.bigIncrements("id");
    t.string("value").notNullable();
    t.boolean("suggest");
    t.timestamp("created_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("search_keywords");
}
