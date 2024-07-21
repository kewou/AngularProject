import { Component,Input,Output,EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Logement } from '../modele/logement';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-add-logement-dialog',
  templateUrl: './add-logement-dialog.component.html',
  styleUrls: ['./add-logement-dialog.component.scss']
})
export class AddLogementDialogComponent {
    logementForm: FormGroup;
        @Input() logement: Logement= {
                                       reference: '',
                                       quartier: '',
                                       ville: '',
                                       description: ''
                                     };
        @Output() logementAdded = new EventEmitter<Logement>();


    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddLogementDialogComponent>) {
                this.logementForm = this.fb.group({
                  reference: [this.logement.reference],
                  quartier: [this.logement.quartier, [Validators.required, Validators.minLength(2), Validators.maxLength(30),CustomValidators.noSpecialCharacters()]],
                  ville: [this.logement.ville, [Validators.required, Validators.minLength(2), Validators.maxLength(25),CustomValidators.noSpecialCharacters()]],
                  description: [this.logement.description, [Validators.required, Validators.minLength(10),CustomValidators.noSpecialCharacters()]]
                });
        }


      onConfirm(): void {
        if(this.logementForm.valid){
            this.logementAdded.emit(this.logementForm.value);
            this.dialogRef.close('confirm');
            }
      }

      onCancel(): void {
        this.dialogRef.close('cancel');
      }

}
