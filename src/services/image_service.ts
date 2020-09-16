import { Image } from "../models/Image";
import axios from "axios";
import sharp from "sharp";
export const downloadAndResizeImage = async () => {
  const stream = await axios.get(
    "https://d23ucobrkosh65.cloudfront.net/wp-content/uploads/2020/05/aditi-rao-hydari-windows-10-theme-preview-2.jpg",
    { responseType: "arraybuffer" }
  );
  // @ts-ignore
  return sharp(stream.data).resize(500).toFile("output.jpg");
};

const buildImageUrl = (uuid: string, variant: "thumb" | "medium") =>
  `${process.env.CDN}/images/${uuid}_${variant}.jpg`;

export const imageCdnUrls = (images: Image[]) =>
  images.map((i) => ({
    thumb: i.local ? buildImageUrl(i.uuid, "thumb") : i.remoteUrl,
    medium: i.local ? buildImageUrl(i.uuid, "medium") : i.remoteUrl,
  }));
