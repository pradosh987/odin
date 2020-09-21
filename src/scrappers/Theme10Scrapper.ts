import { BaseScrapper } from "./base_scrapper";

export class Theme10Scrapper extends BaseScrapper {
  featuredImage(): string | undefined {
    return undefined;
  }

  images(): string[] {
    return this.document("img", ".gallery")
      .toArray()
      .map((e) => {
        const url = this.getSrcFromImgTag(e);
        return url && url.includes("http") ? url : "http:" + url;
      })
      .filter(Boolean)
      .slice(0, 5);
  }

  isTheme(): boolean {
    return this.links().findIndex((u) => u.includes(".themepack") || u.includes(".deskthemepack")) > -1;
  }

  themeName(): string {
    return this.h1();
  }
}
