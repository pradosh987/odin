import { BaseScrapper } from "./base_scrapper";
import cheerio from "cheerio";

export class MicrosoftThemeStoreScrapper extends BaseScrapper {
  isTheme() {
    return this.document("#category a").text().toLowerCase().includes("themes");
  }

  featuredImage(): string | undefined {
    return this.images()[0];
  }

  images(): string[] {
    // @ts-ignore
    return this.document(".module-responsive-screenshots  img")
      .map((i, e) => cheerio(e).attr("data-src"))
      .toArray();
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
      ".context-list-page a",
    ].flatMap((s) =>
      this.document(s)
        .toArray()
        .map((link) => <string>cheerio(link).attr("href"))
    );
  }

  internalLinks() {
    return super.internalLinks().filter((u) => u.pathname.includes("/p/"));
  }
}
