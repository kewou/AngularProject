import { Injectable } from '@angular/core';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor,HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor{

  constructor(private cookieService: CookieService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const localToken = localStorage.getItem("jwtToken");
    const localToken = this.cookieService.get('jwtToken');
    request = request.clone({headers: request.headers.set('Authorization','Bearer ' + localToken)});
    return next.handle(request);
  }

}
