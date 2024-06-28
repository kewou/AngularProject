import { Component, OnInit,Renderer2 } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { UserService } from './user/service/user.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GestionLoyer';

    constructor(private router: Router, private renderer: Renderer2,private userService: UserService) {}

  ngOnInit() {
         (window as any).logout = this.onConfirm.bind(this);
          console.log("logout function set on window object");

    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe((event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
          this.onPageChange();
        }
      });
  }
    onConfirm(): void {
      this.userService.logout();
      console.log("onConfirm called");
    }

    onPageChange() {
      // Exemple d'exécution d'un script JavaScript personnalisé
      this.loadScript('assets/js/main.js');
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
