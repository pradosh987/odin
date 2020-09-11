import { Url } from "../models/url";
import { logger } from "../core/logger";
import { buildScrapper } from "../scrappers/scrapper_factory";
import { Website } from "../models/website";
import { BaseScrapper } from "../scrappers/base_scrapper";
import { Theme } from "../models/theme";
import { raw } from "objection";

const scrapUrl = async (url: Url, maxDepth = 1) => {
  const completeUrl = url.completeUrl();
  logger.info(`Scrapping Url ${completeUrl}: ${url}`);
  const uri = new URL(completeUrl);
  const scrapper = await buildScrapper(uri);

  if (scrapper.isTheme()) {
    await extractAndSaveTheme(scrapper, url);
  }

  if (maxDepth) {
    const internalLinks = scrapper.internalLinks();
    await enqueueInternalLinks(internalLinks, url.website, maxDepth - 1);
  }
};

const extractAndSaveTheme = async (scrapper: BaseScrapper, url: Url) => {
  const themeAlreadyExists = await Theme.query()
    .select(1)
    .findOne(raw("url_id = ?", url.id));

  if (themeAlreadyExists) return;

  const theme: Partial<Theme> = {
    name: scrapper.themeName(),
    metaTitle: scrapper.metaTitle(),
    metaDescription: scrapper.metaDescription(),
    wallpapers: scrapper.wallpapersCount(),
    icons: scrapper.iconsCount(),
    size: scrapper.size(),
    featuredImageUrl: scrapper.featuredImage(),
    imageUrls: scrapper.images(),
    url_id: url.id,
  };
  return Theme.query().insert(theme);
};

const enqueueInternalLinks = async (
  internalLinks: URL[],
  website: Website,
  maxDepth: number
) => {
  const urlsInDB = await Url.query()
    .where({ website_id: website.id })
    .whereIn(
      "path",
      internalLinks.map((i) => i.pathname)
    );
  const urlsInDBPaths = urlsInDB.map((url) => url.path);

  const newUrls = internalLinks
    .filter((u) => !urlsInDBPaths.includes(u.pathname))
    .map((u) => ({ website_id: website.id, path: u.pathname }));

  const newUrlsInDb = await Url.query().insert(newUrls).returning("*");

  await Promise.all(urlsInDB.map((u) => enqueueUrl(u, website, maxDepth)));
  await Promise.all(newUrlsInDb.map((u) => enqueueUrl(u, website, maxDepth)));
};

const enqueueUrl = (url: Url, website: Website, maxDepth: number) => {
  console.log("enqueueUrl", url.path);
};

const scrapWebsite = async (website: Website, maxDepth = 3) =>
  enqueueUrl(await website.homepage(), website, maxDepth);

const scrapAllActiveWebsites = async () =>
  Promise.all(
    (await Website.query().where({ active: true })).map(scrapWebsite)
  );

export { scrapUrl, scrapWebsite, scrapAllActiveWebsites };
