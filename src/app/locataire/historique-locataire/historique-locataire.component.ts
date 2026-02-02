import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocataireService} from "../service/locataire.service";
import {UserService} from "../../user/service/user.service";
import {LocataireAppartement, LocataireInfo} from "../modele/locataire-data";
import {CookieService} from "ngx-cookie-service";

interface Loyer {
    mois: string;
    montantAttendu: number;
    montantVerse: number;
    ok: boolean;
    courant: boolean;
}

interface HistoriqueTransaction {
    id: number;
    date: string;
    type: string;
    montant: number;
    description: string;
    statut: string;
}

interface SituationAppartement {
    loyerMensuel: number;
    caution: number;
    loyerPaye: number;
    loyerEnAttente: number;
    loyerEnRetard: number;
    solde: number;
    prochainPaiement: string;
}

@Component({
    selector: "app-historique-locataire",
    templateUrl: "./historique-locataire.component.html",
    styleUrls: ["./historique-locataire.component.scss"],
})
export class HistoriqueLocataireComponent implements OnInit {
    loyers: Loyer[] = [];
    historique: HistoriqueTransaction[] = [];
    situationAppartement: SituationAppartement | null = null;
    locataireInfo: LocataireInfo | null = null;
    appartements: LocataireAppartement[] = [];
    isLoading = true;
    hasError = false;
    errorMessage = "";
    userReference = "";
    hasAppartements = false;
    apartmentReference: string | null = null; // Référence de l'appartement sélectionné
    selectedAppartement: LocataireAppartement | null = null; // Appartement sélectionné

    constructor(
        private locataireService: LocataireService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private cookieService: CookieService
    ) {
    }

    ngOnInit(): void {
        this.loadHistorique();
    }

    loadHistorique(): void {
        this.isLoading = true;
        this.hasError = false;

        // Récupérer la référence de l'appartement depuis l'URL (nouveau paramètre)
        this.apartmentReference = this.route.snapshot.paramMap.get("reference");

        // Récupérer la référence utilisateur depuis les cookies
        const referenceFromCookies = this.cookieService.get("userReference");
        this.userReference = referenceFromCookies;

        if (!this.userReference) {
            this.hasError = true;
            this.errorMessage = "Référence utilisateur non trouvée.";
            this.isLoading = false;
            return;
        }

        // Charger les informations du locataire pour vérifier s'il a des appartements
        this.loadLocataireInfo();
    }

    loadLocataireInfo(): void {
        this.locataireService.getLocataireInfo().subscribe({
            next: (info) => {
                this.locataireInfo = info;
                this.appartements = info.appartements || [];
                this.hasAppartements = this.appartements.length > 0;

                // Si une référence d'appartement est fournie, filtrer pour afficher uniquement cet appartement
                if (this.apartmentReference && this.hasAppartements) {
                    this.selectedAppartement = this.appartements.find(
                        (a) => a.reference === this.apartmentReference
                    ) || null;

                    if (!this.selectedAppartement) {
                        this.hasError = true;
                        this.errorMessage = "Appartement non trouvé.";
                        this.isLoading = false;
                        return;
                    }

                    // Afficher uniquement l'appartement sélectionné
                    this.appartements = [this.selectedAppartement];
                }

                if (this.hasAppartements) {
                    // Charger l'historique réel depuis l'API
                    this.loadHistoriqueData();
                } else {
                    // Pas d'appartements, ce n'est pas une erreur
                    this.isLoading = false;
                    this.hasError = false;
                }
            },
            error: (error) => {
                console.error("Erreur lors du chargement des données:", error);

                // Si l'utilisateur est connecté (on a une référence),
                // une erreur 404 ou similaire signifie probablement qu'il n'a pas d'appartements
                const status =
                    error?.status || error?.error?.status || error?.error?.statusCode;
                const isNotFound = status === 404;
                const isNoAppartements =
                    error?.error?.message?.toLowerCase().includes("appartement") ||
                    error?.message?.toLowerCase().includes("appartement") ||
                    error?.error?.message?.toLowerCase().includes("aucun") ||
                    error?.message?.toLowerCase().includes("aucun");

                // Si l'utilisateur est connecté et que c'est une erreur 404 ou liée aux appartements,
                // on considère que c'est juste qu'il n'a pas d'appartements (pas une vraie erreur)
                if (this.userReference && (isNotFound || isNoAppartements)) {
                    // L'utilisateur n'a pas d'appartements, ce n'est pas une erreur
                    this.appartements = [];
                    this.hasAppartements = false;
                    this.isLoading = false;
                    this.hasError = false;
                } else {
                    // Vraie erreur (connexion, serveur, etc.) - seulement si ce n'est pas clairement lié à l'absence d'appartements
                    // Si l'utilisateur est connecté et qu'on a une erreur, on assume qu'il n'a pas d'appartements
                    if (this.userReference) {
                        this.appartements = [];
                        this.hasAppartements = false;
                        this.isLoading = false;
                        this.hasError = false;
                    } else {
                        this.hasError = true;
                        this.errorMessage =
                            "Impossible de charger vos informations. Veuillez réessayer.";
                        this.isLoading = false;
                    }
                }
            },
        });
    }

