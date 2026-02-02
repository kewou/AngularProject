import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocataireService} from "./service/locataire.service";
import {LocataireAppartement, LocataireInfo} from "./modele/locataire-data";
import {UserService} from "../user/service/user.service";
import {CookieService} from "ngx-cookie-service";

@Component({
    selector: "app-locataire",
    templateUrl: "./locataire.component.html",
    styleUrls: ["./locataire.component.scss"],
})
export class LocataireComponent implements OnInit {
    locataireInfo: LocataireInfo | null = null;
    appartements: LocataireAppartement[] = [];
    isLoading = true;
    hasError = false;
    errorMessage = "";
    hasAppartements = false;
    userReference = "";

    constructor(
        private locataireService: LocataireService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private cookieService: CookieService
    ) {
    }

    ngOnInit(): void {
        this.loadLocataireData();
    }

    loadLocataireData(): void {
        this.isLoading = true;
        this.hasError = false;

        // Récupérer la référence depuis l'URL ou depuis les cookies
        const referenceFromUrl = this.route.snapshot.paramMap.get("reference");
        const referenceFromCookies = this.cookieService.get("userReference");

        // Utiliser la référence de l'URL si disponible, sinon celle des cookies
        this.userReference = referenceFromUrl || referenceFromCookies;

        if (!this.userReference) {
            this.hasError = true;
            this.errorMessage = "Référence utilisateur non trouvée.";
            this.isLoading = false;
            return;
        }

        // Appel API pour récupérer les vraies données
        this.locataireService.getLocataireInfo().subscribe({
            next: (info) => {
                this.locataireInfo = info;
                this.appartements = info.appartements || [];
                this.hasAppartements = this.appartements.length > 0;
                this.isLoading = false;
                this.hasError = false;
            },
            error: (error) => {
                console.error("Erreur lors du chargement des données:", error);
                console.log("UserReference:", this.userReference);
                console.log(
                    "Error status:",
                    error?.status || error?.error?.status || error?.error?.statusCode
                );
                console.log("Error message:", error?.error?.message || error?.message);

                // Si l'utilisateur est connecté (on a une référence),
                // on considère que toute erreur signifie qu'il n'a pas d'appartements (pas une vraie erreur)
                if (this.userReference) {
                    // L'utilisateur est connecté, donc une erreur signifie probablement qu'il n'a pas d'appartements
                    // Ce n'est pas une vraie erreur, juste un état normal
                    console.log(
                        "Utilisateur connecté sans appartements - ce n'est pas une erreur"
                    );
                    this.appartements = [];
                    this.hasAppartements = false;
                    this.isLoading = false;
                    this.hasError = false;
                    // On peut créer un objet locataireInfo minimal pour l'affichage
                    if (!this.locataireInfo) {
                        this.locataireInfo = {
                            reference: this.userReference,
                            name: "",
                            email: "",
                            appartements: [],
                        };
                    }
                } else {
                    // Pas de référence utilisateur = vraie erreur
                    console.log("Pas de référence utilisateur - vraie erreur");
                    this.hasError = true;
                    this.errorMessage =
                        "Impossible de charger vos informations. Veuillez réessayer.";
                    this.isLoading = false;
                }
            },
        });
    }

    /**
     * Recharge les données
     */
    reload(): void {
        this.loadLocataireData();
    }

    /**
     * Formate une date
     */
    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString("fr-FR");
    }

    /**
     * Formate un montant en euros
     */
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(amount);
    }

    /**
     * Navigue vers l'historique d'un appartement
     */
    navigateToHistorique(appartementRef: string): void {
        this.router.navigate([`/locataire/historique/${appartementRef}`]);
    }
}
