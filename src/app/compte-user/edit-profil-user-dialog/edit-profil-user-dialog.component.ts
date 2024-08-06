import { Component,Inject,Input,Output,EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../user/modele/user';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-edit-profil-user-dialog',
  templateUrl: './edit-profil-user-dialog.component.html',
  styleUrls: ['./edit-profil-user-dialog.component.scss']
})
export class EditProfilUserDialogComponent {
    userForm: FormGroup;

    @Output() userUpdated = new EventEmitter<User>();

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditProfilUserDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: { user: User }) {

              this.userForm = this.fb.group({
                name: [data.user.name, [Validators.required,Validators.minLength(2), Validators.maxLength(20),CustomValidators.noSpecialCharacters()]],
                lastName: [data.user.lastName, [Validators.required,Validators.minLength(2), Validators.maxLength(20),CustomValidators.noSpecialCharacters()]],
                email: [data.user.email, [Validators.required,Validators.minLength(2), Validators.email,CustomValidators.noSpecialCharacters()]],
                phone: [data.user.phone, [Validators.required,Validators.minLength(8), Validators.maxLength(20) ,CustomValidators.noSpecialCharacters()]]
              });

          }

    onConfirm(): void {

      if(this.userForm.valid){
          alert("test");
                const updatedUser: User = {
                  ...this.data.user,
                  ...this.userForm.value
                };
          this.userUpdated.emit(updatedUser);
          this.dialogRef.close('confirm');
          }
    }

    onCancel(): void {
      this.dialogRef.close();
    }


}
