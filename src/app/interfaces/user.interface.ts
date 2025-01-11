export class shUser {
    userID: string = '';
    firstName: string = '';
    email: string = '';
    phoneNum: string = '';

    constructor(userID?: string, firstName?: string, email?: string, phoneNum?: string) {
        if (userID) {
            this.userID = userID;
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
    }
}