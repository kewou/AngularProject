import { Component, OnInit } from '@angular/core';
import { User } from './modele/user';
import { UserService } from './service/user.service'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  users: User[] = [];

  selectedUser?: User;

  constructor(private userService: UserService) { }

  getUsers() : void{
    this.userService.getUsers()
      .subscribe(users => this.users = users);

  }

  ngOnInit(): void {
    this.getUsers();
  }

  onSelect(user: User): void {
    this.selectedUser = user;
  }



}
