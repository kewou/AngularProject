import { Component, OnInit } from '@angular/core';
import { User } from '../user/modele/user';
import { UserService } from '../user/service/user.service';

@Component({
  selector: 'app-compte-user',
  templateUrl: './compte-user.component.html',
  styleUrls: ['./compte-user.component.scss']
})
export class CompteUserComponent implements OnInit{

  user: User = { name: "", lastName: "", email: "", phone: "", password: ""  };

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo():void{
    this.userService.getUserInfo().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error("Erreur fetching user info");
      }
    );
  }

}
