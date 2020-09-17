import "../core/objection";
import { Worker } from "bullmq";
import { SCRAPPING_QUEUE } from "../core/bullmq";
import { Url } from "../models/Url";
import { logger } from "../core/logger";
import * as scrapperService from "../services/scrapper_service";
import { Sentry } from "../core/sentry";

const worker = new Worker(SCRAPPING_QUEUE, async (job) => {
  logger.info(`Starting bull job: ${JSON.stringify(job.data)}`);
  const url = await Url.query().findById(job.data.urlId).withGraphFetched("website");

  try {
    await scrapperService.scrapUrl(url, job.data.maxDepth);
  } catch (e) {
    logger.error(e);
    Sentry.captureException(e);
    throw e;
  }
  logger.info(`Finished bull job: ${JSON.stringify(job.data)}`);
});

process.on("SIGINT", () => worker.close(true));
