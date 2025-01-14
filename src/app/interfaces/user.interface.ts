export class shUser {
    userId: string = '';
    firstName: string = '';
    email: string = '';
    phoneNum: string = '';

    constructor(userId?: string, firstName?: string, email?: string, phoneNum?: string) {
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
    }
}