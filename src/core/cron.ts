import { scrapAllActiveWebsites } from "../services/scrapper_service";
import { CronJob } from "cron";

new CronJob("0 18 * * *", scrapAllActiveWebsites).start();
