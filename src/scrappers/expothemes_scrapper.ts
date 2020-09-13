import { BaseScrapper } from "./base_scrapper";
import cheerio from "cheerio";
import { logger } from "../core/logger";

export class ExpoThemesScrapper extends BaseScrapper {
  isTheme() {
    return this.url.pathname.endsWith(".html");
  }

  featuredImage() {
    try {
      return this.document("meta[property='og:image']").attr("content");
    } catch (e) {
      logger.warn(e, this.url);
      return undefined;
    }
  }

  images(): string[] {
    const doc = cheerio.load(this.html);
    doc(".yarpp-related").remove();
    return <string[]>(
      doc("img", "article").toArray().map(this.getSrcFromImgTag).filter(Boolean)
    );
  }

  themeName(): string {
    return this.document(".article__title--single").text();
  }

  wallpapersCount() {
    const elements = this.document("tr", ".theme-spec").filter((i, tr) => {
      const td = cheerio(tr).find("td");
      return !!td && cheerio(td[0]).text().toLowerCase() == "wallpapers";
    });

    if (elements.length !== 1) return 0;
    return Number.parseInt(cheerio(cheerio(elements[0]).find("td")[1]).text());
  }

  iconsCount() {
    const elements = this.document("tr", ".theme-spec").filter((i, tr) => {
      const td = cheerio(tr).find("td");
      return !!td && cheerio(td[0]).text().toLowerCase() == "icons";
    });

    if (elements.length !== 1) return 0;
    return Number.parseInt(cheerio(cheerio(elements[0]).find("td")[1]).text());
  }
  size(): string | undefined {
    try {
      const elements = this.document("tr", ".theme-spec").filter((i, tr) => {
        const td = cheerio(tr).find("td");
        return !!td && cheerio(td[0]).text().toLowerCase() == "size";
      });

      if (elements.length !== 1) return undefined;
      return cheerio(cheerio(elements[0]).find("td")[1]).text();
    } catch (e) {
      logger.warn(e, this.url);
    }
  }
}
