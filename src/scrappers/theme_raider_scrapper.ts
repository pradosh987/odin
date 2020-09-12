import { BaseScrapper } from "./base_scrapper";
import cheerio from "cheerio";

export class ThemeRaiderScrapper extends BaseScrapper {
  isTheme(): boolean {
    return this.url.pathname.includes("-theme-");
  }

  featuredImage(): string | undefined {
    return this.document(".feat-img img").attr("src");
  }

  images(): string[] {
    return this.document(".themepack-gallery img")
      .toArray()
      .map((e) => <string>cheerio(e).attr("src"));
  }

  themeName(): string {
    return this.h1();
  }

  wallpapersCount(): number | undefined {
    try {
      return (
        Number(this.document(".themepack-data").text().split(" ")[0]) ||
        undefined
      );
    } catch (e) {
      return undefined;
    }
  }

  internalLinks(): URL[] {
    return super.internalLinks().filter((url) => url.pathname.length > 1);
  }
}
