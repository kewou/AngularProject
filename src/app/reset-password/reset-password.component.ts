import { Component } from '@angular/core';
import { HttpService } from '../utils/httpService'
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  email: string="";
  url: string = "users/reset-password";

  constructor(readonly httpService:HttpService, private router: Router) {

  }
  sentMailResetPasswordSubmit(): void{
    console.log("Envoi du mail avec changement de mot de passe", this.email)
    this.httpService.post(this.url, this.email).subscribe(
        response => {
          this.router.navigate(['/confirmation-sent-mail-reset-password']);
        },
        error => {
          this.router.navigate(['/password-reset']);
        }

    )
  }

}
