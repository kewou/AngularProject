import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BailService } from '../service/bail.service';
import { UserService } from 'src/app/user/service/user.service';
import { debounceTime, distinctUntilChanged, switchMap, of, Observable } from 'rxjs';
import { User } from 'src/app/user/modele/user';


@Component({
  selector: 'app-add-bail-dialog',
  templateUrl: './add-bail-dialog.component.html',
  styleUrls: ['./add-bail-dialog.component.scss']
})
export class AddBailDialogComponent {
  form: FormGroup;
  filteredLocataires!: Observable<User[]>;

  constructor(
    private fb: FormBuilder,
    private bailService: BailService,
    private userService: UserService,
    private dialogRef: MatDialogRef<AddBailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appartRef: string }
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      dateEntree: ['', Validators.required],
      dateSortiePrevue: ['']
    });
  }

  ngOnInit(): void {
    // écoute sur le champ locataireRef
    this.filteredLocataires = this.form.get('name')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value =>
        typeof value === 'string' && value.length > 1
          ? this.userService.searchLocataires(value)
          : of([])
      )
    );
  }

  displayFn(user: User): string {
    return user ? `${user.name} ${user.lastName}` : '';
  }

  save(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload = {
      locataireRef: formValue.name.reference,
      dateEntree: formValue.dateEntree,
      dateSortiePrevue: formValue.dateSortiePrevue
    };

    this.bailService.assignLocataire(this.data.appartRef, payload).subscribe({
      next: (bail) => this.dialogRef.close(bail),
      error: (err) => console.error('Erreur assignation bail', err)
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
