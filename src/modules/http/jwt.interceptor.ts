import { Injectable } from '@angular/core';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor,HttpResponse,HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../app/user/service/user.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class JwtInterceptor implements HttpInterceptor{

  constructor(private cookieService: CookieService,private userService:UserService,private router: Router,) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const localToken = localStorage.getItem("jwtToken");
    const localToken = this.cookieService.get('jwtToken');
    request = request.clone({headers: request.headers.set('Authorization','Bearer ' + localToken)});
    return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if(error.status === 401) {
                alert("fuck")
                this.userService.logout();
                this.router.navigate(['login'])
            }
            else if(error.status === 403){
                alert("toto")
                this.router.navigate(['forbidden'])
            }
            return throwError(error);

        })
    )
  }

}
