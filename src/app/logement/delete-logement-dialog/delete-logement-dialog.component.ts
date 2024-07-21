import { Component,Input,Output,EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Logement } from '../modele/logement';


@Component({
  selector: 'app-delete-logement-dialog',
  templateUrl: './delete-logement-dialog.component.html',
  styleUrls: ['./delete-logement-dialog.component.scss']
})
export class DeleteLogementDialogComponent {


    constructor(public dialogRef: MatDialogRef<DeleteLogementDialogComponent>) {}

      onConfirm(): void {
        this.dialogRef.close(true);
      }

      onCancel(): void {
        this.dialogRef.close(false);
      }

}
