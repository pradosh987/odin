import { imageProcessingQueue, scrapperQueue } from "../core/bullmq";
import { logger } from "../core/logger";
import { Image } from "../models/Image";
import { downloadThemeImage } from "../services/image_service";
import { Sentry } from "../core/sentry";
import { config } from "../core/config";
import { Url } from "../models/Url";
import { scrapUrl } from "../services/scrapper_service";

imageProcessingQueue.process(config.imageWorkers, async (job) => {
  logger.info(`Starting image download job: ${JSON.stringify(job.data)}`);
  const image = await Image.query().findById(job.data.imageId);

  try {
    await downloadThemeImage(image);
  } catch (e) {
    logger.error(e);
    Sentry.captureException(e);
    throw e;
  }
  logger.info(`Finished image download job: ${JSON.stringify(job.data)}`);
});

scrapperQueue.process(config.scrappingWorkers, async (job) => {
  logger.info(`Starting bull job: ${JSON.stringify(job.data)}`);
  const url = await Url.query().findById(job.data.urlId).withGraphFetched("website");

  try {
    await scrapUrl(url, job.data.maxDepth);
  } catch (e) {
    logger.error(e);
    Sentry.captureException(e);
    throw e;
  }
  logger.info(`Finished bull job: ${JSON.stringify(job.data)}`);
});

process.on("SIGINT", async () => {
  await imageProcessingQueue.close();
  await scrapperQueue.close();
});
