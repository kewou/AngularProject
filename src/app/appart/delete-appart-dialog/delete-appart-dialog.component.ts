import { Component,Input,Output,EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Appart } from '../modele/appart';

@Component({
  selector: 'app-delete-appart-dialog',
  templateUrl: './delete-appart-dialog.component.html',
  styleUrls: ['./delete-appart-dialog.component.scss']
})
export class DeleteAppartDialogComponent {

        constructor(public dialogRef: MatDialogRef<DeleteAppartDialogComponent>) {}

          onConfirm(): void {
            this.dialogRef.close(true);
          }

          onCancel(): void {
            this.dialogRef.close(false);
          }

}
