import { Request, Response } from "restify";
import { NextHandler } from "../utils";
import * as searchService from "../services/search_service";
import { BadRequestError } from "restify-errors";
import { Theme } from "../models/theme";
import path from "path";
import { suggestSearchKeyword } from "../services/search_service";

export const search = async (
  req: Request,
  res: Response,
  next: NextHandler
) => {
  const query = req.params.q;
  if (!query || query.length < 3) {
    return next(new BadRequestError("Invalid query"));
  }

  const themes = await searchService.search(query);
  res.json({
    data: themes,
  });
  next();
};

export const visit = async (req: Request, res: Response, next: NextHandler) => {
  const theme = await Theme.query()
    .findById(req.params.id)
    .withGraphFetched("url.[website]");

  const redirectUrl = path.join(theme.url.website.url, theme.url.path);
  res.redirect(redirectUrl, next);
};

export const suggest = async (
  req: Request,
  res: Response,
  next: NextHandler
) => {
  const keywords = await suggestSearchKeyword(req.query.q);
  res.json({
    data: keywords,
  });
  next();
};
