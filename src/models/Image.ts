import { BaseModel } from "./base_model";
import { Theme } from "./theme";
import { Model } from "objection";

export class Image extends BaseModel {
  static tableName = "images";
  id: number;
  remoteUrl: string;
  uuid: string;
  themeId: number;
  theme: Theme;
  local: boolean;
  valid: boolean;

  static relationMappings = {
    theme: {
      relation: Model.BelongsToOneRelation,
      modelClass: Theme,
      join: {
        from: "images.theme_id",
        to: "themes.id",
      },
    },
  };
}
