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
                this.userService.saveUserAuthenticationInfo(response.jwtToken);
                this.userService.redirectToRoleBasedPage(response.jwtToken);
            },
            (error:HttpErrorResponse) => {
                this.errorMessage = this.httpService.getErrorMessage(error.status);
            }
        );
    }

    ngOnInit() {
        this.href = this.router.url
        if (this.href.includes('#')) {
            let queryParams = this.href.split("#")
            let infos = queryParams[1].split("/")
            let accountParams={"reference": infos[0], "verificationToken": infos[1]}
            this.httpService.post(`users/verify-account`, accountParams).subscribe(
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

    loginWithGoogle() {
      const redirectUri = encodeURIComponent('https://beezyweb.net/login/success');
      window.location.href = `https://api.beezyweb.net/beezyApi/oauth2/authorize/google?redirect_uri=${redirectUri}`;
    }

}
