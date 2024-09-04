import { Injectable } from '@angular/core';
import { Observable, of ,throwError} from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../user/service/user.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Logement } from '../modele/logement';


@Injectable({
  providedIn: 'root'
})
export class LogementService {

  private backendUrl = environment.backendUrl;
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

  constructor(private http: HttpClient,private cookieService: CookieService,
              private router: Router, private userService: UserService) { }

  getLogements(): Observable<any>{
      const userReference = this.getUserReference();
      const url = `${this.backendUrl}/bailleur/users/${userReference}/logements`;
    return this.http.get(url).pipe(
        catchError((error) => {
          console.error('Error fetching user logements:')
          return throwError('Failed to fetch user logements');
        })
    );
  }

    getOneLogement(logementRef:string): Observable<any>{
        const userReference = this.getUserReference();
        const url = `${this.backendUrl}/bailleur/users/${userReference}/logements/${logementRef}`;
      return this.http.get(url).pipe(
          catchError((error) => {
            console.error('Error fetching user logement:')
            return throwError('Failed to fetch user logement');
          })
      );
    }

   addLogement(logement: Logement): Observable<any> {
       const userReference = this.getUserReference();
       const url = `${this.backendUrl}/bailleur/users/${userReference}/logements/create`;

       return this.http.post(url,logement,this.httpOptions).pipe(
                   catchError((error) => {
                     console.error('Error adding logement:', error);
                     return throwError('Failed to add logement');
                   })
               );

   }


    updateLogement(updatedLogement: Logement): Observable<any>  {
       const userReference = this.getUserReference();
       const url = `${this.backendUrl}/bailleur/users/${userReference}/logements/${updatedLogement.reference}`;

       return this.http.put(url,updatedLogement,this.httpOptions).pipe(
                   catchError((error) => {
                     console.error('Error adding logement:', error);
                     return throwError('Failed to add logement');
                   })
               );
    }

    deleteLogement(refLogement:string) : Observable<any> {
       const userReference = this.getUserReference();
       const url = `${this.backendUrl}/bailleur/users/${userReference}/logements/${refLogement}`;

       return this.http.delete<void>(url).pipe(
                   catchError((error) => {
                     console.error('Error deleteting logement:', error);
                     return throwError('Failed to delete logement');
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