import { Component, OnInit,AfterViewInit, ViewChild, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { UserService } from '../user/service/user.service';



@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

    isLoggedIn: boolean = false;

  constructor(private router: Router, private renderer: Renderer2,private userService:UserService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.userService.estUtilisateurConnecte();
  }

loadScript(src: string) {
  const script = this.renderer.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.onload = () => {

  };
  this.renderer.appendChild(document.body, script);
}


}
