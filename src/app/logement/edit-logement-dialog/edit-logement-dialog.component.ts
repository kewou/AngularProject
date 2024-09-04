import { Component,Inject,Input,Output,EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logement } from '../modele/logement';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-edit-logement-dialog',
  templateUrl: './edit-logement-dialog.component.html',
  styleUrls: ['./edit-logement-dialog.component.scss']
})
export class EditLogementDialogComponent {
    logementForm: FormGroup;

    @Output() logementUpdated = new EventEmitter<Logement>();

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditLogementDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: { logement: Logement }) {

        this.logementForm = this.fb.group({
          reference: [data.logement.reference],
          quartier: [data.logement.quartier, [Validators.required, Validators.minLength(2), Validators.maxLength(30),CustomValidators.noSpecialCharacters()]],
          ville: [data.logement.ville, [Validators.required, Validators.minLength(2), Validators.maxLength(25),CustomValidators.noSpecialCharacters()]],
          description: [data.logement.description, [Validators.required, Validators.minLength(5),Validators.maxLength(25),CustomValidators.noSpecialCharacters()]]
        });

    }

      onConfirm(): void {
        if(this.logementForm.valid){
                  const updatedLogement: Logement = {
                    ...this.data.logement,
                    ...this.logementForm.value
                  };
            this.logementUpdated.emit(updatedLogement);
            this.dialogRef.close('confirm');
            }
      }

      onCancel(): void {
        this.dialogRef.close();
      }
}
