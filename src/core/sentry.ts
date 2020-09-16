import * as Sentry from "@sentry/node";
import * as Tracking from "@sentry/tracing";

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  tracesSampleRate: 1.0,
});

export { Sentry };
