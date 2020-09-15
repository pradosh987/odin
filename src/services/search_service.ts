import { Theme } from "../models/theme";
import { raw } from "objection";
import { SearchKeyword } from "../models/SearchKeyword";

export const search = (query: string) => {
  return Theme.query()
    .where(
      raw("to_tsvector(name || meta_description) @@ plainto_tsquery(?)", query)
    )
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
