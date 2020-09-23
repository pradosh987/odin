import { Request, Response } from "restify";
import { NextHandler } from "../utils";
import * as searchService from "../services/search_service";
import { BadRequestError } from "restify-errors";
import { Theme } from "../models/Theme";
import { suggestSearchKeyword } from "../services/search_service";
import { imageCdnUrls } from "../services/image_service";
import { recordSearchRequest, recordThemeVisit } from "../services/analytic_service";
import { logger } from "../core/logger";
import { NotFoundError } from "objection";

export const search = async (req: Request, res: Response, next: NextHandler) => {
  const query = req.params.q;
  if (!query || query.length < 3) {
    return next(new BadRequestError("Invalid query"));
  }

  recordSearchRequest(query).catch((e) => logger.error(e, query));

  const page = Math.max(Number(req.params.page) || 1, 1);
  const data = await searchService.search(query, page);
  const themes = data.map((t) => ({
    id: t.id,
    name: t.name,
    wallpapers: t.wallpapers,
    icons: t.icons,
    description: t.metaDescription,
    size: t.size,
    website: t.url.website.name,
    websiteUrl: t.url.website.url,
    images: imageCdnUrls(t.images.filter((i) => i.valid)),
  }));
  res.json({
    data: themes,
    // @ts-ignore
    totalPages: Math.ceil(((data[0] && data[0].totalCount) || 0) / 10),
    currentPage: page,
    query: query,
  });
  next();
};

export const visit = async (req: Request, res: Response, next: NextHandler) => {
  const theme = await Theme.query().findById(req.params.id).withGraphFetched("url.[website]");

  if (!theme) return next(new NotFoundError("Theme not found."));
  recordThemeVisit(theme.id).catch((e) => logger.error(e, theme.id));

  const redirectUrl = `${theme.url.website.url}${theme.url.path}`;
  res.redirect(redirectUrl, next);
};

export const suggest = async (req: Request, res: Response, next: NextHandler) => {
  const keywords = await suggestSearchKeyword(req.query.q);
  res.json({
    data: keywords,
  });
  next();
};
