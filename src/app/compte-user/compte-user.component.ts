import { Component, OnInit } from "@angular/core";
import { User } from "../user/modele/user";
import { UserService } from "../user/service/user.service";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { EditProfilUserDialogComponent } from "./edit-profil-user-dialog/edit-profil-user-dialog.component";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-compte-user",
  templateUrl: "./compte-user.component.html",
  styleUrls: ["./compte-user.component.scss"],
})
export class CompteUserComponent implements OnInit {
  user: User = {
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  };
  userRole: string = "";

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private cookieService: CookieService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.loadUserRole();
  }

  getUserInfo(): void {
    this.userService.getUserInfo().subscribe({
      next: (data) => {
        this.user = data;
      },
    });
  }

  loadUserRole(): void {
    if (this.userService.estUtilisateurConnecte()) {
      const token = this.cookieService.get("jwtToken");
      if (token) {
        try {
          const decodedToken: any = this.userService.decodeJwtToken(token);
          if (
            decodedToken.roles &&
            Array.isArray(decodedToken.roles) &&
            decodedToken.roles.length > 0
          ) {
            this.userRole = decodedToken.roles[0].authority;
          }
        } catch (error) {
          console.error("Erreur lors du décodage du token:", error);
          this.userRole = "";
        }
      }
    }
  }

  getDisplayRole(): string {
    switch (this.userRole) {
      case "LOCATAIRE":
        return "Locataire";
      case "BAILLEUR":
        return "Bailleur";
      case "ADMIN":
        return "Administrateur";
      default:
        return "Utilisateur";
    }
  }

  openEditUserProfilDialog(user: User): void {
    const dialogRef = this.dialog.open(EditProfilUserDialogComponent, {
      width: "520px",
      data: { user },
    });

    dialogRef.componentInstance.userUpdated.subscribe((updatedUser: User) => {
      this.updateUser(updatedUser);
    });
  }

  updateUser(user: User) {
    this.userService.updateUser(user).subscribe({
      next: (userUpdated) => {
        this.user = userUpdated;
        // Message de succès spécifique à cette action
        this.snackBar.open(
          "Vos informations ont été mises à jour avec succès",
          "Fermer",
          {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "top",
            panelClass: ["success-snackbar"],
          }
        );
      },
    });
  }
}
