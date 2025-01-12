import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild("wrapper") elementRef!: ElementRef;
  private resizeObserver: ResizeObserver | undefined;
  options: GridsterConfig = {};
  dashboard: GridsterItem[] = [];
  devices: shDevice[] = [];
  newDevice: shDevice | undefined;
  devicePlaced: boolean = false;
  startingSize: any = {
    minCols: 0,
    emptyCellDragMaxCols: 0,
    emptyCellDragMaxRows: 0
  }

  initSize(width: number, height: number) {
    let newColNum = Math.floor((width - 20) / 125);
    // let newRowNum = Math.floor((height - 20) / 125);
    this.startingSize.minCols = newColNum;
    this.startingSize.maxCols = newColNum;
    // this.startingSize.minRows = newRowNum;
    // this.startingSize.maxRows = newRowNum;
    // this.startingSize.minCols = (width - 800) / 250;
    // this.startingSize.maxCols = (width - 800) / 250;
    // if (this.startingSize.minCols < 5) {
    //   this.startingSize.minCols = (width - 500) / 250;
    //   this.startingSize.maxCols = (width - 500) / 250;
    //   this.startingSize.emptyCellDragMaxCols = (width - 500) / 250;
    //   this.startingSize.emptyCellDragMaxRows = (width - 500) / 250;
    // }
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
    this.initSize(window.innerWidth, window.innerHeight);
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
        ignoreContent: true
      },
      emptyCellDragCallback: this.emptyCellClick.bind(this),
      emptyCellDropCallback: this.emptyCellClick.bind(this)
    };

    this.initDash();

    this.addSubscription(this.dataService.forwardNewDeviceEmitter.subscribe(resp => {
      this.newDevice = resp;
      this.options.enableEmptyCellClick = true;
      this.options.displayGrid = DisplayGrid.Always;
      this.changedOptions();
    }));
    this.addSubscription(this.dataService.deleteDeviceEmitter.subscribe(resp => {
      // this.removeItem(resp.event, resp.device.item, resp.device);
      this.dashboard.splice(this.dashboard.indexOf(resp.device.item), 1);
      this.devices.splice(this.devices.indexOf(resp.device), 1);
    }));
  }

  override ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        
        if (this.options && this.options.api) {
          console.log('Component size changed:', width, height);

          // Each grid will be 125px*125px and adjusted for 30px margin on each side
          let newColNum = Math.floor((width - 60) / 125);
          // let newRowNum = Math.floor((height - 60) / 125);
          this.options.minCols = newColNum;
          this.options.maxCols = newColNum;
          // this.options.minRows = newRowNum;
          // this.options.maxRows = newRowNum;
  
          // if (this.dashboard) {
          //   for (let i = 0; i < this.dashboard.length; i++) {
          //     console.log(this.dashboard[i].x + " | " + newColNum);
          //     if ((this.dashboard[i].x + this.dashboard[i].cols)  > newColNum) {
          //       console.log("x pos: " + this.dashboard[i].x + " | cols: " + this.dashboard[i].cols);
          //       console.log("New: " + newColNum);
          //       // How many columns past our boundary did we go?
          //       let columnAdjust = (this.dashboard[i].x + this.dashboard[i].cols) - newColNum;
          //       this.dashboard[i].x = newColNum - columnAdjust;
          //     }
          //   }
          // }
          this.changedOptions();
          this.options.api.resize!();
        }
      }
    });

    this.resizeObserver.observe(this.elementRef.nativeElement);   
  }

  // @HostListener('window:resize', ['$event'])
  // sizeChange(event: any) {
  //   console.log(event);
  //   if (event.target.innerWidth && event.target.innerHeight && this.options.api && this.options.api.optionsChanged && this.options.fixedColWidth) {
  //     this.options.minCols = (event.target.innerWidth - 60) / 250;
  //     this.options.maxCols = (event.target.innerWidth - 60) / 250;
  //     this.options.minRows = (event.target.innerHeight - 60) / 250;
  //     this.options.maxRows = (event.target.innerHeight - 60) / 250;
  //   //   if (this.options.minCols < 5) {
  //   //     this.options.minCols = (event.target.innerWidth - 500) / this.options.fixedColWidth;
  //   //     this.options.maxCols = (event.target.innerWidth - 500) / this.options.fixedColWidth;
  //   //     this.options.emptyCellDragMaxCols = (event.target.innerWidth - 500) / this.options.fixedColWidth;
  //   //     this.options.emptyCellDragMaxRows = (event.target.innerWidth - 500) / this.options.fixedColWidth;
  //   //   }
  //     if (this.dashboard) {
  //       for (let i = 0; i < this.dashboard.length; i++) {
  //         if (this.dashboard[i].x > this.options.maxCols) {
  //           this.dashboard[i].x = this.options.maxCols - 1;
  //         }
  //       }
  //     }
  //     this.changedOptions();
  //     this.options.api.resize!();
  //   }
  // }

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

  // removeItem($event: MouseEvent | TouchEvent, item: GridsterItem, device: shDevice): void {
  //   $event.preventDefault();
  //   $event.stopPropagation();
  //   this.dashboard.splice(this.dashboard.indexOf(item), 1);
  //   this.devices.splice(this.devices.indexOf(device), 1);
  // }

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
