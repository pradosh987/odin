import _ from "lodash";
import cheerio from "cheerio";
import { logger } from "../core/logger";
import path from "path";

const SKIP_URL_EXTENSIONS = [
  ".themepack",
  ".deskthemepack",
  ".png",
  ".jpg",
  ".jpeg",
  ".exe",
  ".zip",
];

export abstract class BaseScrapper {
  protected document: CheerioStatic;
  constructor(protected url: URL, protected html: string) {
    this.document = cheerio.load(html);
  }

  metaTitle() {
    try {
      return this.document("title").text();
    } catch (e) {
      logger.warn(e, this.url);
      return "";
    }
  }

  metaDescription() {
    try {
      return this.document("meta[name='description']").attr("content") || "";
    } catch (e) {
      logger.warn(e, this.url);
      return "";
    }
  }

  canonicalUrl() {
    try {
      return this.document("link[rel='canonical']").attr("href");
    } catch (e) {
      logger.warn(e, this.url);
      return this.url.toString();
    }
  }

  links() {
    return this.document("a")
      .map((i, el) => cheerio(el).attr("href"))
      .toArray()
      .map((e) => e.toString());
  }

  internalLinks() {
    const links = this.links()
      .reduce((acc: URL[], urlString: string) => {
        try {
          const url = new URL(urlString);
          url.search = "";
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

    return _.uniqBy(links, (url) => url.pathname);
  }

  iconsCount(): number | undefined {
    return undefined;
  }

  wallpapersCount(): number | undefined {
    return undefined;
  }

  size(): string | undefined {
    return undefined;
  }

  abstract isTheme(): boolean;

  abstract themeName(): string;

  abstract featuredImage(): string | undefined;

  abstract images(): string[];

  /*
  htmlContent(): string | undefined {
    try {
      const window = new JSDOM("").window;
      // @ts-ignore
      const DOMPurify = createDOMPurify(window);
      const cleanHtml = DOMPurify.sanitize(this.html);

      const dom = new JSDOM(cleanHtml);
      return new Readability(dom.window.document).parse();
    } catch (e) {
      console.warn(e, this.url);
    }
  }
   */
}
