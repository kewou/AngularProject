import { Injectable } from '@angular/core';
import { Observable, of ,throwError} from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../user/service/user.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Appart } from '../modele/appart';

@Injectable({
  providedIn: 'root'
})
export class AppartService {

  private backendUrl = environment.backendUrl;
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

  constructor(private http: HttpClient,private cookieService: CookieService,
              private router: Router, private userService: UserService) {}

  getAppartmentsByLogementRef(logementRef: string): Observable<Appart[]> {
            const userReference = this.getUserReference();
            const url = `${this.backendUrl}/bailleur/users/${userReference}/logements/${logementRef}/apparts`;
    return this.http.get<Appart[]>(url).
                pipe(
                       catchError((error) => {
                         console.error('Error fetching user apparts:')
                         return throwError('Failed to fetch user apparts');
                       })
                   );
    }

   addAppart(logementRef: string,appart: Appart): Observable<any> {
       const userReference = this.getUserReference();
       const url = `${this.backendUrl}/bailleur/users/${userReference}/logements/${logementRef}/apparts/create`;

       return this.http.post(url,appart,this.httpOptions).pipe(
                   catchError((error) => {
                     console.error('Error adding appart:', error);
                     return throwError('Failed to add appart');
                   })
               );

   }

   updateAppart(logementRef: string,updatedAppart: Appart): Observable<any>  {
      const userReference = this.getUserReference();
      const url = `${this.backendUrl}/bailleur/users/${userReference}/logements/${logementRef}/apparts/${updatedAppart.reference}`;

      return this.http.put(url,updatedAppart,this.httpOptions).pipe(
                  catchError((error) => {
                    console.error('Error adding appart:', error);
                    return throwError('Failed to add appart');
                  })
              );
   }

   deleteAppart(logementRef: string,appartReference:string) : Observable<any> {
      const userReference = this.getUserReference();
      const url = `${this.backendUrl}/bailleur/users/${userReference}/logements/${logementRef}/apparts/${appartReference}`;

      return this.http.delete<void>(url).pipe(
                  catchError((error) => {
                    console.error('Error deleteting appart:', error);
                    return throwError('Failed to delete appart');
                  })
              );
   }

     getAppartmentByLogementRefAndAppartRef(logementRef: string,appartRef: string): Observable<Appart> {
               const userReference = this.getUserReference();
               const url = `${this.backendUrl}/bailleur/users/${userReference}/logements/${logementRef}/apparts/${appartRef}`;
       return this.http.get<Appart>(url).
                   pipe(
                          catchError((error) => {
                            console.error('Error fetching user one appart:')
                            return throwError('Failed to fetch one appart');
                          })
                      );
       }

   private getUserReference(){
      const userReference = this.userService.getCurrentUserReference('userReference');
      if (!userReference) {
        return throwError('User reference is not available');
      }
       return userReference;
   }


}