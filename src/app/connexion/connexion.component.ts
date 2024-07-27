import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserService } from '../user/service/user.service';
import { CookieService } from 'ngx-cookie-service';

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
                const userReference = this.userService.getCurrentUserReference(response.jwtToken)
                this.cookieService.set('userReference', userReference, undefined, undefined, undefined, true, 'Lax');
                window.location.href = '/beezyApi/logements';
            },
            (error:HttpErrorResponse) => {
                if(error.status === 401){
                    this.errorMessage="Login ou mot de passe incorrect !";
                }
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
                    window.location.href = '/beezyApi/compte-user';
                },
                error => {
                    console.log("Error occured", error);

                }
            )
        }
    }

}
