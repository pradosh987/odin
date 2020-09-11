import { app, listenApp } from "./src/core/restify";
import { Request, Response } from "restify";
import "./src/core/objection";
import "./src/core/bullmq";
import * as searchController from "./src/controllers/search_controller";

app.get("/", async (req: Request, res: Response, next: () => void) => {
  res.json({ msg: "Hello world" });
  next();
});

app.get("/search", searchController.search);

listenApp(app).then();
