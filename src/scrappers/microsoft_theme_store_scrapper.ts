import { BaseScrapper, SKIP_URL_EXTENSIONS } from "./base_scrapper";
import cheerio from "cheerio";
import { logger } from "../core/logger";
import path from "path";
import _ from "lodash";

export class MicrosoftThemeStoreScrapper extends BaseScrapper {
  isTheme() {
    return this.document("#category a").text().toLowerCase().includes("themes");
  }

  featuredImage(): string | undefined {
    return this.images()[0];
  }

  images(): string[] {
    return this.document(".module-responsive-screenshots  img")
      .map((i, e) => cheerio(e).attr("data-src"))
      .toArray()
      .map((link) => {
        // @ts-ignore
        const url = new URL("https:" + link);
        url.search = "";
        return url.toString();
      });
  }

  themeName(): string {
    return this.document("#DynamicHeading_productTitle").text();
  }

  size(): string | undefined {
    const el = this.document(".c-content-toggle")
      .toArray()
      .find(
        (e) => cheerio(e).find("h4").text().toLowerCase() === "approximate size"
      );
    return !!el ? cheerio(el).find("span").text() : undefined;
  }

  links(): string[] {
    return [
      "#relateditems_overview a",
      ".m-pagination a",
      "#productPlacementList a",
    ].flatMap((s) =>
      this.document(s)
        .toArray()
        .map((link) => <string>cheerio(link).attr("href"))
    );
  }

  internalLinks() {
    const links = this.links()
      .reduce((acc: URL[], urlString: string) => {
        try {
          const url = new URL(urlString, this.url.origin);
          acc.push(url);
        } catch (e) {
          logger.info("Error encoding url.", e);
        }
        return acc;
      }, [])
      .filter(
        (url) =>
          url.host === this.url.host &&
          url.pathname.length &&
          !SKIP_URL_EXTENSIONS.includes(path.extname(url.pathname))
      )
      .map((url) => {
        url.protocol = this.url.protocol;
        return url;
      });

    return _.uniqBy(links, (url) => url.toString()).filter(
      (u) => u.pathname.includes("/p/") || u.pathname.includes("/collections/")
    );
  }
}
