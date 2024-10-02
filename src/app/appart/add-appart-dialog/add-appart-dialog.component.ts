import { Component, Inject ,OnInit,Output,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../user/modele/user';
import { UserService } from '../../user/service/user.service';
import { Appart } from '../modele/appart';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-add-appart-dialog',
  templateUrl: './add-appart-dialog.component.html',
  styleUrls: ['./add-appart-dialog.component.scss']
})
export class AddAppartDialogComponent {
    appartForm: FormGroup;
    users: User[] = []; // Liste des utilisateurs
    @Output() appartAdded = new EventEmitter<Appart>();

    constructor(
        public dialogRef: MatDialogRef<AddAppartDialogComponent>,
        private fb: FormBuilder,
        private userService: UserService
      ) {
              this.appartForm = this.fb.group({
                reference: [''],
                nom: ['', [Validators.required,CustomValidators.noSpecialCharacters()]],
                prixLoyer: ['', [Validators.required,Validators.min(1),Validators.max(1000000),CustomValidators.noSpecialCharacters()]],
                prixCaution: ['', [Validators.required,Validators.min(1),Validators.max(1000000) ,CustomValidators.noSpecialCharacters()]]
              });
      }


   onConfirm(): void {
     if (this.appartForm.valid) {
               this.appartAdded.emit(this.appartForm.value);
               this.dialogRef.close('confirm');
     }
   }

   onCancel(): void {
     this.dialogRef.close('cancel');
   }


}
