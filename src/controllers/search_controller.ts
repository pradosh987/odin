import { Request, Response } from "restify";
import { NextHandler } from "../utils";
import * as searchService from "../services/search_service";
import { BadRequestError } from "restify-errors";
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
