import {Component} from "@angular/core";
import {CommonComponent} from "../../common/common.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {shDevice} from "../../../../interfaces/device.interface";
import {
  DEVICE_ROOM_FILTER_DISPLAY, DEVICE_ROOM_FILTER_VALUE, DEVICE_TYPE_FILTER_DISPLAY, DEVICE_TYPE_FILTER_VALUE,
  DISPLAY_DEVICE_PANEL, DISPLAY_STATISTICS_PANEL,
  VALUE_DEVICE_PANEL, VALUE_STATISTICS_PANEL
} from "../../../../constants/constants.smarthome";

@Component({
  selector: 'addpanel-popup',
  templateUrl: 'addpanel.popup.html',
  styleUrls: ['addpanel.popup.css'],
})
export class AddPanelPopup extends CommonComponent {

  filterOptions: any[] = [
    { display: DEVICE_ROOM_FILTER_DISPLAY, value: DEVICE_ROOM_FILTER_VALUE },
    { display: DEVICE_TYPE_FILTER_DISPLAY, value: DEVICE_TYPE_FILTER_VALUE }
  ]

  panelTypes: any = [
    { display: DISPLAY_DEVICE_PANEL, value: VALUE_DEVICE_PANEL },
    { display: DISPLAY_STATISTICS_PANEL, value: VALUE_STATISTICS_PANEL },
  ];
  panelType: string = '';
  panelTypeControl: FormControl<string | null> = new FormControl(null);

  filterCriteriaControl: FormControl = new FormControl();

  selectPanelType(): void {
    if (this.panelTypeControl.value) {
      this.panelType = this.panelTypeControl.value[0];
    }
  }

  createPanel() {
    if (this.panelType == this.panelTypes[0].value) {
      console.log(this.panelType);

      let filterCriteria = this.filterCriteriaControl.value;
      let panelData = {panelType: this.panelType, panelFilterCriteria: filterCriteria};
      this.dataService.newPanelEmitter.emit(panelData);
    }


  }
}
