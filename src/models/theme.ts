import { BaseModel } from "./base_model";
import { Model } from "objection";
import { Url } from "./url";

export class Theme extends BaseModel {
  static tableName = "themes";

  name: string;
  metaTitle: string | undefined;
  metaDescription: string | undefined;
  wallpapers: number | undefined;
  icons: number | undefined;
  size: string | undefined;
  featuredImageUrl: string | undefined;
  imageUrls: string[];
  url_id: number;
  url: Url;

  static relationMappings = {
    url: {
      relation: Model.BelongsToOneRelation,
      modelClass: Url,
      join: {
        from: "themes.url_id",
        to: "urls.id",
      },
    },
  };
}
