import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppartService } from "../appart/service/appart.service";
import { BailService } from "../appart/service/bail.service";
import { LogementService } from "../logement/service/logement.service";
import { Appart, Loyer, Transaction, Bail } from "../appart/modele/appart";
import { Logement } from "../logement/modele/logement";

interface TransactionWithDetails extends Transaction {
  appartRef: string;
  appartNom: string;
  locataireNom: string;
  loyersPayes: number; // Nombre de loyers payés par cette transaction
}

interface TransactionByAppart {
  appart: Appart;
  transactions: TransactionWithDetails[];
}

@Component({
  selector: "app-logement-transactions",
  templateUrl: "./logement-transactions.component.html",
  styleUrls: ["./logement-transactions.component.scss"],
})
export class LogementTransactionsComponent implements OnInit {
  logementRef: string = "";
  logement?: Logement;
  apparts: Appart[] = [];
  transactionsByAppart: TransactionByAppart[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appartService: AppartService,
    private bailService: BailService,
    private logementService: LogementService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.logementRef = params["logementRef"];
      this.loadLogementData();
    });
  }

  loadLogementData(): void {
    // Charger les informations du logement
    this.logementService.getLogements().subscribe({
      next: (logements) => {
        this.logement = logements.find(
          (l: Logement) => l.reference === this.logementRef
        );
        this.loadApparts();
      },
      error: (error) => {
        console.error("Erreur lors du chargement du logement:", error);
        this.loading = false;
      },
    });
  }

  loadApparts(): void {
    // Charger tous les appartements du logement
    this.appartService.getAppartsByLogement(this.logementRef).subscribe({
      next: (apparts) => {
        this.apparts = apparts;
        this.loadTransactionsForAllApparts();
      },
      error: (error) => {
        console.error("Erreur lors du chargement des appartements:", error);
        this.loading = false;
      },
    });
  }

  loadTransactionsForAllApparts(): void {
    this.transactionsByAppart = [];

    if (this.apparts.length === 0) {
      this.loading = false;
      return;
    }

    let loadedCount = 0;
    const totalApparts = this.apparts.length;

    this.apparts.forEach((appart) => {
      const bailActif = appart.baux?.find((b) => b.actif);
      if (bailActif?.id) {
        this.bailService.getTransactions(bailActif.id).subscribe({
          next: (transactions) => {
            // Enrichir les transactions avec les détails de l'appartement et du locataire
            const transactionsWithDetails: TransactionWithDetails[] =
              transactions.map((transaction) => ({
                ...transaction,
                appartRef: appart.reference,
                appartNom: appart.nom,
                locataireNom: bailActif.locataire.name,
                loyersPayes: Math.floor(transaction.montant / appart.prixLoyer), // Calculer le nombre de loyers payés
              }));

            this.transactionsByAppart.push({
              appart: appart,
              transactions: transactionsWithDetails,
            });
            loadedCount++;
            if (loadedCount === totalApparts) {
              this.loading = false;
            }
          },
          error: (error) => {
            console.error(
              `Erreur lors du chargement des transactions pour l'appart ${appart.reference}:`,
              error
            );
            loadedCount++;
            if (loadedCount === totalApparts) {
              this.loading = false;
            }
          },
        });
      } else {
        // Pas de bail actif, ajouter quand même l'appart avec une liste vide
        this.transactionsByAppart.push({
          appart: appart,
          transactions: [],
        });
        loadedCount++;
        if (loadedCount === totalApparts) {
          this.loading = false;
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(["/bailleur/logements"]);
  }

  goToAppart(appartRef: string): void {
    this.router.navigate([`/bailleur/logements/${this.logementRef}/apparts`]);
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("fr-FR");
  }

  getTotalTransactions(): number {
    return this.transactionsByAppart.reduce((total, item) => {
      return (
        total +
        item.transactions.reduce((appartTotal, transaction) => {
          return appartTotal + transaction.montant;
        }, 0)
      );
    }, 0);
  }

  getTotalLoyersPayes(): number {
    return this.transactionsByAppart.reduce((total, item) => {
      return (
        total +
        item.transactions.reduce((appartTotal, transaction) => {
          return appartTotal + transaction.loyersPayes;
        }, 0)
      );
    }, 0);
  }

  getAppartTotalTransactions(transactions: TransactionWithDetails[]): number {
    return transactions.reduce((total, transaction) => {
      return total + transaction.montant;
    }, 0);
  }
}
