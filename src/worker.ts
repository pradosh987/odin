import "./core/objection";
import { Worker } from "bullmq";
import { SCRAPPING_QUEUE } from "./core/bullmq";
import { Url } from "./models/url";
import { logger } from "./core/logger";
import * as scrapperService from "./services/scrapper_service";

const worker = new Worker(SCRAPPING_QUEUE, async (job) => {
  logger.info(`Starting bull job: ${JSON.stringify(job.data)}`);
  const url = await Url.query()
    .findById(job.data.urlId)
    .withGraphFetched("website");

  try {
    await scrapperService.scrapUrl(url, job.data.maxDepth);
  } catch (e) {
    logger.error(e);
    throw e;
  }
  logger.info(`Finished bull job: ${JSON.stringify(job.data)}`);
});

process.on("SIGINT", () => worker.close(true));
