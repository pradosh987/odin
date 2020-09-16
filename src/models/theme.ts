import { BaseModel } from "./base_model";
import { Model } from "objection";
import { Url } from "./url";
import { Image } from "./Image";

export class Theme extends BaseModel {
  static tableName = "themes";

  id: number;
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
  textContent: string;
  images: Image[];

  static relationMappings = {
    url: {
      relation: Model.BelongsToOneRelation,
      modelClass: Url,
      join: {
        from: "themes.url_id",
        to: "urls.id",
      },
    },
    images: {
      relation: Model.HasManyRelation,
      modelClass: __dirname + "/Image",
      join: {
        from: "themes.id",
        to: "images.theme_id",
      },
    },
  };
}
