import { Component, OnInit } from '@angular/core';
import { User } from '../user/modele/user';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  user: User;

  constructor() {
    this.user = { name: '', lastName: '', email: '', phone: '', password: ''  };
  }

  ngOnInit(): void {
  }

  submitForm() {

  }

}
