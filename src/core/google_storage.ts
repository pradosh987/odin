import { Storage } from "@google-cloud/storage";
import { config } from "./config";

export const storage = new Storage({ keyFilename: config.googleCloudKeyFile });

export const createGoogleCloudWriteStream = (filepath: string) =>
  storage
    .bucket(<string>config.googleCloudBucket)
    .file(filepath)
    .createWriteStream();
