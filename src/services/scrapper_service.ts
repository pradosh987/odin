import { Url } from "../models/url";
import { logger } from "../core/logger";
import { buildScrapper } from "../scrappers/scrapper_factory";
import { Website } from "../models/website";
import { BaseScrapper } from "../scrappers/base_scrapper";
import { Theme } from "../models/theme";
import { raw, fn } from "objection";
import { backgroundWorker } from "../core/bullmq";
import * as urlManagerService from "./url_manager_service";
import { Image } from "../models/Image";

const scrapUrl = async (url: Url, maxDepth = 1) => {
  const completeUrl = await url.completeUrl();
  logger.info(`Scrapping Url ${completeUrl}`, url);
  const uri = new URL(completeUrl);
  const scrapper = await buildScrapper(uri);

  if (scrapper.isTheme()) {
    await extractAndSaveTheme(scrapper, url);
  }
  if (maxDepth) {
    const internalLinks = scrapper.internalLinks();
    await enqueueInternalLinks(internalLinks, url.website, maxDepth - 1);
  }

  await Url.query().update({ lastIndexedAt: fn.now() }).where("id", url.id);
};

const extractAndSaveTheme = async (scrapper: BaseScrapper, url: Url) => {
  logger.info("Extracting and saving theme");
  const themeAlreadyExists = await Theme.query().select(1).findOne(raw("url_id = ?", url.id));

  if (themeAlreadyExists) return;

  const theme: Theme = await Theme.query()
    .insert({
      name: scrapper.themeName(),
      metaTitle: scrapper.metaTitle(),
      metaDescription: scrapper.metaDescription(),
      wallpapers: scrapper.wallpapersCount(),
      icons: scrapper.iconsCount(),
      size: scrapper.size(),
      url_id: url.id,
      textContent: scrapper.textContent(),
    })
    .returning("id");

  const images = scrapper.images().map((i): Partial<Image> => ({ remoteUrl: i, themeId: theme.id }));

  if (images.length) {
    await Image.query().insert(images);
    await backgroundWorker.addImageProcessingJob(theme.id);
  }
};

const enqueueInternalLinks = async (internalLinks: URL[], website: Website, maxDepth: number) => {
  logger.info("enqueuing links");
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

const enqueueUrl = async (url: Url, website: Website, maxDepth: number) => {
  logger.info("enqueueUrl", url);
  const uri = new URL(await url.completeUrl());
  if (!(await urlManagerService.isAlreadyDiscovered(uri))) {
    await backgroundWorker.addScrappingJob(url.id, maxDepth);
    await urlManagerService.addToDiscoveredUrls(uri);
    logger.info(url.toString(), "added to queue");
  } else {
    logger.info(url.toString(), "already exists in queue");
  }
};

const scrapWebsite = async (website: Website, maxDepth = 3) => enqueueUrl(await website.homepage(), website, maxDepth);

const scrapAllActiveWebsites = async () =>
  Promise.all((await Website.query().where({ active: true })).map((s) => scrapWebsite(s, 10000)));

export { scrapUrl, scrapWebsite, scrapAllActiveWebsites };
