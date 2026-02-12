import {Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {HttpService} from "../../utils/httpService";
import {CookieService} from "ngx-cookie-service";
import {LocataireAppartement, LocataireInfo, PaiementInfo,} from "../modele/locataire-data";
import {catchError} from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class LocataireService {
    constructor(
        private httpService: HttpService,
        private cookieService: CookieService
    ) {
    }

    /**
     * Récupère les informations du locataire connecté
     */
    getLocataireInfo(): Observable<LocataireInfo> {
        const userReference = this.cookieService.get("userReference");
        if (!userReference) {
            return throwError(() => new Error("Utilisateur non connecté"));
        }

        const endpointUrl = `locataires/${userReference}`;
        return this.httpService.get<LocataireInfo>(endpointUrl).pipe(
            catchError((error) => {
                console.error(
                    "Erreur lors de la récupération des informations du locataire:",
                    error
                );
                return throwError(
                    () =>
                        new Error("Impossible de récupérer les informations du locataire")
                );
            })
        );
    }

    /**
     * Récupère les appartements du locataire
     */
    getLocataireAppartements(): Observable<LocataireAppartement[]> {
        const userReference = this.cookieService.get("userReference");
        if (!userReference) {
            return throwError(() => new Error("Utilisateur non connecté"));
        }

        const endpointUrl = `locataires/${userReference}/appartements`;
        return this.httpService.get<LocataireAppartement[]>(endpointUrl).pipe(
            catchError((error) => {
                console.error(
                    "Erreur lors de la récupération des appartements:",
                    error
                );
                return throwError(
                    () => new Error("Impossible de récupérer les appartements")
                );
            })
        );
    }

    /**
     * Récupère l'historique des paiements du locataire
     */
    getPaiementsHistory(): Observable<PaiementInfo[]> {
        const userReference = this.cookieService.get("userReference");
        if (!userReference) {
            return throwError(() => new Error("Utilisateur non connecté"));
        }

        const endpointUrl = `locataires/${userReference}/paiements`;
        return this.httpService.get<PaiementInfo[]>(endpointUrl).pipe(
            catchError((error) => {
                console.error(
                    "Erreur lors de la récupération de l'historique des paiements:",
                    error
                );
                return throwError(
                    () => new Error("Impossible de récupérer l'historique des paiements")
                );
            })
        );
    }

    /**
     * Récupère l'historique des loyers pour un bail spécifique
     */
    getHistoriqueLoyers(bailId: number): Observable<any[]> {
        if (!bailId) {
            return throwError(() => new Error("ID du bail non fourni"));
        }

        const endpointUrl = `baux/${bailId}/historique-loyers`;
        return this.httpService.get<any[]>(endpointUrl).pipe(
            catchError((error) => {
                console.error(
                    "Erreur lors de la récupération de l'historique des loyers:",
                    error
                );
                return throwError(
                    () => new Error("Impossible de récupérer l'historique des loyers")
                );
            })
        );
    }

    /**
     * Vérifie si le locataire a des appartements assignés
     */
    hasAppartements(): Observable<boolean> {
        return new Observable((observer) => {
            this.getLocataireAppartements().subscribe({
                next: (appartements) => {
                    observer.next(appartements && appartements.length > 0);
                    observer.complete();
                },
                error: (error) => {
                    console.error(
                        "Erreur lors de la vérification des appartements:",
                        error
                    );
                    observer.next(false);
                    observer.complete();
                },
            });
        });
    }
}
