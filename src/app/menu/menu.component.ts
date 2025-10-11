import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
  Renderer2,
} from "@angular/core";
import { UserService } from "../user/service/user.service";
import { CookieService } from "ngx-cookie-service";
import { Router, NavigationEnd } from "@angular/router";
import { LogoutDialogComponent } from "../logout-dialog/logout-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements AfterViewInit {
  registrationModalOpen = false;
  isUserConnected: boolean = false;

  @ViewChild("navbarResponsive") navbarResponsive!: ElementRef;

  constructor(
    public userService: UserService,
    private cookieService: CookieService,
    private router: Router,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    // Écouter les changements de route et fermer le menu après navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        console.log("Navigation détectée", event);
        this.fermerMenu();
      });
  }

  fermerMenu() {
    if (this.navbarResponsive) {
      const navbarElement = this.navbarResponsive.nativeElement;

      // Retirer la classe 'show' immédiatement si elle est présente
      setTimeout(() => {
        if (navbarElement.classList.contains("show")) {
          this.renderer.removeClass(navbarElement, "show");
        }
      }, 100);
    }
  }

  openLogoutDialog(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: "400px",
      disableClose: false,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        console.log("Déconnexion confirmée");
        // Le service UserService gère déjà la déconnexion et la navigation
      } else {
        console.log("Déconnexion annulée");
      }
    });
  }
}
