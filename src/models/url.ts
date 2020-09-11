import { BaseModel } from "./base_model";
import { Model } from "objection";
import { Website } from "./website";
import path from "path";

export class Url extends BaseModel {
  static tableName = "urls";

  id: number;
  path: string;
  website_id: number;
  website: Website;

  static relationMappings = {
    website: {
      relation: Model.BelongsToOneRelation,
      modelClass: Website,
      join: {
        from: "urls.website_id",
        to: "websites.id",
      },
    },
  };

  completeUrl() {
    return path.join(this.website.url, this.path);
  }
}
