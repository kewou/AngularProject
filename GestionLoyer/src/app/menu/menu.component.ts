import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { UserService } from '../user/service/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent  implements OnInit{

  registrationModalOpen = false;
  isUserConnected: boolean = false;

  constructor(public userService: UserService,
              private cookieService: CookieService,
              private router: Router,
              private dialog: MatDialog,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {

  }


  /*
  openRegistrationModal() {
    this.registrationModalOpen = true;
  }
  closeModal() {
    this.registrationModalOpen = false;
  }*/

  openLogoutDialog(event: Event): void {
    event.preventDefault();
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.cookieService.delete('jwtToken');
        this.userService.connectOrDisconnect();
        this.router.navigate(['']);
      }
    });
  }
}
