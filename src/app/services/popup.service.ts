import { ComponentType } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBarRef } from "@angular/material/snack-bar";
import {take} from "rxjs";

@Injectable()
export class PopupService {
    constructor(public PopupController: MatDialog) {}

    closePopup() {
        this.PopupController.closeAll();
    }

    openPopup(popupType: ComponentType<unknown>, popupConfig: MatDialogConfig<any>) {
        this.PopupController.open(popupType, popupConfig);
    }

    resolvePopupSnackBar(ref: MatSnackBarRef<any>, popup: ComponentType<unknown>, popupConfig?: MatDialogConfig<any>) {
        this.closePopup();

        if (popupConfig) {
          ref.onAction().pipe(take(1)).subscribe(() => {
            this.openPopup(popup, popupConfig);
          });
        } else {
          ref.onAction().pipe(take(1)).subscribe(() => {
            this.openPopup(popup, {
              panelClass: 'baseDialog'
            });
          });
        }
    }
}
