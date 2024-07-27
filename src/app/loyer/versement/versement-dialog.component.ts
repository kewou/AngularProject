import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Transaction } from '../modele/transaction';


@Component({
  selector: 'app-versement-dialog',
  templateUrl: './versement-dialog.component.html',
  styleUrls: ['./versement-dialog.component.scss']
})
export class VersementDialogComponent {

        constructor(public dialogRef: MatDialogRef<VersementDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: { amount: number }
             ) {}

          onConfirm(): void {
            this.dialogRef.close(true);
          }

          onCancel(): void {
            this.dialogRef.close(false);
          }

}
