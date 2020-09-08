import { app, listenApp } from "./src/core/restify";
import { Request, Response } from "restify";

app.get("/", (req: Request, res: Response, next: () => void) => {
  res.json({ msg: "Helloo world" });

  next();
});

listenApp(app).then();
