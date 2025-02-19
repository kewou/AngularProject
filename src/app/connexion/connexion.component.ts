import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserService } from '../user/service/user.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from '../utils/httpService';
import { jwtDecode } from "jwt-decode";

@Component({
    selector: 'app-connexion',
    templateUrl: './connexion.component.html',
    styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit{


    loginObj: any = {username:"", password:""};

    private backendUrl = environment.backendUrl;

    href: string = ""
    errorMessage: string | null = null;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient,private router: Router,private userService: UserService,private cookieService: CookieService,
        readonly httpService:HttpService
    ) {

    }

   getUserAuthority(tokenJwt:string): string{
      const decodedToken:any = jwtDecode(tokenJwt);
      if (decodedToken.roles.length > 0) {
        return decodedToken.roles[0].authority; // Retourne le premier rôle
      }
      return "";
   }

    redirectToRoleBasedPage(userAuthority:string): void {

       if (userAuthority === 'ADMIN') {
         this.router.navigate(['/bailleur/logements']);
       } else if (userAuthority === 'BAILLEUR') {
         this.router.navigate(['/bailleur/logements']);
       } else if (userAuthority === 'LOCATAIRE') {
         this.router.navigate(['/locataire/logement/appart']);
       } else {
         console.error('Rôle utilisateur inconnu');
         this.router.navigate(['/unauthorized']); // Redirection en cas de rôle non identifié
       }
    }

    loginSubmit() {
        this.errorMessage = null;
        if (this.loginObj.username==='' || this.loginObj.password==='') {
            this.errorMessage = "Veuillez remplir tous les champs requis.";
            return;
        }
        const url = `${this.backendUrl}/authenticate`;
        const token = this.cookieService.get('jwtToken');
        const userReference = this.cookieService.get('userReference');
        if(token){
            this.cookieService.delete('jwtToken');

        }
        if(userReference){
            this.cookieService.delete('jwtToken');
            }
        this.userService.loginUser(this.loginObj).subscribe(
            (response:any) => {
                console.log("response",response);
                this.cookieService.set('jwtToken', response.jwtToken, undefined, undefined, undefined, true, 'Lax');
                const userReference = this.userService.getCurrentUserReference(response.jwtToken)
                this.cookieService.set('userReference', userReference, undefined, undefined, undefined, true, 'Lax');

                this.redirectToRoleBasedPage(this.getUserAuthority(response.jwtToken));
                //this.router.navigate(['logements']);

            },
            (error:HttpErrorResponse) => {
                this.errorMessage = this.httpService.getErrorMessage(error.status);
            }
        );
    }

    ngOnInit(){
        this.href = this.router.url
        if (this.href.includes('#')) {
            let queryParams = this.href.split("#")
            let infos = queryParams[1].split("/")
            let accountParams={"reference": infos[0], "verificationToken": infos[1]}
            this.http.post(`${this.backendUrl}/users/verify-account`, accountParams, this.httpOptions).subscribe(
                (response: any) => {
                    this.cookieService.set('jwtToken', response.jwtToken, undefined, undefined, undefined, true, 'Lax');
                    this.router.navigate(['connexion']);
                },
                error => {
                    console.log("Error occured", error);

                }
            )
        }
    }

}
