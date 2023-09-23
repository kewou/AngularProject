import { Injectable } from '@angular/core';
import { User } from '../modele/user';
import { USERS } from '../modele/mockUser';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backendUrl = environment.backendUrl;
  constructor(private http: HttpClient) { }

  getUsers(): Observable<any>{
    const url = `${this.backendUrl}/users`;
    return this.http.get(url);
  }

  loginUser(obj: any) : Observable<any> {
    const url = `${this.backendUrl}/authenticate`;
    return this.http.post(url,obj);

  }

}
