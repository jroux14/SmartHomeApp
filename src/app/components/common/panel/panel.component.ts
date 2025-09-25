import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import { CommonComponent } from '../common/common.component';
import {shPanel} from "../../../interfaces/panel.interface";
import {DEVICE_ROOM_FILTER_VALUE} from "../../../constants/constants.smarthome";
import {shRoom} from "../../../interfaces/room.interface";
import {shDevice} from "../../../interfaces/device.interface";
import {FormControl} from "@angular/forms";
import {ConfirmationSnackbarComponent} from "../confirmationsnackbar/confirmationsnackbar.component";
import {of, switchMap} from "rxjs";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'sh-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent extends CommonComponent{

  @Input()
  panel: shPanel | undefined;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  filterList: any[] | undefined;
  selectedFilterControl: FormControl<any | null> = new FormControl<any | null>(null);

  override ngOnInit() {
    super.ngOnInit();

    if (this.panel) {
      if (this.panel.panelFilterCriteria == DEVICE_ROOM_FILTER_VALUE) {
        this.filterList = this.authService.getRooms();
        if (this.panel.data && this.panel.data.filterValue) {
          this.selectedFilterControl.setValue(this.panel.data.filterValue);
        } else {
          this.selectedFilterControl.setValue(this.filterList[0]);
        }
      }
    }
  }

  onFilterChange(event: MatSelectChange) {
    if (this.panel && this.panel.data) {
      this.panel.data.filterValue = event.value;
      this.addSubscription(this.authService.updatePanelData(this.panel).subscribe());
    }
  }

  trackByDeviceId(index: number, device: shDevice): string | undefined {
    return device.id;
  }

  deletePanel() {
    if (this.panel) {
      this.addSubscription(this.bottomSheet.open(ConfirmationSnackbarComponent, {
        data: {
          message: `Are you sure you want to delete this panel?`,
          actions: [
            { label: 'Confirm', value: "confirm" },
            { label: 'Cancel', value: "cancel" },
          ]
        }
      }).afterDismissed()
        .pipe(
          switchMap((result) => {
            if (result == "confirm" && this.panel) {
              return this.authService.deletePanel(this.panel);
            } else {
              return of(null);
            }
          })
        ).subscribe());
    }
  }
}
