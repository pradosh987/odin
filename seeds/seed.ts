import * as Knex from "knex";
import _ from "lodash";
import { Website } from "../src/models/website";
import { Url } from "../src/models/url";

export async function seed(knex: Knex): Promise<void> {
  try {
    await knex.transaction(async (trx) => {
      // Deletes ALL existing entries
      await knex("urls").del();
      await knex("websites").del();

      // Inserts seed entries
      const siteIds = await knex("websites")
        .returning("id")
        .insert([
          {
            name: "ExpoThemes",
            url: "https://www.expothemes.com",
            active: true,
          },
          { name: "Themepack", url: "https://themepack.me", active: true },
          {
            name: "ThemeRaider",
            url: "https://www.themeraider.com",
            active: true,
          },
        ]);

      const homepageIds = await knex("urls")
        .returning("id")
        .insert(siteIds.map((id) => ({ path: "/", website_id: id })));

      await Promise.all(
        _.zip(siteIds, homepageIds).map(([siteId, urlId]) =>
          knex("websites").where({ id: siteId }).update({ homepage_id: urlId })
        )
      );

      const siteId = await knex("websites")
        .insert({
          name: "Microsoft",
          url: "https://www.microsoft.com",
          active: true,
        })
        .returning("id");

      const urlId = await knex("urls")
        .insert({
          path:
            "/en-us/store/top-free/apps/pc?category=Personalization%5cThemes&cid=msft_web_collection",
          website_id: siteId[0],
        })
        .returning("id");

      await knex("websites")
        // @ts-ignore
        .update({ homepage_id: urlId[0] })
        .where({ id: siteId[0] });
    });
  } catch (e) {
    console.error(e);
  }
}
