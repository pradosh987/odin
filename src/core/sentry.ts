import Sentry from "@sentry/node";
import Tracking from "@sentry/tracing";

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  tracesSampleRate: 1.0,
});
