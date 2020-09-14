import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("themes", (t) => {
    t.bigIncrements("id");
    t.string("name").notNullable();
    t.string("meta_title");
    t.string("meta_description");
    t.integer("wallpapers");
    t.integer("icons");
    t.string("size");
    t.text("html_content").notNullable().defaultTo("");
    t.bigInteger("url_id").notNullable().index();
    t.foreign("url_id").references("urls.id");
    t.string("featured_image_url");
    t.specificType("image_urls", "VARCHAR[]").defaultTo("{}").notNullable();
    t.boolean("published").notNullable().defaultTo(true);
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("themes");
}
