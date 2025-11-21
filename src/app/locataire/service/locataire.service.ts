import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { HttpService } from "../../utils/httpService";
import { CookieService } from "ngx-cookie-service";
import {
  LocataireInfo,
  LocataireAppartement,
  PaiementInfo,
} from "../modele/locataire-data";

@Injectable({
  providedIn: "root",
})
export class LocataireService {
  constructor(
    private httpService: HttpService,
    private cookieService: CookieService
  ) {}

  /**
   * Récupère les informations du locataire connecté
   */
  getLocataireInfo(): Observable<LocataireInfo> {
    const userReference = this.cookieService.get("userReference");
    if (!userReference) {
      return throwError(() => new Error("Utilisateur non connecté"));
    }

    const endpointUrl = `locataires/${userReference}`;
    return this.httpService.get<LocataireInfo>(endpointUrl);
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
    return this.httpService.get<LocataireAppartement[]>(endpointUrl);
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
    return this.httpService.get<PaiementInfo[]>(endpointUrl);
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