    private loadHistoriqueData(): void {
        if (!this.selectedAppartement || !this.selectedAppartement.bail || !this.selectedAppartement.bail.id) {
            // Pas de bail, donc pas d'historique
            this.loyers = [];
            this.historique = [];
            this.situationAppartement = null;
            this.isLoading = false;
            this.hasError = false;
            return;
        }

        // Récupérer l'historique des loyers depuis l'API
        this.locataireService.getHistoriqueLoyers(this.selectedAppartement.bail.id).subscribe({
            next: (loyers: Loyer[]) => {
                console.log("Historique des loyers récupéré:", loyers);
                // Stocker les loyers directement
                this.loyers = loyers;

                // Transformer les loyers en transactions pour l'affichage complet
                this.historique = loyers.map((loyer: Loyer, index: number) => ({
                    id: index,
                    date: loyer.mois,
                    type: "Loyer",
                    montant: loyer.montantVerse,
                    description: `Loyer pour ${new Date(loyer.mois).toLocaleDateString('fr-FR', {
                        month: 'long',
                        year: 'numeric'
                    })}`,
                    statut: loyer.ok ? "Payé" : "En retard",
                }));
                this.isLoading = false;
                this.hasError = false;
            },
            error: (error) => {
                console.error("Erreur lors du chargement de l'historique:", error);
                // Si c'est une erreur 404 ou une erreur serveur, on affiche un historique vide
                // plutôt qu'une erreur complète
                this.loyers = [];
                this.historique = [];
                this.situationAppartement = null;
                this.isLoading = false;
                this.hasError = false;
            },
        });
    }

    /**
     * Recharge les données
     */
    reload(): void {
        this.loadHistorique();
    }

    /**
     * Formate une date
     */
    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString("fr-FR");
    }

    /**
     * Formate un montant (affiche juste le nombre sans devise)
     */
    formatAmount(amount: number): string {
        if (amount == null) return "0";
        return `${amount}`;
    }

    /**
     * Retourne la classe CSS selon le statut
     */
    getStatusClass(statut: string): string {
        switch (statut.toLowerCase()) {
            case "payé":
                return "status-paid";
            case "en attente":
                return "status-pending";
            case "en retard":
                return "status-overdue";
            default:
                return "status-default";
        }
    }

    /**
     * Calcule le total des montants payés
     */
    getTotalPaid(): number {
        return this.historique
            .filter((t) => t.statut.toLowerCase() === "payé")
            .reduce((total, t) => total + t.montant, 0);
    }

    /**
     * Calcule le total des montants en attente
     */
    getTotalPending(): number {
        return this.historique
            .filter((t) => t.statut.toLowerCase() === "en retard")
            .reduce((total, t) => total + t.montant, 0);
    }

    /**
     * Formate le solde avec un indicateur de crédit/débit
     */
    formatSolde(solde: number): string {
        const formatted = this.formatAmount(Math.abs(solde));
        return solde < 0 ? `+${formatted} (Crédit)` : `-${formatted} (Débit)`;
    }

    /**
     * Retourne la classe CSS pour le solde
     */
    getSoldeClass(solde: number): string {
        return solde < 0 ? "solde-credit" : "solde-debit";
    }

    /**
     * Revenir à l'accueil du locataire
     */
    goBack(): void {
        this.router.navigate(["/locataire"]);
    }
}
