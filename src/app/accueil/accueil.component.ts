import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { Router, NavigationEnd, Event as RouterEvent } from "@angular/router";
import { UserService } from "../user/service/user.service";
import { CookieService } from "ngx-cookie-service";
import { jwtDecode } from "jwt-decode";

@Component({
  selector: "app-accueil",
  templateUrl: "./accueil.component.html",
  styleUrls: ["./accueil.component.scss"],
})
export class AccueilComponent implements OnInit {
  isLoggedIn: boolean = false;
  isLocataire: boolean = false;
  isBailleur: boolean = false;
  isLoadingRole: boolean = true;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private userService: UserService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.userService.estUtilisateurConnecte();

    if (this.isLoggedIn) {
      this.loadUserRole();
    } else {
      this.isLoadingRole = false;
    }
  }

  loadUserRole(): void {
    this.isLoadingRole = true;
    const token = this.cookieService.get("jwtToken");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        if (
          decodedToken.roles &&
          Array.isArray(decodedToken.roles) &&
          decodedToken.roles.length > 0
        ) {
          const userRole = decodedToken.roles[0].authority;
          this.isLocataire = userRole === "LOCATAIRE";
          this.isBailleur = userRole === "BAILLEUR" || userRole === "ADMIN";
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
      } finally {
        this.isLoadingRole = false;
      }
    } else {
      this.isLoadingRole = false;
    }
  }

  loadScript(src: string) {
    const script = this.renderer.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.onload = () => {};
    this.renderer.appendChild(document.body, script);
  }
}
