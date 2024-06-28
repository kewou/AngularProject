import { Injectable } from '@angular/core';
import { Observable, of,throwError } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { jwtDecode } from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backendUrl = environment.backendUrl;
  private estConnecte = false;
  constructor(private http: HttpClient,private cookieService: CookieService,private router: Router) { }

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
    console.log('Token deleted and user logged out.');
    window.location.href = '';
  }

  estUtilisateurConnecte(): boolean {
        const token = this.cookieService.get('jwtToken');
        if (!token) {
          return false;
        }
        return !this.isTokenExpired(token);
  }




  getUserInfo(): Observable<any>{
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
      return this.http.get(`${this.backendUrl}/users/${referenceUser}`).pipe(
        catchError((error) => {
          console.error('Error fetching user info:', error);
          return throwError('Failed to fetch user info');
        })
      );
    } catch (error) {      
      this.handleForbidden("Access forbidden");
      return throwError(() => new Error((error as Error).message || 'Invalid token'));
    }

  }

  private handleForbidden(message: string): void {
    console.error(message);   
    alert(message);    
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
