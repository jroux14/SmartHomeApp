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
  selectedFilterValue: string | null = null;
  selectedFilterControl: FormControl<any | null> = new FormControl<any | null>(null);

  override ngOnInit() {
    super.ngOnInit();

    if (this.panel) {
      this.selectedFilterType = this.panel.panelFilterCriteria;
      this.selectedFilterTypeControl.setValue(this.selectedFilterType);
      if (this.selectedFilterType == DEVICE_ROOM_FILTER_VALUE) {
        this.filterList = this.authService.getRooms();
        if (this.panel.data && this.panel.data.filterValue) {
          this.selectedFilterValue = this.panel.data.filterValue;
          this.selectedFilterControl.setValue(this.panel.data.filterValue);
        } else {
          this.selectedFilterValue = this.filterList[0];
          this.selectedFilterControl.setValue(this.filterList[0]);
        }
      }
    }
  }

  ngAfterViewChecked() {
    if (this.shouldAnimateTopBar) {
      this.animateTopBarHeight();
      this.shouldAnimateTopBar = false;
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
        if (this.selectedFilterType == DEVICE_ROOM_FILTER_VALUE){
          if (filter.roomId == this.selectedFilterValue) {
            return filter.roomName.toUpperCase();
          }
        }
      }
    }
    return "";
  }

  onFilterChange(event: MatSelectChange) {
    if (this.panel && this.panel.data) {
      console.log(event);
      console.log(this.filterList);
      this.selectedFilterValue = event.value;
      this.panel.data.filterValue = this.selectedFilterValue;
      this.addSubscription(this.authService.updatePanelData(this.panel).subscribe());
    }
  }

  onFilterTypeChange(event: MatRadioChange) {
    if (this.panel && this.panel.data) {
      console.log(event.value);
      this.panel.panelFilterCriteria = event.value;
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
