import { Injectable } from '@angular/core';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor,} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Récupérer le JWT depuis le stockage local, le sessionStorage ou un cookie
    const jwt = localStorage.getItem('jwt'); // Modifiez en fonction de votre méthode de stockage

    // Si le JWT est présent, l'ajouter à l'en-tête de la requête
    if (jwt) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    }

    return next.handle(request);
  }
}
