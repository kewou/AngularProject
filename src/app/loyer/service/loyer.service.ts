import { Injectable } from '@angular/core';
import { Observable, of ,throwError} from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../user/service/user.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Transaction } from '../modele/transaction';


@Injectable({
  providedIn: 'root'
})
export class LoyerService {

      private backendUrl = environment.backendUrl;
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };

    constructor(private http: HttpClient,private cookieService: CookieService,
              private router: Router, private userService: UserService) { }

    newTransaction(appartRef:string,transaction:Transaction): Observable<any> {
               const userReference = this.getUserReference();
               const url = `${this.backendUrl}/bailleur/users/${userReference}/apparts/${appartRef}/nouvelle-transaction`;
                   return this.http.post(url,transaction,this.httpOptions).pipe(
                       catchError((error) => {
                         console.error('Error fetching user logements:')
                         return throwError('Failed to fetch user logements');
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