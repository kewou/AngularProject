import { Injectable } from '@angular/core';
import { Observable, of ,throwError} from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../user/service/user.service';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Appart } from '../modele/appart';
import { HttpService } from '../../utils/httpService';

@Injectable({
  providedIn: 'root'
})
export class AppartService {


  constructor(readonly httpService:HttpService,private cookieService: CookieService,
              private router: Router, private userService: UserService) {}

  getAppartmentsByLogementRef(logementRef: string): Observable<Appart[]> {
            const userReference = this.getUserReference();
            const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts`;
    return this.httpService.get(url).
                pipe(
                       catchError((error) => {
                         console.error('Error fetching user apparts:')
                         return throwError('Failed to fetch user apparts');
                       })
                   );
    }

   addAppart(logementRef: string,appart: Appart): Observable<any> {
       const userReference = this.getUserReference();
       const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/create`;

       return this.httpService.post(url,appart).pipe(
                   catchError((error) => {
                     console.error('Error adding appart:', error);
                     return throwError('Failed to add appart');
                   })
               );

   }

   updateAppart(logementRef: string,updatedAppart: Appart): Observable<any>  {
      const userReference = this.getUserReference();
      const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/${updatedAppart.reference}`;

      return this.httpService.put(url,updatedAppart).pipe(
                  catchError((error) => {
                    console.error('Error adding appart:', error);
                    return throwError('Failed to add appart');
                  })
              );
   }

   deleteAppart(logementRef: string,appartReference:string) : Observable<any> {
      const userReference = this.getUserReference();
      const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/${appartReference}`;

      return this.httpService.delete(url).pipe(
                  catchError((error) => {
                    console.error('Error deleteting appart:', error);
                    return throwError('Failed to delete appart');
                  })
              );
   }

     getAppartmentByLogementRefAndAppartRef(logementRef: string,appartRef: string): Observable<Appart> {
               const userReference = this.getUserReference();
               const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/${appartRef}`;
       return this.httpService.get(url).
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