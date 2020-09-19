import "../core/objection";
import Queue from "bull";

export const SCRAPPING_QUEUE = "SCRAPPER";
export const IMAGE_PROCESSING_QUEUE = "IMAGE_PROCESSOR";

export const scrapperQueue = new Queue(SCRAPPING_QUEUE);
export const imageProcessingQueue = new Queue(IMAGE_PROCESSING_QUEUE);

const addScrappingJob = (urlId: number, maxDepth: number) => {
  return scrapperQueue.add({ urlId, maxDepth });
};

const addImageProcessingJob = (imageId: number) => {
  return imageProcessingQueue.add({ imageId });
};

export const backgroundWorker = {
  addScrappingJob,
  addImageProcessingJob,
};
