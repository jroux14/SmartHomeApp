import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'confirmation-snackbar',
  templateUrl: './confirmationsnackbar.component.html',
  styleUrls: ['./confirmationsnackbar.component.css']
})
export class ConfirmationSnackbarComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<ConfirmationSnackbarComponent>
  ) {}

  performAction(action: any): void {
    this.bottomSheetRef.dismiss(action.value);
  }
}
