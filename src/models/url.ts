import { BaseModel } from "./base_model";
import { Model } from "objection";
import { Website } from "./website";
import path from "path";
import { Theme } from "./theme";

export class Url extends BaseModel {
  static tableName = "urls";

  id: number;
  path: string;
  websiteId: number;
  website: Website;
  lastIndexedAt: string;

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

  async completeUrl() {
    if (!this.website) {
      this.website = await Website.query().findById(this.websiteId);
    }
    return path.join(this.website.url, this.path);
  }
}
