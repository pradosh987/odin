import { Theme } from "../models/Theme";
import { raw } from "objection";
import { SearchKeyword } from "../models/SearchKeyword";

export const search = (query: string) => {
  return Theme.query()
    .select("themes.*")
    .from(raw("themes, plainto_tsquery(?) query", query))
    .select(raw("ts_rank_cd(search_vector, query) as sim"))
    .where(raw("search_vector @@ query"))
    .orderBy("sim", "DESC")
    .limit(12)
    .withGraphFetched("url.[website]")
    .withGraphFetched("images");
};

export const suggestSearchKeyword = async (query: string) => {
  return SearchKeyword.query()
    .select("value", raw("similarity(value, ?) as sim", query))
    .where("suggest", true)
    .whereRaw("value % ?", query)
    .orderBy("sim", "DESC")
    .limit(10);
};
