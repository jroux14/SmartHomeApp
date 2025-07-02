import {shPanel} from "./panel.interface";

export class shDashboard {
  dashboardId: string;
  panels: shPanel[];

  constructor(dashboardId: string, panels: shPanel[]) {
    this.dashboardId = dashboardId;
    this.panels = panels;
  }
}
