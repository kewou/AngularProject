import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  registrationModalOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  openRegistrationModal() {
    this.registrationModalOpen = true;
  }
  closeModal() {
    this.registrationModalOpen = false;
  }
}
