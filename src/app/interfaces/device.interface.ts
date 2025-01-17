import { GridsterItem } from "angular-gridster2";

export class shDevice {
    userId!: string;
    deviceType!: any;
    deviceName!: string;
    deviceID!: string;
    displayWidth!: number;
    displayHeight!: number;
    posX!: number;
    posY!: number;
    item!: GridsterItem;
    mqttData!: string;

    constructor(userId: string, deviceType: string, deviceName: string, deviceID: string, displayWidth: number, displayHeight: number, posX: number, posY: number) {
        this.userId = userId;
        this.deviceType = deviceType;
        this.deviceName = deviceName;
        this.deviceID = deviceID;
        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;
        this.posX = posX;
        this.posY = posY;
    }
}