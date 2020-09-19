import { Url } from "../models/Url";
import { logger } from "../core/logger";
import { buildScrapper } from "../scrappers/scrapper_factory";
import { Website } from "../models/Website";
import { BaseScrapper } from "../scrappers/base_scrapper";
import { Theme } from "../models/Theme";
import { raw, fn } from "objection";
import { backgroundWorker } from "../core/bullmq";
import * as urlManagerService from "./url_manager_service";
import { Image } from "../models/Image";
import { relativeUrl } from "../utils";
import moment from "moment";

const scrapUrl = async (url: Url, maxDepth = 1) => {
  const completeUrl = await url.completeUrl();
  logger.info(`Scrapping Url ${completeUrl}`, url);
  const uri = new URL(completeUrl);
  let scrapper: BaseScrapper;
  try {
    scrapper = await buildScrapper(uri);
  } catch (e) {
    if (e.response && e.response.status !== 200) {
      return Url.query().update({ statusCode: e.response.status, lastIndexedAt: fn.now() }).where({ id: url.id });
    }
    throw e;
  }

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
    const imgs = await Image.query().insert(images).returning("id");
    await Promise.all(imgs.map((i) => backgroundWorker.addImageProcessingJob(i.id)));
  }
};

const enqueueInternalLinks = async (internalLinks: URL[], website: Website, maxDepth: number) => {
  logger.info("enqueuing links");
  const relativeUrls = internalLinks.map(relativeUrl);
  const urlsInDB = await Url.query().where({ website_id: website.id }).whereIn("path", relativeUrls);
  const urlsInDBPaths = urlsInDB.map((url) => url.path);

  const newUrls = relativeUrls
    .filter((u) => !urlsInDBPaths.includes(u))
    .map((u) => ({ website_id: website.id, path: u }));

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

const scrapWebsite = async (website: Website, maxDepth = 2) => {
  if (!website.lastIndexedAt || moment(website.lastIndexedAt).add(18, "hours").isBefore(moment())) {
    await enqueueUrl(await website.homepage(), website, maxDepth);
    return Website.query().update({ lastIndexedAt: fn.now() }).where({ id: website.id });
  } else {
    logger.warn("Last index was within last 18 hr window", website);
  }
};

const scrapAllActiveWebsites = async () =>
  Promise.all((await Website.query().where({ active: true })).map(scrapWebsite));

export { scrapUrl, scrapWebsite, scrapAllActiveWebsites };
