import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType,
} from "angular-gridster2";
import { CommonComponent } from '../../common/common.component';
import { shDevice } from 'src/app/interfaces/device.interface';
import { TYPE_SENSOR } from 'src/app/constants/constants.smarthome';
import { NewDevicePopupComponent } from '../../popup/newdevice-popup/newdevice-popup.component';
import { DeviceService } from 'src/app/services/device.service';
import { isEqual } from 'lodash'

@Component({
  selector: 'dragdrop-container',
  templateUrl: './dragdrop.container.html',
  styleUrls: ['./dragdrop.container.css'],
})
export class DragDropContainerComponent extends CommonComponent{
  @ViewChild("wrapper") elementRef!: ElementRef;
  private resizeObserver: ResizeObserver | undefined;
  options: GridsterConfig = {};
  devices: shDevice[] = [];
  newDevice: shDevice | undefined;
  devicePlaced: boolean = false;
  startingSize: any = {
    minCols: 0,
    emptyCellDragMaxCols: 0,
    emptyCellDragMaxRows: 0
  }
  movedDevice: shDevice | undefined;

  static eventStart(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
    event: MouseEvent
  ): void {
    const thisContainer = DragDropContainerComponent.injector.get(DragDropContainerComponent);

    thisContainer.devices.forEach((device) => {
      if (isEqual(device.item, itemComponent.$item)) {
        thisContainer.movedDevice = device;
      }
    });
  }

  static eventStop(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
    event: MouseEvent
  ): void {
    const thisContainer = DragDropContainerComponent.injector.get(DragDropContainerComponent);
    const deviceService = DragDropContainerComponent.injector.get(DeviceService);
   
    if (thisContainer.movedDevice) {
      /* 
        this works but doesn't capture other device positions
        if they get pushed while dragging, we should update the
        entire grid instead. Have they been
        updated at this point? 
      */
      deviceService.updateDeviceGridItem(thisContainer.movedDevice.deviceID, itemComponent.$item).subscribe();
    }
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
      emptyCellClickCallback: this.emptyCellClick.bind(this),
      draggable: {
        enabled: true,
        dragHandleClass: 'drag-handler',
        ignoreContent: true,
        start: DragDropContainerComponent.eventStart,
        stop: DragDropContainerComponent.eventStop
      },
      emptyCellDragCallback: this.emptyCellClick.bind(this),
      emptyCellDropCallback: this.emptyCellClick.bind(this)
    };


    this.addSubscription(this.deviceService.addDeviceEmitter.subscribe(resp => {
      this.popupService.closePopup();
      this.newDevice = resp;
      this.options.enableEmptyCellClick = true;
      this.options.displayGrid = DisplayGrid.Always;
      this.changedOptions();
    }));
    this.addSubscription(this.deviceService.deleteDeviceEmitter.subscribe(resp => {
      this.devices.splice(this.devices.indexOf(resp.device), 1);
    }));
    this.addSubscription(this.deviceService.userDeviceEmitter.subscribe(resp => {
      this.devices.push(resp);
    }));

  }

  override ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        
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

  changedOptions(): void {
    if(this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  emptyCellClick(event: MouseEvent, item: GridsterItem): void {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if(this.newDevice) {
          if(this.newDevice.deviceType == TYPE_SENSOR) {
            item.cols = 5;
            item.rows = 3;
          } else {
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

  placeNewDevice() {
    if(this.newDevice) {
      this.deviceService.registerDevice(this.newDevice).subscribe(resp => {
        if (resp.success && this.newDevice) {
          this.devices.push(this.newDevice);
          this.options.enableEmptyCellClick = false;
          this.options.displayGrid = DisplayGrid.None;
          this.changedOptions();
        } else {
          if (resp.error) {
            let ref = this.openSnackBar(resp.error, "Try Again");
            this.popupService.resolvePopupSnackBar(ref, NewDevicePopupComponent, { panelClass: 'baseDialog', disableClose: false });
          }
        }
      })
    } else {
      let ref = this.openSnackBar("Failed to register device", "Try again");
      this.popupService.resolvePopupSnackBar(ref, NewDevicePopupComponent, { panelClass: 'baseDialog', disableClose: false});
    }
  }
}
