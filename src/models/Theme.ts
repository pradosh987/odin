import { BaseModel } from "./BaseModel";
import { Model } from "objection";
import { Url } from "./Url";
import { Image } from "./Image";
import { ThemeVisit } from "./ThemeVisit";

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
  themeVisits: ThemeVisit[];

  static relationMappings = {
    url: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + "/Url",
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
    theme_visits: {
      relation: Model.HasManyRelation,
      modelClass: __dirname + "/ThemeVisit",
      join: { from: "themes.id", to: "theme_visits.id" },
    },
  };
}
