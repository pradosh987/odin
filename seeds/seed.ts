import * as Knex from "knex";
import _ from "lodash";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("urls").del();
  await knex("websites").del();

  // Inserts seed entries
  const siteIds = await knex("websites")
    .returning("id")
    .insert([{ name: "ExpoThemes", url: "https://www.expothemes.com" }]);

  const homepageIds = await knex("urls")
    .returning("id")
    .insert(siteIds.map((id) => ({ path: "/", website_id: id })));

  await Promise.all(
    _.zip(siteIds, homepageIds).map(([siteId, urlId]) =>
      knex("websites").where({ id: siteId }).update({ homepage_id: urlId })
    )
  );
}
