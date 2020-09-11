import { Theme } from "../models/theme";
import { raw } from "objection";

export const search = (query: string) => {
  return Theme.query()
    .where(
      raw("to_tsvector(name || meta_description) @@ plainto_tsquery(?)", query)
    )
    .limit(12)
    .withGraphFetched("url.[website]");
};
