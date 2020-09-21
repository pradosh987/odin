import { BaseModel } from "./BaseModel";
import { Model } from "objection";
import { Theme } from "./Theme";

export class ThemeVisit extends BaseModel {
  static tableName = "theme_visits";

  id: number;
  themeId: number;
  theme: Theme;

  static relationMappings = {
    themes: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + "/Theme",
      join: { from: "theme_visits.theme_id", to: "themes.id" },
    },
  };
}
