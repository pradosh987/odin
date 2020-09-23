import fs from "fs-extra";
import path from "path";

export type NextHandler = (err?: Error) => void;

export const relativeUrl = (url: URL) => `${url.pathname}${url.search}`;

export const fileWriteStream = async (destination: string) => {
  await fs.mkdirp(path.dirname(destination));
  return fs.createWriteStream(destination);
};
