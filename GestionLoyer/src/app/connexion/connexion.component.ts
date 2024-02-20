import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserService } from '../user/service/user.service';
import { CookieService } from 'ngx-cookie-service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {


  loginObj: any = {username:"", password:""};

  private backendUrl = environment.backendUrl;
  errorMessage: string | null = null;

  constructor(private http: HttpClient,private router: Router,private userService: UserService,private cookieService: CookieService,
    ) {

  }

  loginSubmit() {
    this.errorMessage = null;
    if (this.loginObj.username==='' || this.loginObj.password==='') {
      this.errorMessage = "Veuillez remplir tous les champs requis.";
      return;
    }
    const url = `${this.backendUrl}/authenticate`;
    this.userService.loginUser(this.loginObj).subscribe(
      (response:any) => {
        console.log("response",response);
        this.cookieService.set('jwtToken', response.jwtToken, undefined, undefined, undefined, true, 'Lax');
        this.userService.connectOrDisconnect();
        this.router.navigate(['/compte-user']);
      },
      (error:HttpErrorResponse) => {
          if(error.status === 401){
            this.errorMessage="Login ou mot de passe incorrect !";
          }
      }
    );
 }


 logoutSubmit(){
  this.userService.connectOrDisconnect();
 }

}
