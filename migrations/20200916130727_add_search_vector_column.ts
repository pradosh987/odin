import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("themes", (t) =>
    t.specificType("search_vector", "tsvector")
  );
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_search_vector_column() RETURNS TRIGGER AS
    $$
    BEGIN
        new.search_vector :=
                    setweight(to_tsvector(new.name), 'A') || setweight(to_tsvector(new.text_content), 'D');
        RETURN new;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE TRIGGER UPDATE_THEME_SEARCH_VECTOR
      BEFORE INSERT OR UPDATE
      ON themes
      FOR EACH ROW
    EXECUTE PROCEDURE update_search_vector_column();
  `);

  return knex.raw(
    "CREATE INDEX search_vector_fts_index ON themes USING gist (search_vector);"
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("themes", (t) => t.dropColumn("search_vector"));

  await knex.raw(
    `DROP TRIGGER IF EXISTS UPDATE_THEME_SEARCH_VECTOR on themes;`
  );

  await knex.raw(`DROP FUNCTION IF EXISTS update_search_vector_column();`);

  return knex.raw("DROP INDEX search_vector_fts_index");
}
