import { BaseScrapper } from "./base_scrapper";
import { logger } from "../core/logger";
import path from "path";

export class ThemepackScrapper extends BaseScrapper {
  featuredImage(): string | undefined {
    return undefined;
  }

  images(): string[] {
    return <string[]>this.document("#image-gallery img")
      .toArray()
      .map(this.getSrcFromImgTag)
      .map((i) => path.join(this.url.origin, <string>i));
  }

  isTheme(): boolean {
    return (
      this.url.pathname.includes("/theme/") &&
      !this.url.pathname.includes("themepack")
    );
  }

  themeName(): string {
    return this.h1();
  }

  wallpapersCount(): number | undefined {
    try {
      return this.document(".uk-list li")
        .last()
        .text()
        .split(" ")
        .map(Number)
        .filter(Boolean)[0];
    } catch (e) {
      logger.warn(e, this.url);
      return undefined;
    }
  }
}
