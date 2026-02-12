import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {LoaderService} from './loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(private loaderService: LoaderService) {
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        this.loaderService.show();

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            }),
            finalize(() => {
                this.loaderService.hide();
            })
        );
    }
}

