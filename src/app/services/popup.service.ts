import { ComponentType } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";


@Injectable()
export class PopupService {
    constructor(public PopupController: MatDialog) {}

    closePopup() {
        this.PopupController.closeAll();
    }

    openPopup(popupType: ComponentType<unknown>, popupConfig: MatDialogConfig<any>) {
        this.PopupController.open(popupType, popupConfig);
    }
}