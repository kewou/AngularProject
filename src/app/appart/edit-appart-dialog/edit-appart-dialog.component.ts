import { Component,Inject,Input,Output,EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appart } from '../modele/appart';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-edit-appart-dialog',
  templateUrl: './edit-appart-dialog.component.html',
  styleUrls: ['./edit-appart-dialog.component.scss']
})
export class EditAppartDialogComponent {
        appartForm: FormGroup;
    
        @Output() appartUpdated = new EventEmitter<Appart>();
        
            constructor(
                private fb: FormBuilder,
                public dialogRef: MatDialogRef<EditAppartDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: { appart: Appart }) {

                      this.appartForm = this.fb.group({
                        reference: [data.appart.reference],
                        nom: [data.appart.nom, [Validators.required, Validators.minLength(2), Validators.maxLength(30),CustomValidators.noSpecialCharacters()]],
                        prixLoyer: [data.appart.prixLoyer, [Validators.required,Validators.min(1),CustomValidators.noSpecialCharacters()]],
                        prixCaution: [data.appart.prixCaution, [Validators.required,Validators.min(1) ,CustomValidators.noSpecialCharacters()]]
                      });

        
            }
        
              onConfirm(): void {
                if(this.appartForm.valid){
                          const updatedAppart: Appart = {
                            ...this.data.appart,
                            ...this.appartForm.value
                          };
                    this.appartUpdated.emit(updatedAppart);
                    this.dialogRef.close('confirm');
                    }
              }
        
              onCancel(): void {
                this.dialogRef.close();
              }

}
