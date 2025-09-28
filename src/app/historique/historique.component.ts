import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { Appart } from "../appart/modele/appart";
import { Loyer } from "../appart/modele/appart";
import { AppartService } from "../appart/service/appart.service";
import { BailService } from "../appart/service/bail.service";
import { Bail } from "../appart/modele/appart";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmPaymentDialogComponent } from "./dialog/comfirmPayment-dialog.component";

@Component({
  selector: "app-historique",
  templateUrl: "./historique.component.html",
  styleUrls: ["./historique.component.scss"],
})
export class HistoriqueComponent implements OnInit {
  appart?: Appart;
  loyers: Loyer[] = [];
  transactionForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private appartService: AppartService,
    private bailService: BailService,
    private fb: FormBuilder,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      montantVerser: [
        null,
        [
          Validators.required,
          Validators.min(1),
          this.multipleDuLoyerValidator.bind(this),
        ],
      ],
    });

    this.route.params.subscribe((params) => {
      const logementRef = params["logementRef"];
      const appartRef = params["appartRef"];

      this.appartService.getAppartByRef(logementRef, appartRef).subscribe({
        next: (a) => {
          this.appart = a;
          const bailActif = this.getBailActif(a);
          if (bailActif?.id != null) {
            this.loadHistorique(bailActif.id);
          }
        },
        error: (err) => console.error(err),
      });
    });
  }

  /**
   * Retourne le bail actif d'un appartement (ou undefined si aucun actif)
   */
  getBailActif(appart?: Appart): Bail | undefined {
    return appart?.baux?.find((b) => b.actif);
  }

  get hasBailActif(): boolean {
    return !!this.getBailActif(this.appart);
  }

  loadHistorique(bailId: number): void {
    this.bailService.getHistoriqueLoyers(bailId).subscribe({
      next: (rows) => (this.loyers = rows),
      error: (err) => console.error(err),
    });
  }

  effectuerVersement(): void {
    const bailActif = this.getBailActif(this.appart);
    if (!bailActif?.id) return;
    if (this.transactionForm.invalid) return;

    const montant = this.transactionForm.value.montantVerser;
    const dialogRef = this.dialog.open(ConfirmPaymentDialogComponent, {
      width: "350px",
      data: { message: `Confirmez-vous le versement de ${montant} ?` },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.bailService.createTransaction(bailActif.id, montant).subscribe({
          next: () => this.loadHistorique(bailActif.id),
          error: (err: any) => console.error("❌ Erreur versement", err),
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  formatAmount(n: number | null | undefined): string {
    if (n == null) return "0";
    return `${n}`;
  }
  multipleDuLoyerValidator(control: any) {
    const montant = control.value;
    const loyer = this.appart?.prixLoyer;

    if (montant && loyer && montant % loyer !== 0) {
      return { notMultiple: true };
    }
    return null;
  }
}
