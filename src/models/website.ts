import { BaseModel } from "./base_model";
import { Model } from "objection";
import { Url } from "./url";

export class Website extends BaseModel {
  static tableName = "websites";

  id: number;
  name: string;
  url: string;
  active: boolean;
  homepageId: number;

  static relationMappings = {
    urls: {
      relation: Model.HasOneRelation,
      modelClass: Url,
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
