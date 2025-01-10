import { Injectable } from '@angular/core';
import { Observable, of,throwError } from 'rxjs';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../user/modele/user';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

    private readonly backendUrl = environment.backendUrl;
    private readonly httpOptions = {
                        headers: new HttpHeaders({
                            'Content-Type': 'application/json'
                        })
                     };

    constructor(readonly  http: HttpClient){}

    get(endpoint: string, params?: HttpParams): Observable<any> {
        return this.http.get(`${this.backendUrl}/${endpoint}`, { params });
    }

    post(endpoint: string, body: any): Observable<any> {
      return this.http.post(`${this.backendUrl}/${endpoint}`, body, this.httpOptions);
    }


    put(endpoint: string, body: any): Observable<any> {
      return this.http.put(`${this.backendUrl}/${endpoint}`, body, this.httpOptions);
    }

    delete(endpoint: string, params?: HttpParams): Observable<any> {
     return this.http.delete(`${this.backendUrl}/${endpoint}`, { params });
    }

}