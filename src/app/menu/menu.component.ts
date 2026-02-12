import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild,} from "@angular/core";
import {UserService} from "../user/service/user.service";
import {CookieService} from "ngx-cookie-service";
import {NavigationEnd, Router} from "@angular/router";
import {LogoutDialogComponent} from "../logout-dialog/logout-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {filter} from "rxjs/operators";

@Component({
    selector: "app-menu",
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements AfterViewInit {
    registrationModalOpen = false;
    isUserConnected: boolean = false;
    userRole: string = "";

    @ViewChild("navbarResponsive") navbarResponsive!: ElementRef;

    constructor(
        public userService: UserService,
        private cookieService: CookieService,
        private router: Router,
        private dialog: MatDialog,
        private renderer: Renderer2
    ) {
    }

    ngAfterViewInit() {
        // Écouter les changements de route et fermer le menu après navigation
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                console.log("Navigation détectée", event);
                this.fermerMenu();
                // Recharger le rôle utilisateur à chaque navigation
                this.loadUserRole();
            });

        // Initialiser le rôle utilisateur
        this.loadUserRole();
    }

    loadUserRole(): void {
        console.log("🔍 loadUserRole() appelée");
        console.log(
            "🔍 estUtilisateurConnecte():",
            this.userService.estUtilisateurConnecte()
        );

        if (this.userService.estUtilisateurConnecte()) {
            const token = this.cookieService.get("jwtToken");
            console.log("🔍 Token trouvé:", token ? "Oui" : "Non");

            if (token) {
                try {
                    const decodedToken: any = this.userService.decodeJwtToken(token);
                    console.log("🔍 Token décodé:", decodedToken);

                    if (
                        decodedToken.roles &&
                        Array.isArray(decodedToken.roles) &&
                        decodedToken.roles.length > 0
                    ) {
                        this.userRole = decodedToken.roles[0].authority;
                        console.log("🔍 Rôle utilisateur défini:", this.userRole);
                    } else {
                        console.log("🔍 Aucun rôle trouvé dans le token");
                    }
                } catch (error) {
                    console.error("Erreur lors du décodage du token:", error);
                    this.userRole = "";
                }
            }
        } else {
            console.log("🔍 Utilisateur non connecté");
        }
    }

    isLocataire(): boolean {
        const result = this.userRole === "LOCATAIRE";
        console.log("🔍 isLocataire():", result, "(userRole:", this.userRole, ")");
        return result;
    }

    isBailleur(): boolean {
        const result = this.userRole === "BAILLEUR";
        console.log("🔍 isBailleur():", result, "(userRole:", this.userRole, ")");
        return result;
    }

    isAdmin(): boolean {
        const result = this.userRole === "ADMIN";
        console.log("🔍 isAdmin():", result, "(userRole:", this.userRole, ")");
        return result;
    }

    getHomeLink(): string {
        if (this.userService.estUtilisateurConnecte()) {
            if (this.isLocataire()) {
                return "/locataire";
            }
            if (this.isBailleur() || this.isAdmin()) {
                return "/bailleur";
            }
        }
        return "/";
    }

    getHistoriqueLink(): string {
        return "/locataire/historique";
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
