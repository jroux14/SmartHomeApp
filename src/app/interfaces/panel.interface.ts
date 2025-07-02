import {GridsterItem} from "angular-gridster2";

export class shPanel {

  panelId: string;
  panelType: string;
  panelFilterCriteria: string | undefined;
  item: GridsterItem | undefined;


  constructor(panelId: string, panelType: string, panelFilterCriteria?: string | undefined, item?: GridsterItem | undefined) {
    this.panelId = panelId;
    this.panelType = panelType;
    this.panelFilterCriteria = panelFilterCriteria;
    this.item = item
  }
}
