import { Injectable } from '@angular/core';
import { Observable, of,throwError } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../modele/user';
import { HttpService } from '../../utils/httpService'
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private estConnecte = false;
  private userReference = this.cookieService.get('userReference');

  constructor(readonly httpService:HttpService,
              private readonly cookieService: CookieService,private readonly router: Router) {

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

  searchLocataires(name: string): Observable<User[]>{
    let endpointUrl = `users/${this.cookieService.get('userReference')}/search`;
    const params = new HttpParams().set('name', name);
    return this.httpService.get<User[]>(endpointUrl,params);
  }


      reinitPassword(email: string) : Observable<any>{
        let endpointUrl = `users/reset-password`;
        return this.httpService.post(endpointUrl,email)
                .pipe(
                    catchError((error) => {
                      console.error('Error fetching reinit password:')
                      return throwError('Failed to reinit password ');
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

  public saveUserAuthenticationInfo(tokenJwt:string){
    this.cookieService.set('jwtToken', tokenJwt, undefined, undefined, undefined, true, 'Lax');
    const userReference = this.getCurrentUserReference(tokenJwt);
    this.cookieService.set('userReference', userReference, undefined, undefined, undefined, true, 'Lax');
  }


  public redirectToRoleBasedPage(tokenJwt:string): void {
      let userAuthority = '';
      try {
        const decodedToken: any = jwtDecode(tokenJwt);

        if (decodedToken.roles && Array.isArray(decodedToken.roles) && decodedToken.roles.length > 0) {
          userAuthority = decodedToken.roles[0].authority;
        }

        // Redirection selon le rôle
        switch (userAuthority) {
          case 'ADMIN':
          case 'BAILLEUR':
            this.router.navigate(['/bailleur/logements']);
            break;
          case 'LOCATAIRE':
            this.router.navigate(['/locataire/logements/appart']);
            break;
          default:
            console.error('Rôle utilisateur inconnu :', userAuthority);
            this.router.navigate(['/unauthorized']);
            break;
        }

      } catch (error) {
        console.error('Erreur lors du décodage du token JWT', error);
        this.router.navigate(['/unauthorized']);
      }
  }

}
