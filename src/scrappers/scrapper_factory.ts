import axios, { AxiosRequestConfig } from "axios";
import cheerio from "cheerio";
import { ExpoThemesScrapper } from "./expothemes_scrapper";
import { MicrosoftThemeStoreScrapper } from "./microsoft_theme_store_scrapper";
import { ThemeRaiderScrapper } from "./theme_raider_scrapper";
import { ThemepackScrapper } from "./themepack_scrapper";
import https from "https";
import { Theme10Scrapper } from "./Theme10Scrapper";

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
      return new ThemepackScrapper(url, await get(url.toString(), { httpsAgent: agent }));
    case "themes10.win":
      return new Theme10Scrapper(url, await get(url.toString()));
    default:
      throw Error(`No scrapper found for ${url.host}, ${url.hostname}`);
  }
};

const get = (url: string, config: AxiosRequestConfig = {}) =>
  axios.get(url, { timeout: 5000, ...config, maxContentLength: 500 * 1000 }).then((res) => res.data);
