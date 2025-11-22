import {Component} from "@angular/core";
import {CommonComponent} from "../../common/common.component";
import {FormControl} from "@angular/forms";
import {
  DEVICE_ROOM_FILTER_VALUE,
  DISPLAY_DEVICE_PANEL, DISPLAY_STATISTICS_PANEL,
  VALUE_DEVICE_PANEL, VALUE_STATISTICS_PANEL
} from "../../../../constants/constants.smarthome";

@Component({
  selector: 'addpanel-popup',
  templateUrl: 'addpanel.popup.html',
  styleUrls: ['addpanel.popup.css'],
})
export class AddPanelPopup extends CommonComponent {
  panelTypes: any = [
    { display: DISPLAY_DEVICE_PANEL, value: VALUE_DEVICE_PANEL },
    { display: DISPLAY_STATISTICS_PANEL, value: VALUE_STATISTICS_PANEL },
  ];
  panelType: string = '';
  panelTypeControl: FormControl<string | null> = new FormControl(null);

  createPanel() {
    if (this.panelTypeControl.value) {
      this.panelType = this.panelTypeControl.value[0];

      let panelData = {panelType: this.panelType, panelFilterCriteria: DEVICE_ROOM_FILTER_VALUE};
      this.dataService.newPanelEmitter.emit(panelData);
    }
  }
}
