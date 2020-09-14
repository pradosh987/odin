import { BaseModel } from "./base_model";
import { SearchKeyword } from "./SearchKeyword";
import { Model } from "objection";

export class SearchRequest extends BaseModel {
  static tableName = "search_requests";

  id: number;
  searchKeywordId: number;
  searchKeyword: SearchKeyword;
  ip: string;

  static relationMappings = {
    search_keywords: {
      relation: Model.BelongsToOneRelation,
      modelClass: SearchKeyword,
      join: {
        from: "search_requests.search_keyword_id",
        to: "search_requests.id",
      },
    },
  };
}
