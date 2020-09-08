import { createServer, plugins, Server } from "restify";
import { config } from "./config";
import { logger } from "./logger";
// import { mountRoutes } from "../routes";

const app = createServer();

[
  plugins.pre.context(),
  plugins.pre.dedupeSlashes(),
  plugins.pre.sanitizePath(),
  plugins.pre.userAgentConnection(),
].forEach((plugin) => app.pre(plugin));

[
  plugins.acceptParser(app.acceptable),
  plugins.queryParser({ mapParams: true }),
  plugins.bodyParser({ mapParams: true }),
  plugins.fullResponse(),
  plugins.requestLogger(),
  plugins.throttle({
    burst: 10, // Max 10 concurrent requests (if tokens)
    rate: 5, // Steady state: 5 request / 1 seconds
    ip: true, // throttle per IP
    overrides: {
      "192.168.1.1": {
        burst: 0,
        rate: 0, // unlimited
      },
    },
  }),
].forEach((plugin) => app.use(plugin));

app.on(
  "after",
  plugins.auditLogger({
    log: logger,
    event: "after",
    printLog: true,
  })
);

// // Mount routes
// mountRoutes(app);

const listenApp = (app: Server): Promise<Server> => {
  return new Promise((resolve) =>
    app.listen(config.port, (err: Error) => {
      if (err) {
        logger.error("Error while starting Restify server", err);
        throw err;
      }
      logger.info(`Restify server started successfully.`);

      process.on("SIGINT", function () {
        logger.info("SIGINT received, shutting down restify server.");
        app.close(() =>
          logger.info("Restify server shutdown complete after SIGINT signal.")
        );
      });
      resolve(app);
    })
  );
};

export { app, listenApp };
