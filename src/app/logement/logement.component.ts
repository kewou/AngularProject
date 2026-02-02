import { Component, OnInit } from "@angular/core";
import { LogementService } from "./service/logement.service";
import { Logement } from "./modele/logement";
import { MatDialog } from "@angular/material/dialog";
import { AddLogementDialogComponent } from "./add-logement-dialog/add-logement-dialog.component";
import { EditLogementDialogComponent } from "./edit-logement-dialog/edit-logement-dialog.component";
import { DeleteLogementDialogComponent } from "./delete-logement-dialog/delete-logement-dialog.component";
import { Router } from "@angular/router";
import { HttpService } from "../utils/httpService";

@Component({
  selector: "app-logement",
  templateUrl: "./logement.component.html",
  styleUrls: ["./logement.component.scss"],
})
export class LogementComponent implements OnInit {
  logements: Logement[] = [];
  logement: Logement = {
    reference: "",
    quartier: "",
    ville: "",
    description: "",
  };

  isModalOpen = false;
  errorMessage: string = "";

  constructor(
    private logementService: LogementService,
    private httpService: HttpService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.logementService.getLogements().subscribe(
      (data) => {
        this.logements = data;
      },
      (error) => {
        console.error("Erreur fetching logements");
      }
    );
  }

  openAddLogementDialog(event: Event): void {
    event.preventDefault();
    const dialogRef = this.dialog.open(AddLogementDialogComponent, {
      width: "520px",
    });

    dialogRef.componentInstance.logementAdded.subscribe(
      (logement: Logement) => {
        this.addLogement(logement);
      }
    );
  }

  openEditLogementDialog(logement: Logement): void {
    const dialogRef = this.dialog.open(EditLogementDialogComponent, {
      width: "520px",
      data: { logement },
    });

    dialogRef.componentInstance.logementUpdated.subscribe(
      (updatedLogement: Logement) => {
        this.updateLogement(updatedLogement);
      }
    );
  }

  openDeleteLogementDialog(referenceLgt: string): void {
    const dialogRef = this.dialog.open(DeleteLogementDialogComponent, {
      width: "350px",
      data: { reference: referenceLgt },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteLogement(referenceLgt);
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addLogement(logement: Logement) {
    this.logementService.addLogement(logement).subscribe({
      next: (addedLogement) => {
        this.logements.push(addedLogement);
      },
      error: (error) => {
        console.error("Failed to add logement:", error);
      },
    });
  }

  updateLogement(logement: Logement) {
    this.logementService.updateLogement(logement).subscribe({
      next: (logementUpdated) => {
        const index = this.logements.findIndex(
          (l) => l.reference === logement.reference
        );
        if (index !== -1) {
          this.logements[index] = logementUpdated;
        }
        this.errorMessage = "";
      },
      error: (error) => {
        console.error("Erreur complète:", error);
        console.error("Status:", error?.status);
        console.error("Message:", error?.message);
        console.error("Body:", error?.error);

        // Extraire le message d'erreur du backend
        const statusCode = error?.status || error?.error?.status || 0;
        const errorMsg = this.httpService.getErrorMessage(statusCode);

        this.errorMessage = errorMsg;
        console.error("Message d'erreur affiché:", this.errorMessage);

        // Afficher une alerte à l'utilisateur
        alert(`Erreur lors de la mise à jour : ${this.errorMessage}`);
      },
    });
  }

  deleteLogement(logementRef: string) {
    this.logementService.deleteLogement(logementRef).subscribe({
      next: (logementDeleted) => {
        this.removeLogementByRef(logementRef);
        this.errorMessage = "";
      },
      error: (error) => {
        console.error("Erreur complète:", error);
        console.error("Status:", error?.status);
        console.error("Message:", error?.message);
        console.error("Body:", error?.error);

        const statusCode = error?.status || error?.error?.status || 0;
        const errorMsg = this.httpService.getErrorMessage(statusCode);

        this.errorMessage = errorMsg;
        console.error("Message d'erreur affiché:", this.errorMessage);

        alert(`Erreur lors de la suppression : ${this.errorMessage}`);
      },
    });
  }

  private removeLogementByRef(refLgt: string): void {
    const index = this.logements.findIndex(
      (logement) => logement.reference === refLgt
    );

    if (index >= 0) {
      this.logements.splice(index, 1);
      console.log(`Logement avec la ref ${refLgt} supprimé.`);
    } else {
      console.error(`Logement avec la ref ${refLgt} non trouvé.`);
    }
  }

  viewApparts(logementRef: string): void {
    this.router.navigate([`/bailleur/logements/${logementRef}/apparts`]);
  }

  viewTransactions(logementRef: string): void {
    this.router.navigate([`/bailleur/logements/${logementRef}/transactions`]);
  }
}
