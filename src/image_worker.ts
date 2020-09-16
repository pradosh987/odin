import "./core/objection";
import "./src/core/sentry";
import { Worker } from "bullmq";
import { IMAGE_PROCESSING_QUEUE } from "./core/bullmq";
import { logger } from "./core/logger";
import { Theme } from "./models/theme";
import { downloadThemesImages } from "./services/image_service";

const worker = new Worker(IMAGE_PROCESSING_QUEUE, async (job) => {
  logger.info(`Starting image download job: ${JSON.stringify(job.data)}`);

  const theme = await Theme.query().findById(job.data.themeId).withGraphFetched("images");

  try {
    await downloadThemesImages(theme);
  } catch (e) {
    logger.error(e);
    throw e;
  }
  logger.info(`Finished image download job: ${JSON.stringify(job.data)}`);
});

process.on("SIGINT", () => worker.close(true));
