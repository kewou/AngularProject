import { Injectable } from '@angular/core';
import { Observable, of ,throwError} from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../user/service/user.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Transaction } from '../modele/transaction';
import { HttpService } from '../../utils/httpService'

@Injectable({
  providedIn: 'root'
})
export class LoyerService {

    constructor(readonly httpService:HttpService,private cookieService: CookieService,
              private router: Router, private userService: UserService) { }

    newTransaction(appartRef:string,transaction:Transaction): Observable<any> {
               const userReference = this.getUserReference();
               const url = `bailleur/users/${userReference}/apparts/${appartRef}/nouvelle-transaction`;
                   return this.httpService.post(url,transaction).pipe(
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