import "../core/objection";
import { Worker } from "bullmq";
import { IMAGE_PROCESSING_QUEUE } from "../core/bullmq";
import { logger } from "../core/logger";
import { downloadThemeImage } from "../services/image_service";
import { Sentry } from "../core/sentry";
import { Image } from "../models/Image";

const worker = new Worker(IMAGE_PROCESSING_QUEUE, async (job) => {
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

process.on("SIGINT", () => worker.close(true));
