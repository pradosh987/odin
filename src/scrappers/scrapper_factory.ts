import axios from "axios";
import cheerio from "cheerio";
import { ExpoThemesScrapper } from "./expothemes_scrapper";
import { MicrosoftThemeStoreScrapper } from "./microsoft_theme_store_scrapper";
import { ThemeRaiderScrapper } from "./theme_raider_scrapper";
import { ThemepackScrapper } from "./themepack_scrapper";

export const buildScrapper = async (url: URL) => {
  const rawHtml = (await axios.get(url.toString())).data;

  switch (url.host) {
    case "www.expothemes.com":
      return new ExpoThemesScrapper(url, rawHtml);
    case "www.microsoft.com":
      return new MicrosoftThemeStoreScrapper(url, rawHtml);
    case "www.themeraider.com":
      return new ThemeRaiderScrapper(url, rawHtml);
    case "themepack.me":
      return new ThemepackScrapper(url, rawHtml);
    default:
      throw Error(`No scrapper found for ${url}`);
  }
};
