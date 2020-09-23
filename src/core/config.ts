export const config = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  appName: "Odin",
  secret: process.env.SECRET,
  redis: process.env.REDIS,
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connections: process.env.DB_CONNECTIONS,
  },
  log: {
    level: process.env.LOG_LEVEL || "info",
    logfile: process.env.LOG_FILE || "logs/odin.log",
  },
  imageWorkers: Number(process.env.IMAGE_WORKER_COUNT) || 1,
  scrappingWorkers: Number(process.env.SCRAPPER_WORKER_COUNT) || 1,
  googleCloudKeyFile: process.env.GOOGLE_CLOUD_KEY_FILE,
  googleCloudBucket: "digthemes",
};
