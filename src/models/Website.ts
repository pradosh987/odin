import { BaseModel } from "./BaseModel";
import { Model } from "objection";
import { Url } from "./Url";

export class Website extends BaseModel {
  static tableName = "websites";

  id: number;
  name: string;
  url: string;
  active: boolean;
  homepageId: number;
  lastIndexedAt: string;

  static relationMappings = {
    urls: {
      relation: Model.HasOneRelation,
      modelClass: __dirname + "/Url",
      join: {
        from: "websites.id",
        to: "urls.website_id",
      },
    },
  };

  homepage() {
    return Url.query().findById(this.homepageId).withGraphFetched("website");
  }
}
