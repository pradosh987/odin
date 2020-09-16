import axios, { AxiosRequestConfig } from "axios";
import cheerio from "cheerio";
import { ExpoThemesScrapper } from "./expothemes_scrapper";
import { MicrosoftThemeStoreScrapper } from "./microsoft_theme_store_scrapper";
import { ThemeRaiderScrapper } from "./theme_raider_scrapper";
import { ThemepackScrapper } from "./themepack_scrapper";
import https from "https";

export const buildScrapper = async (url: URL) => {
  switch (url.host) {
    case "www.expothemes.com":
      return new ExpoThemesScrapper(url, await get(url.toString()));
    case "www.themeraider.com":
      return new ThemeRaiderScrapper(url, await get(url.toString()));
    case "www.microsoft.com":
      return new MicrosoftThemeStoreScrapper(url, await get(url.toString()));
    case "themepack.me":
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });
      return new ThemepackScrapper(
        url,
        await get(url.toString(), { httpsAgent: agent })
      );
    default:
      throw Error(`No scrapper found for ${url.host}, ${url.hostname}`);
  }
};

const get = (url: string, config: AxiosRequestConfig = {}) =>
  axios.get(url, config).then((res) => res.data);
