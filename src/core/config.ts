const env = process.env.NODE_ENV || "development";

if (env === "development") {
  import("dotenv").then((dotenv) => dotenv.config());
}

export const config = {
  port: process.env.PORT || 4000,
  env: env,
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
};
