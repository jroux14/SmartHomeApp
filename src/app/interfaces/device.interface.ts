import { GridsterItem } from "angular-gridster2";

export class shDevice {
    deviceType!: string;
    deviceName!: string;
    deviceID!: string;
    displayWidth!: number;
    displayHeight!: number;
    posX!: number;
    posY!: number;
    item!: GridsterItem;

    constructor(deviceType: string, deviceName: string, deviceID: string, displayWidth: number, displayHeight: number, posX: number, posY: number) {
        this.deviceType = deviceType;
        this.deviceName = deviceName;
        this.deviceID = deviceID;
        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;
        this.posX = posX;
        this.posY = posY;
        this.updateItem();
    }

    deviceUpdated(update: any) {
        this.displayWidth = update.cols;
        this.displayHeight = update.rows;
        this.posX = update.x;
        this.posY = update.y;
        this.updateItem();
    }

    updateItem() {
        this.item = {
            cols: this.displayWidth, 
            rows: this.displayHeight, 
            x: this.posX, 
            y: this.posY
        };
    }
}