import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("urls", (t) => {
    t.bigIncrements("id");
    t.string("path").notNullable();
    t.bigInteger("website_id").notNullable();
    t.foreign("website_id").references("websites.id");
    t.unique(["website_id", "path"]);
    t.timestamp("created_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("urls");
}
