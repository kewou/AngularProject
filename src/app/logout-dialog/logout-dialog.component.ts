import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../user/service/user.service';


@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss']
})
export class LogoutDialogComponent {

  constructor(public dialogRef: MatDialogRef<LogoutDialogComponent>,private userService: UserService) {}



  onConfirm(): void {
    this.dialogRef.close('confirm');
    this.userService.logout();
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }

}
