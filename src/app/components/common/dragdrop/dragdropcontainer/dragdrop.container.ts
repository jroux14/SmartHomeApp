import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType
} from "angular-gridster2";
import { CommonComponent } from '../../common/common.component';
import { shDevice } from 'src/app/interfaces/device.interface';
import { TYPE_SENSOR } from 'src/app/constants/constants.smarthome';
import { DevicePagePopup } from '../../popup/devicepage-popup/devicepage.popup';
import { isEqual } from 'lodash'
import {shPanel} from "../../../../interfaces/panel.interface";
import {AddPanelPopup} from "../../popup/addpanel-popup/addpanel.popup";

@Component({
  selector: 'dragdrop-container',
  templateUrl: './dragdrop.container.html',
  styleUrls: ['./dragdrop.container.css'],
})
export class DragDropContainerComponent extends CommonComponent{
  @ViewChild("wrapper") elementRef!: ElementRef;
  private resizeObserver: ResizeObserver | undefined;
  options: GridsterConfig = {};
  newPanel: shPanel | undefined;
  startingSize: any = {
    minCols: 0,
    emptyCellDragMaxCols: 0,
    emptyCellDragMaxRows: 0
  }

  initSize(width: number) {
    let newColNum = Math.floor((width - 20) / 125);

    this.startingSize.minCols = newColNum;
    this.startingSize.maxCols = newColNum;
  }

  override ngOnInit() {
    super.ngOnInit();

    this.initSize(window.innerWidth);

    this.options = {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.None,
      setGridSize: false,
      margin: 10,
      outerMarginLeft: 20,
      swap: true,
      pushItems: false,
      enableEmptyCellDrop: true,
      enableOccupiedCellDrop: true,
      rowHeightRatio: 1,
      maxCols: this.startingSize.maxCols,
      minCols: this.startingSize.minCols,
      minRows: this.startingSize.minRows,
      maxRows: this.startingSize.maxRows,
      emptyCellDragMaxCols: this.startingSize.emptyCellDragMaxCols,
      emptyCellDragMaxRows: this.startingSize.emptyCellDragMaxRows,
      itemChangeCallback: (item: GridsterItem) => this.onItemChange(item),
      emptyCellClickCallback: this.emptyCellClick.bind(this),
      draggable: {
        enabled: true,
        dragHandleClass: 'drag-handler',
        ignoreContent: true
      },
      emptyCellDragCallback: this.emptyCellClick.bind(this),
      emptyCellDropCallback: this.emptyCellClick.bind(this)
    };

    this.addSubscription(this.dataService.newPanelEmitter.subscribe(resp => {
      this.popupService.closePopup();
      this.newPanel = resp;
      this.options.enableEmptyCellClick = true;
      this.options.displayGrid = DisplayGrid.Always;
      this.changedOptions();
    }));
  }

  override ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width } = entry.contentRect;

        if (this.options && this.options.api) {
          // Each grid will be 125px*125px and adjusted for 30px margins on sides
          let newColNum = Math.floor((width - 60) / 125);

          this.options.minCols = newColNum;
          this.options.maxCols = newColNum;

          this.changedOptions();
          this.options.api.resize!();
        }
      }
    });

    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  onItemChange(item: GridsterItem): void {
    this.authService.getDashboardPanels().forEach(panel => {
      if (isEqual(panel.item, item)) {
        // TODO: Port this over to auth service and create Spring Boot endpoint
        // this.deviceService.updateDevicePosition(panel).subscribe();
      }
    })
  }

  changedOptions(): void {
    if(this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  emptyCellClick(event: MouseEvent, item: GridsterItem): void {
    new Promise((resolve) => {
      setTimeout(() => {
        if(this.newPanel) {
          item.cols = this.options.maxCols? this.options.maxCols : 1;
          item.rows = 2;

          this.newPanel.item = item;
          resolve("done");
        }
      }, 100);
    }).finally(() => {
      this.placeNewPanel();
    });
  }

  placeNewPanel() {
    if(this.newPanel) {
      this.authService.registerNewPanel(this.newPanel).subscribe(resp => {
        console.log(resp);
        if (resp.success && this.newPanel) {
          this.newPanel.panelId = resp.id;
          this.authService.addPanel(this.newPanel);
          this.options.enableEmptyCellClick = false;
          this.options.displayGrid = DisplayGrid.None;
          this.changedOptions();
        } else {
          if (resp.error) {
            let ref = this.openSnackBar(resp.error, "Try Again");
            this.popupService.resolvePopupSnackBar(ref, AddPanelPopup, { panelClass: 'baseDialog', disableClose: false });
          }
        }
      })
    } else {
      let ref = this.openSnackBar("Failed to add panel", "Try again");
      this.popupService.resolvePopupSnackBar(ref, AddPanelPopup, { panelClass: 'baseDialog', disableClose: false});
    }
  }

  trackByPanelId(index: number, panel: shPanel): string | undefined {
    return panel.panelId;
  }
}
