import { Image } from "../models/Image";
import axios from "axios";
import sharp from "sharp";
import { logger } from "../core/logger";
import path from "path";
import os from "os";
import fs from "fs-extra";
import https from "https";
import { config } from "../core/config";
import { createGoogleCloudWriteStream } from "../core/google_storage";
import { fileWriteStream } from "../utils";

export const imageVariants = {
  thumb: { width: 350, height: 280 },
  medium: { width: 600, height: undefined },
};

const buildImageUrl = (image: Image, variant: "thumb" | "medium") =>
  `${process.env.CDN}/themes/${image.themeId}/${image.uuid}_${variant}.jpg`;

export const imageCdnUrls = (images: Image[]) =>
  images.map((i) => ({
    thumb: i.local ? buildImageUrl(i, "thumb") : i.remoteUrl,
    medium: i.local ? buildImageUrl(i, "medium") : i.remoteUrl,
    featured: i.featured,
  }));

const downloadImageTmp = async ({ remoteUrl, uuid }: Image): Promise<string> => {
  const tmpFile = path.join(os.tmpdir(), `tmp_${uuid}.jpg`);
  await fs.remove(tmpFile);
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const url = new URL(remoteUrl);

  const stream = await axios.get(remoteUrl, {
    responseType: "stream",
    timeout: 5000,
    maxContentLength: 1000 * 1000 * 3,
    ...(url.host === "themepack.me" ? { httpsAgent } : {}),
  });
  const writer = fs.createWriteStream(tmpFile);

  return new Promise((resolve, reject) => {
    stream.data.pipe(writer);
    logger.info("downloading ", remoteUrl, "to", tmpFile);
    writer.on("error", (err) => {
      logger.error(err, remoteUrl, tmpFile);
      writer.close();
      reject(err);
    });
    writer.on("finish", () => {
      logger.info("downloading complete:", remoteUrl, tmpFile);
      resolve(tmpFile);
    });
  });
};

const resizeImage = async (image: Image, source: string, variantKey: string) => {
  // @ts-ignore
  const variant = imageVariants[variantKey];
  const destination = path.join("themes", image.themeId.toString(), `${image.uuid}_${variantKey}.jpg`);

  const writeStream = config.isProduction
    ? createGoogleCloudWriteStream(destination)
    : await fileWriteStream(path.join(<string>process.env.IMAGE_STORE, destination));

  return new Promise((resolve, reject) =>
    sharp(source).resize(variant.width, variant.height).pipe(writeStream).on("finish", resolve).on("error", reject)
  );
};

export const downloadThemeImage = async (image: Image) => {
  logger.info("START: Downloading image: ", image);
  let tmpImage: string | undefined;
  try {
    tmpImage = await downloadImageTmp(image);
    await Promise.all(Object.keys(imageVariants).map((v) => resizeImage(image, <string>tmpImage, v)));
    await Image.query().update({ local: true, valid: true }).where({ id: image.id });
    logger.info("END: Downloading image: ", image);
  } catch (e) {
    if (e.response && e.response.status === 404) {
      await Image.query().update({ valid: false }).where({ id: image.id });
    }
    throw e;
  } finally {
    if (tmpImage) await fs.remove(tmpImage);
  }
};
