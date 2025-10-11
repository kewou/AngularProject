import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { UserService } from "../user/service/user.service";

@Component({
  selector: "app-logout-dialog",
  templateUrl: "./logout-dialog.component.html",
  styleUrls: ["./logout-dialog.component.scss"],
})
export class LogoutDialogComponent {
  isLoggingOut = false;

  constructor(
    public dialogRef: MatDialogRef<LogoutDialogComponent>,
    private userService: UserService
  ) {}

  onConfirm(): void {
    if (this.isLoggingOut) {
      return; // Éviter les clics multiples
    }

    this.isLoggingOut = true;

    try {
      // Fermer le dialog d'abord
      this.dialogRef.close("confirm");

      // Puis effectuer la déconnexion
      this.userService.logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      this.isLoggingOut = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close("cancel");
  }
}
