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
  errorMessage: string="";

  constructor(private http: HttpClient,private router: Router,private userService: UserService,private cookieService: CookieService,
    ) {

  }

  submitForm() {
    debugger
    const url = `${this.backendUrl}/authenticate`;
    this.userService.loginUser(this.loginObj).subscribe(
      (response:any) => {
        debugger
        console.log("response",response);
        //localStorage.setItem("jwtToken",response.jwtToken);
        this.cookieService.set('jwtToken', response.jwtToken, undefined, undefined, undefined, true, 'Lax');
        this.router.navigate(['/locataire']);
      },
      (error:HttpErrorResponse) => {
          if(error.status === 401){
            this.errorMessage="Login ou mot de passe incorrect !";
          }
      }
    );
 }

}
