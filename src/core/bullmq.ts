import { Queue } from "bullmq";
import "../core/objection";
import { getRedisClient } from "./redis";

const connection = getRedisClient();

export const SCRAPPING_QUEUE = "SCRAPPER";

const queue = new Queue(SCRAPPING_QUEUE, { connection });

export const addScrappingJob = (urlId: number, maxDepth: number) => {
  return queue.add(SCRAPPING_QUEUE, { urlId, maxDepth });
};
