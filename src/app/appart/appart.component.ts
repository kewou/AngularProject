import { Component, OnInit } from "@angular/core";
import { AppartService } from "./service/appart.service";
import { Appart } from "./modele/appart";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { AddAppartDialogComponent } from "./add-appart-dialog/add-appart-dialog.component";
import { EditAppartDialogComponent } from "./edit-appart-dialog/edit-appart-dialog.component";
import { DeleteAppartDialogComponent } from "./delete-appart-dialog/delete-appart-dialog.component";
import { AddBailDialogComponent } from "./add-bail-dialog/add-bail-dialog.component";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { LogementService } from "../logement/service/logement.service";
import { Observable } from "rxjs";
import { BailService } from "./service/bail.service";

@Component({
  selector: "app-appart",
  templateUrl: "./appart.component.html",
  styleUrls: ["./appart.component.scss"],
})
export class AppartComponent implements OnInit {
  apparts: Appart[] = [];
  descriptionLogement: string = "";
  logementRef: string = "";
  isModalOpen = false;
  displayedColumns: string[] = [
    "reference",
    "numero",
    "prixLoyer",
    "prixCaution",
    "user",
  ];

  constructor(
    private route: ActivatedRoute,
    private appartService: AppartService,
    private location: Location,
    private logementService: LogementService,
    private bailService: BailService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.logementRef = params.get("logementRef") as string;
      this.loadApparts();
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openAddAppartDialog(): void {
    const dialogRef = this.dialog.open(AddAppartDialogComponent, {
      width: "520px",
    });

    dialogRef.componentInstance.appartAdded.subscribe((appart: Appart) => {
      this.addAppart(appart);
    });
  }

  openEditAppartDialog(appart: Appart): void {
    const dialogRef = this.dialog.open(EditAppartDialogComponent, {
      width: "520px",
      data: { appart },
    });

    dialogRef.componentInstance.appartUpdated.subscribe(
      (updatedApart: Appart) => {
        this.updateAppart(updatedApart);
      }
    );
  }

  openDeleteAppartDialog(referenceLgt: string): void {
    const dialogRef = this.dialog.open(DeleteAppartDialogComponent, {
      width: "350px",
      data: { reference: referenceLgt },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteAppart(referenceLgt);
      }
    });
  }

  openAddBailDialog(appartRef: string): void {
    const dialogRef = this.dialog.open(AddBailDialogComponent, {
      width: "400px",
      data: { appartRef },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadApparts(); // recharge les apparts après assignation
      }
    });
  }

  addAppart(appart: Appart) {
    this.route.paramMap.subscribe((params) => {
      this.logementRef = params.get("logementRef") as string;
      if (this.logementRef) {
        this.appartService.addAppart(this.logementRef, appart).subscribe({
          next: (addedAppart) => {
            this.apparts.push(addedAppart);
          },
          error: (error) => {
            console.error("Failed to add appart:", error);
          },
        });
      }
    });
  }

  updateAppart(appart: Appart) {
    this.route.paramMap.subscribe((params) => {
      this.logementRef = params.get("logementRef") as string;
      if (this.logementRef) {
        this.appartService.updateAppart(this.logementRef, appart).subscribe({
          next: (appartUpdated) => {
            const index = this.apparts.findIndex(
              (l) => l.reference === appart.reference
            );
            if (index !== -1) {
              this.apparts[index] = appartUpdated;
            }
          },
          error: (error) => {
            console.error("Failed to add appart:", error);
          },
        });
      }
    });
  }

  deleteAppart(appartRef: string) {
    this.route.paramMap.subscribe((params) => {
      this.logementRef = params.get("logementRef") as string;
      if (this.logementRef) {
        this.appartService.deleteAppart(this.logementRef, appartRef).subscribe({
          next: (appartDeleted) => {
            this.removeAppartByRef(appartRef);
          },
          error: (error) => {
            console.error("Failed to delete appart:", error);
          },
        });
      }
    });
  }

  private removeAppartByRef(appartRef: string): void {
    const index = this.apparts.findIndex(
      (appart) => appart.reference === appartRef
    );

    if (index >= 0) {
      this.apparts.splice(index, 1);
      console.log(`Appart avec la ref ${appartRef} supprimé.`);
    } else {
      console.error(`Appart avec la ref ${appartRef} non trouvé.`);
    }
  }

  getBailActif(appart: Appart) {
    return appart?.baux?.find((b) => b.actif);
  }

  hasBailActif(appart: Appart): boolean {
    return !!this.getBailActif(appart);
  }

  getBailActifId(appart: Appart): number | undefined {
    return this.getBailActif(appart)?.id;
  }

  viewLoyers(appartRef: string): void {
    this.route.paramMap.subscribe((params) => {
      this.logementRef = params.get("logementRef") as string;
      if (this.logementRef) {
        this.router.navigate([
          `/bailleur/logements/${this.logementRef}/apparts/${appartRef}`,
        ]);
      }
    });
  }

  sortirLocataire(appartRef: string, bailId?: number) {
    if (!bailId) return;
    this.bailService.sortirLocataire(bailId).subscribe({
      next: () => {
        console.log("✅ Locataire sorti avec succès");
        this.loadApparts(); // recharge la liste pour refléter le changement
      },
      error: (err) => console.error("❌ Erreur sortie locataire", err),
    });
  }

  private loadApparts(): void {
    if (this.logementRef) {
      this.appartService.getAppartsByLogement(this.logementRef).subscribe({
        next: (data) => {
          this.apparts = data;
        },
        error: (error) => {
          console.error("Erreur lors du chargement des apparts:", error);
        },
      });

      this.logementService.getOneLogement(this.logementRef).subscribe({
        next: (data) => {
          this.descriptionLogement = data.description;
        },
        error: (error) => {
          console.error("Erreur lors du chargement du logement:", error);
        },
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
