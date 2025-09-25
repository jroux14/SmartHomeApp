import {GridsterItem} from "angular-gridster2";

export class shPanel {

  panelId: string;
  panelType: string;
  panelFilterCriteria: string | undefined;
  data: data | undefined;

  constructor(panelId: string, panelType: string, panelFilterCriteria?: string, data?: any) {
    this.panelId = panelId;
    this.panelType = panelType;
    if (panelFilterCriteria) {
      this.panelFilterCriteria = panelFilterCriteria;
    }
    if (this.data) {
      this.data = data;
    }
  }
}

interface data {
  item: GridsterItem | undefined;
  filterValue: any;
}
