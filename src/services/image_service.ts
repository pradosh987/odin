import { Image } from "../models/Image";
import { Theme } from "../models/theme";
import axios from "axios";
import sharp from "sharp";
import { logger } from "../core/logger";
import path from "path";
import os from "os";
import fs from "fs-extra";

export const imageVariants = {
  thumb: { width: 350, height: 280 },
  medium: { width: 600, height: undefined },
};

const buildImageUrl = (uuid: string, variant: "thumb" | "medium") => `${process.env.CDN}/images/${uuid}_${variant}.jpg`;

export const imageCdnUrls = (images: Image[]) =>
  images.map((i) => ({
    thumb: i.local ? buildImageUrl(i.uuid, "thumb") : i.remoteUrl,
    medium: i.local ? buildImageUrl(i.uuid, "medium") : i.remoteUrl,
  }));

const downloadImageTmp = async ({ remoteUrl, uuid }: Image): Promise<string> => {
  const tmpFile = path.join(os.tmpdir(), `tmp_${uuid}.jpg`);
  await fs.remove(tmpFile);
  const stream = await axios.get(remoteUrl, { responseType: "stream" });
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
  const destination = path.join(
    <string>process.env.IMAGE_STORE,
    "themes",
    image.themeId.toString(),
    `${image.uuid}_${variantKey}.jpg`
  );
  await fs.mkdirp(path.dirname(destination));

  return sharp(source).resize(variant.width, variant.height).toFile(destination);
};

export const downloadThemesImages = async (theme: Theme) => {
  logger.info("START: Downloading themes images: ", theme.id, theme.name);

  await Promise.all(
    (theme.images || []).map(async (i) => {
      const tmpImage = await downloadImageTmp(i);
      await Promise.all(Object.keys(imageVariants).map((v) => resizeImage(i, tmpImage, v)));
      await fs.remove(tmpImage);
      return Image.query().update({ local: true }).where({ id: i.id });
    })
  );

  logger.info("END: Downloading themes images: ", theme.id, theme.name);
};
