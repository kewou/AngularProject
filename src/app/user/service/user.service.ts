import { Injectable } from '@angular/core';
import { User } from '../modele/user';
import { Observable, of } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { jwtDecode } from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backendUrl = environment.backendUrl;
  private estConnecte = false;
  constructor(private http: HttpClient,private cookieService: CookieService) { }

  getUsers(): Observable<any>{
    const url = `${this.backendUrl}/users`;
    return this.http.get(url);
  }

  loginUser(obj: any) : Observable<any> {
    const url = `${this.backendUrl}/authenticate`;
    return this.http.post(url,obj);
  }

  estUtilisateurConnecte(): boolean {
    return this.estConnecte;
  }

  connectOrDisconnect(){
    this.estConnecte=this.estConnecte ? false : true;
  }


  getUserInfo(): Observable<any>{
    const token = this.cookieService.get('jwtToken');
    const decodedToken:any = jwtDecode(token);
    console.log('Decoded Token:', decodedToken);
    const referenceUser = decodedToken.reference    
    return this.http.get(`${this.backendUrl}/users/${referenceUser}`);
  }



}
