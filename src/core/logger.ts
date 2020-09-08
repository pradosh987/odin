import bunyan, { Stream } from "bunyan";
import { config } from "./config";

export const logger = bunyan.createLogger({
  name: config.appName,
  streams: <Stream[]>[
    {
      level: config.log.level,
      path: config.log.logfile,
    },
  ],
});
