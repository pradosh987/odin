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
