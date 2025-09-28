import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./comfirmPayment-dialog.component.html",
  styleUrls: ["./comfirmPayment-dialog.component.scss"],
})
export class ConfirmPaymentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
