import { BaseModel } from "./base_model";
import { Model } from "objection";
import { Website } from "./website";
import path from "path";
import { Theme } from "./theme";

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
    theme: {
      relation: Model.HasOneRelation,
      modelClass: Theme,
      join: {
        from: "urls.id",
        to: "themes.url_id",
      },
    },
  };

  completeUrl() {
    return path.join(this.website.url, this.path);
  }
}
