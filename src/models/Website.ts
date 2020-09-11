import { BaseModel } from "./BaseModel";

export class Website extends BaseModel {
  static get tableName() {
    return "websites";
  }
}

export interface IWebsite {
  id: number;
  name: string;
  url: string;
  active: boolean;
}
