import { BaseModel } from "./BaseModel";
import { Model } from "objection";
import { SearchRequest } from "./SearchRequest";

export class SearchKeyword extends BaseModel {
  static tableName = "search_keywords";

  id: number;
  value: string;
  suggest: boolean;
  searchRequests: SearchRequest[];

  static relationMappings = {
    searchRequests: {
      relation: Model.HasManyRelation,
      modelClass: SearchRequest,
      join: {
        from: "search_keywords.id",
        to: "search_requests.search_keyword_id",
      },
    },
  };
}
