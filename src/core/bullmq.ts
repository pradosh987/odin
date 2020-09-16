import { Queue } from "bullmq";
import "../core/objection";
import { getRedisClient } from "./redis";

const connection = getRedisClient();

export const SCRAPPING_QUEUE = "SCRAPPER";
export const IMAGE_PROCESSING_QUEUE = "IMAGE_PROCESSOR";

const queue = new Queue(SCRAPPING_QUEUE, { connection });
const imageQueue = new Queue(IMAGE_PROCESSING_QUEUE, {
  connection: getRedisClient(),
});

const addScrappingJob = (urlId: number, maxDepth: number) => {
  return queue.add(SCRAPPING_QUEUE, { urlId, maxDepth });
};

const addImageProcessingJob = (themeId: number) => {
  return imageQueue.add(IMAGE_PROCESSING_QUEUE, { themeId });
};

export const backgroundWorker = {
  addScrappingJob,
  addImageProcessingJob,
};
