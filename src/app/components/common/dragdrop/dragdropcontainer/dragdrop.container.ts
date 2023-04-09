import {Component, HostListener, OnInit} from '@angular/core';
import {
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType,
} from "angular-gridster2";
import { CommonComponent } from '../../common/common.component';
import { shDevice } from 'src/app/interfaces/device.interface';
import { TYPE_SENSOR } from 'src/app/constants/constants.smarthome';

@Component({
  selector: 'dragdrop-container',
  templateUrl: './dragdrop.container.html',
  styleUrls: ['./dragdrop.container.css'],
})
export class DragDropContainerComponent extends CommonComponent{
  options: GridsterConfig = {};
  dashboard: GridsterItem[] = [];
  devices: shDevice[] = [];
  newDevice: shDevice | undefined;
  devicePlaced: boolean = false;
  startingSize: any = {
    minCols: 0,
    maxCols: 0,
    emptyCellDragMaxCols: 0,
    emptyCellDragMaxRows: 0
  }

  initSize(width: number) {
    this.startingSize.minCols = (width - 800) / 250;
    this.startingSize.maxCols = (width - 800) / 250;
    if (this.startingSize.minCols < 5) {
      this.startingSize.minCols = (width - 500) / 250;
      this.startingSize.maxCols = (width - 500) / 250;
      this.startingSize.emptyCellDragMaxCols = (width - 500) / 250;
      this.startingSize.emptyCellDragMaxRows = (width - 500) / 250;
    }
  }

  initDash() {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].item.x > this.startingSize.maxCols) {
        this.devices[i].item.x = this.startingSize.maxCols - 1;
      }
      this.dashboard.push(this.devices[i].item);
    }
  }
  
  override ngOnInit() {
    super.ngOnInit();
    this.initSize(window.innerWidth);
    this.options = {
      gridType: GridType.Fixed,
      displayGrid: DisplayGrid.None,
      setGridSize: true,
      fixedColWidth: 250,
      fixedRowHeight: 250,
      margin:30,
      outerMarginLeft: 250,
      outerMarginTop: 50,
      swap: true,
      pushItems: false,
      enableEmptyCellDrop: true,
      enableOccupiedCellDrop: true,
      rowHeightRatio: 1,
      maxCols: this.startingSize.maxCols,
      minCols: this.startingSize.minCols,
      emptyCellDragMaxCols: this.startingSize.emptyCellDragMaxCols,
      emptyCellDragMaxRows: this.startingSize.emptyCellDragMaxRows,
      emptyCellClickCallback: this.emptyCellClick.bind(this),
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      },
      emptyCellDragCallback: this.emptyCellClick.bind(this),
      emptyCellDropCallback: this.emptyCellClick.bind(this)
    };

    this.initDash();

    this.addSubscription(this.dataService.addDeviceEmitter.subscribe(resp => {
      this.addItem();
    }));

    this.addSubscription(this.dataService.forwardNewDeviceEmitter.subscribe(resp => {
      this.newDevice = resp;
      this.options.enableEmptyCellClick = true;
      this.options.displayGrid = DisplayGrid.Always;
      this.changedOptions();
    }));
    // this.addSubscription(this.dataService.newDevicePopupClosedEmitter.subscribe(resp => {
    //   console.log('ready');
    //   this.placeNewDevice();
    // }));
  }

  @HostListener('window:resize', ['$event'])
  sizeChange(event: any) {
    if (event.target.innerWidth && event.target.innerHeight && this.options.api && this.options.api.optionsChanged && this.options.fixedColWidth) {
      this.options.minCols = (event.target.innerWidth - 800) / this.options.fixedColWidth;
      this.options.maxCols = (event.target.innerWidth - 800) / this.options.fixedColWidth;
      if (this.options.minCols < 5) {
        this.options.minCols = (event.target.innerWidth - 500) / this.options.fixedColWidth;
        this.options.maxCols = (event.target.innerWidth - 500) / this.options.fixedColWidth;
        this.options.emptyCellDragMaxCols = (event.target.innerWidth - 500) / this.options.fixedColWidth;
        this.options.emptyCellDragMaxRows = (event.target.innerWidth - 500) / this.options.fixedColWidth;
      }
      if (this.dashboard) {
        for (let i = 0; i < this.dashboard.length; i++) {
          if (this.dashboard[i].x > this.options.maxCols) {
            this.dashboard[i].x = this.options.maxCols - 1;
          }
        }
      }
      this.changedOptions();
      this.options.api.resize!();
    }
  }

  changedOptions(): void {
    if(this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  emptyCellClick(event: MouseEvent, item: GridsterItem): void {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if(this.newDevice) {
          if(this.newDevice.deviceType.name == TYPE_SENSOR) {
            item.cols = 2;
            item.rows = 2;
          }
          this.newDevice.item = item;
          resolve("done");
        }
      }, 100);
    }).finally(() => {
      this.placeNewDevice();
    });
  }

  removeItem($event: MouseEvent | TouchEvent, item: GridsterItem): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void {
    this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
  }

  dragStartHandler(ev: DragEvent): void {
    if (ev.dataTransfer) {
      ev.dataTransfer.setData('text/plain', 'Drag Me Button');
      ev.dataTransfer.dropEffect = 'copy';
    }
  }

  placeNewDevice() {
    if(this.newDevice) {
      this.devices.push(this.newDevice);
      this.dashboard.push(this.newDevice.item);
      this.options.enableEmptyCellClick = false;
      this.options.displayGrid = DisplayGrid.None;
      this.changedOptions();
    }
  }
}
