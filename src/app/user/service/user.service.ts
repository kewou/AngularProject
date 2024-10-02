import { Injectable } from '@angular/core';
import { Observable, of,throwError } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { jwtDecode } from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../modele/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backendUrl = environment.backendUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private estConnecte = false;
  private userReference = this.cookieService.get('userReference');

  constructor(private http: HttpClient,
              private cookieService: CookieService,private router: Router) {

  }


  getUsers(): Observable<any>{
    const url = `${this.backendUrl}/users`;
    return this.http.get(url);
  }

  loginUser(obj: any) : Observable<any> {
    const url = `${this.backendUrl}/authenticate`;
    return this.http.post(url,obj);
  }

  logout(): void {
    this.cookieService.delete('jwtToken');
    this.cookieService.delete('userReference');
    console.log('Token deleted and user logged out.');
    this.router.navigate(['']);
  }

  estUtilisateurConnecte(): boolean {
        const token = this.cookieService.get('jwtToken');
        if (!token) {
          return false;
        }
        if(this.isTokenExpired(token)){
            this.cookieService.delete('jwtToken');
            this.cookieService.delete('userReference');
            return false;
        }
        return true;

  }


  getCurrentUserReference(tokenJwt:string){
      try{
        const token = this.cookieService.get('jwtToken');
        if (!token) {
            throw new Error('Token is missing');
        }
        const decodedToken:any = jwtDecode(token);
        const referenceUser = decodedToken.reference
        if (!referenceUser) {
            throw new Error('Reference user information is missing in the token');
        }
        return referenceUser;
    }catch (error) {
           this.handleForbidden("Access forbidden");
        return throwError(() => new Error((error as Error).message || 'Invalid token'));
    }
  }





  getUserInfo(): Observable<any>{
      return this.http.get(`${this.backendUrl}/users/${this.cookieService.get('userReference')}`).pipe(
        catchError((error) => {
          console.error('Error fetching user info:')
          return throwError('Failed to fetch user info');
        })
      );
  }

  updateUser(updatedUser:User) : Observable<any>{
            return this.http.put(`${this.backendUrl}/users/${this.userReference}`,updatedUser,this.httpOptions).pipe(
              catchError((error) => {
                console.error('Error fetching update user:')
                return throwError('Failed to update user ');
              })
            );

      }


  private handleForbidden(message: string): void {
    console.error(message);
    this.router.navigate(['']);
  }

  private isTokenExpired(token: string): boolean {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp === undefined) return false;

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date.valueOf() < new Date().valueOf();
      } catch (err) {
        return false;
      }
    }



}
