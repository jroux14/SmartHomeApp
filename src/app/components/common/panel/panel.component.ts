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
  showScrollButtons: boolean = false;
  scrollAmount = 300; // pixels per click

  isEditMode: boolean = false;

  filterList: any[] | undefined;
  selectedFilterControl: FormControl<any | null> = new FormControl<any | null>(null);

  override ngOnInit() {
    super.ngOnInit();

    if (this.panel) {
      if (this.panel.panelFilterCriteria == DEVICE_ROOM_FILTER_VALUE) {
        this.filterList = this.authService.getRooms();
        this.selectedFilterControl.setValue(this.filterList[0]);
      }
    }

    this.addSubscription(this.dataService.editModeEmitter.subscribe(resp => {
      this.isEditMode = resp;
    }));
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this.checkForOverflow();
    const resizeObserver = new ResizeObserver(() => {
      this.checkForOverflow();
    });
    resizeObserver.observe(this.scrollContainer.nativeElement);
  }

  onFilterChange(event: MatSelectChange) {
    console.log("test")
    // check for overflow
    setTimeout(() => this.checkForOverflow(), 0);
  }

  checkForOverflow() {
    const el = this.scrollContainer.nativeElement;
    this.showScrollButtons = el.scrollWidth > el.clientWidth;
  }

  scrollLeft() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollLeft -= this.scrollAmount;
    }
  }

  scrollRight() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollLeft += this.scrollAmount;
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
