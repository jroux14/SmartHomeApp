import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import { CommonComponent } from '../common/common.component';
import {shPanel} from "../../../interfaces/panel.interface";
import {
  DEVICE_ROOM_FILTER_DISPLAY,
  DEVICE_ROOM_FILTER_VALUE,
  DEVICE_TYPE_FILTER_DISPLAY, DEVICE_TYPE_FILTER_VALUE
} from "../../../constants/constants.smarthome";
import {shDevice} from "../../../interfaces/device.interface";
import {FormControl} from "@angular/forms";
import {ConfirmationSnackbarComponent} from "../confirmationsnackbar/confirmationsnackbar.component";
import {of, switchMap} from "rxjs";
import {MatSelectChange} from "@angular/material/select";
import {MatRadioChange} from "@angular/material/radio";
import {animate, style, transition, trigger} from "@angular/animations";
import {shRoom} from "../../../interfaces/room.interface";

@Component({
  selector: 'sh-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  animations: [
    trigger('fadeSwap', [
      transition('edit <=> view', [
        style({ opacity: 0 }),
        animate('1000ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class PanelComponent extends CommonComponent{

  @Input()
  panel: shPanel | undefined;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('topBar') topBar!: ElementRef<HTMLDivElement>;
  @ViewChild('topBarContent') topBarContent!: ElementRef<HTMLDivElement>;

  isAnimating = false;
  shouldAnimateTopBar = false;

  filterTypeOptions: any[] = [
    { display: DEVICE_ROOM_FILTER_DISPLAY, value: DEVICE_ROOM_FILTER_VALUE },
    { display: DEVICE_TYPE_FILTER_DISPLAY, value: DEVICE_TYPE_FILTER_VALUE }
  ]
  selectedFilterType: string | undefined;
  selectedFilterTypeControl: FormControl<any | null> = new FormControl<any | null>(null);

  filterList: any[] | undefined;
  selectedFilterValue: string = "";
  selectedFilterControl: FormControl<any | null> = new FormControl<any | null>(null);

  override ngOnInit() {
    super.ngOnInit();

    if (this.panel) {
      this.selectedFilterType = this.panel.panelFilterCriteria;
      this.selectedFilterTypeControl.setValue(this.selectedFilterType);
    }
    this.updateFilterList();
  }

  ngAfterViewChecked() {
    if (this.shouldAnimateTopBar) {
      this.animateTopBarHeight();
      this.shouldAnimateTopBar = false;
    }
  }

  getPanelDevices(): shDevice[] {
    if (this.selectedFilterType == DEVICE_ROOM_FILTER_VALUE) {
      return this.deviceService.getDevicesByRoomId(this.selectedFilterValue);
    } else if (this.selectedFilterType == DEVICE_TYPE_FILTER_VALUE) {
      return this.deviceService.getDevicesByType(this.selectedFilterValue);
    } else {
      return [];
    }
  }

  createRoomList(roomList: shRoom[]): any[] {
    let rVal: any[] = [];
    for (let room of roomList) {
      rVal.push({"value": room.roomId, "display": room.roomName});
    }
    return rVal;
  }

  initFilterSelection() {
    let optionFound: boolean = false;
    if (this.panel && this.filterList){
      if (this.panel.data && this.panel.data.filterValue) {
        for (let option of this.filterList) {
          if (this.panel.data.filterValue == option.value) {
            this.selectedFilterValue = this.panel.data.filterValue;
            this.selectedFilterControl.setValue(this.panel.data.filterValue);
            optionFound = true;
          }
        }
        if (optionFound) {
          return;
        } else {
          this.selectedFilterValue = this.filterList[0].value;
          this.selectedFilterControl.setValue(this.filterList[0].value);
          setTimeout(() => {
            this.updateFilter(this.selectedFilterValue);
            this.dataService.checkForOverflowEmitter.emit();
          });
        }
      } else {
        this.selectedFilterValue = this.filterList[0].value;
        this.selectedFilterControl.setValue(this.filterList[0].value);
        setTimeout(() => {
          this.updateFilter(this.selectedFilterValue);
          this.dataService.checkForOverflowEmitter.emit();
        });
      }
    }
  }

  updateFilterList() {
    if (this.panel) {
      if (this.selectedFilterType == DEVICE_ROOM_FILTER_VALUE) {
        this.filterList = this.createRoomList(this.authService.getRooms());
        this.initFilterSelection();
      } else if (this.selectedFilterType == DEVICE_TYPE_FILTER_VALUE) {
        this.filterList = this.deviceService.getDeviceTypes();
        this.initFilterSelection();
      }
    }
  }

  animateTopBarHeight() {
    if (!this.topBar || !this.topBarContent || this.isAnimating) return;
    this.isAnimating = true;

    const container = this.topBar.nativeElement;

    // Freeze current height
    const oldHeight = container.offsetHeight;
    container.style.height = `${oldHeight}px`;
    container.style.overflow = 'hidden';
    container.style.transition = 'height 1000ms ease';

    // Let Angular render new content first
    this.cd.detectChanges();
    setTimeout(() => {
      const newHeight = this.topBarContent.nativeElement.offsetHeight;

      // Animate to new height
      container.style.height = `${newHeight}px`;

      // Clean up after animation
      container.addEventListener('transitionend', () => {
        container.style.height = 'auto';
        container.style.transition = '';
        container.style.overflow = '';
        this.isAnimating = false;
      }, { once: true });
    }, 0);
  }

  getFilterDisplay(): string {
    if (this.filterList) {
      for (let filter of this.filterList) {
        if (filter.value == this.selectedFilterValue) {
          return filter.display.toUpperCase();
        }
      }
    }
    return "";
  }

  updateFilter(filterVal: string) {
    if (this.panel && this.panel.data) {
      this.selectedFilterValue = filterVal;
      this.panel.data.filterValue = this.selectedFilterValue;
      this.addSubscription(this.authService.updatePanel(this.panel).subscribe());
    }
  }

  onFilterChange(event: MatSelectChange) {
    setTimeout(() => {
      this.updateFilter(event.value);
      this.dataService.checkForOverflowEmitter.emit();
    });
  }

  onFilterTypeChange(event: MatRadioChange) {
    if (this.panel && this.panel.data) {
      this.selectedFilterType = event.value;
      this.selectedFilterTypeControl.setValue(this.selectedFilterType);
      this.panel.panelFilterCriteria = this.selectedFilterType;
      this.updateFilterList();
      this.addSubscription(this.authService.updatePanel(this.panel).subscribe());
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

  protected readonly DEVICE_TYPE_FILTER_VALUE = DEVICE_TYPE_FILTER_VALUE;
  protected readonly DEVICE_ROOM_FILTER_VALUE = DEVICE_ROOM_FILTER_VALUE;
}
