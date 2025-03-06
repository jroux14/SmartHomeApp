import { GridsterItem } from "angular-gridster2";

export class shDevice {
    id?: string;

    userId: string;
    deviceType: any;
    deviceName: string;
    deviceNameFriendly: string;
    item: GridsterItem | undefined;
    data: any | undefined;

    constructor(userId: string, deviceType: string, deviceName: string, deviceNameFriendly: string, item?: GridsterItem | undefined, data?: any | undefined) {
        this.userId = userId;
        this.deviceType = deviceType;
        this.deviceName = deviceName;
        this.deviceNameFriendly = deviceNameFriendly;
        this.item = item
        this.data = data;
    }
}
