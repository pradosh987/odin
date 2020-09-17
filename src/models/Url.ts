import { BaseModel } from "./BaseModel";
import { Model } from "objection";
import { Website } from "./Website";
import path from "path";

export class Url extends BaseModel {
  static tableName = "urls";

  id: number;
  path: string;
  websiteId: number;
  website: Website;
  lastIndexedAt: string;
  statusCode: number;

  static relationMappings = {
    website: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + "/Website",
      join: {
        from: "urls.website_id",
        to: "websites.id",
      },
    },
    theme: {
      relation: Model.HasOneRelation,
      modelClass: __dirname + "/Theme",
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
