import { Injectable } from '@angular/core';
import { Observable, of,throwError } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../modele/user';
import { HttpService } from '../../utils/httpService'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private estConnecte = false;
  private userReference = this.cookieService.get('userReference');

  constructor(readonly httpService:HttpService,
              private cookieService: CookieService,private router: Router) {

  }


  getUsers(): Observable<any>{
    return this.httpService.get("users");
  }

  loginUser(loginPassObject: any) : Observable<any> {
    return this.httpService.post("authenticate",loginPassObject);
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
      let endpointUrl = `users/${this.cookieService.get('userReference')}`;
      return this.httpService.get(endpointUrl)
                .pipe(
                      catchError((error) => {
                        console.error('Error fetching user info:')
                        return throwError('Failed to fetch user info');
                      })
                  );
  }

  updateUser(updatedUser:User) : Observable<any>{
      let endpointUrl = `users/${this.cookieService.get('userReference')}`;
      return this.httpService.put(endpointUrl,updatedUser)
              .pipe(
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
