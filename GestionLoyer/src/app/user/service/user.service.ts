import { Injectable } from '@angular/core';
import { User } from '../modele/user';
import { USERS } from '../modele/mockUser';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUsers(): Observable<User[]>{
    const users = of(USERS);
    return users;
  }

}
