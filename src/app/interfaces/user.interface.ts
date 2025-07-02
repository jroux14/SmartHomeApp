import {shRoom} from "./room.interface";
import {shDashboard} from "./dashboard.interface";

export class shUser {
    userId: string = '';
    firstName: string = '';
    email: string = '';
    phoneNum: string = '';
    rooms: shRoom[] = [];
    dashboard: shDashboard = new shDashboard('', []);

    constructor(userId?: string, firstName?: string, email?: string, phoneNum?: string, rooms?: shRoom[], dashboard?: shDashboard) {
        if (userId) {
            this.userId = userId;
        }
        if (firstName) {
            this.firstName = firstName;
        }
        if (email) {
            this.email = email;
        }
        if (phoneNum) {
            this.phoneNum = phoneNum;
        }
        if (rooms) {
          this.rooms = rooms;
        }
        if (dashboard) {
          this.dashboard = dashboard;
        }
    }
}
