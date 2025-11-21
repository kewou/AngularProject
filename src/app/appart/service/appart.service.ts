import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { UserService } from "../../user/service/user.service";
import { Appart, UpdateAppartRequest, User, Bail } from "../modele/appart";
import { HttpService } from "../../utils/httpService";
import { HttpParams } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class AppartService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly cookieService: CookieService
  ) {}

  getAppartsByLogement(logementRef: string): Observable<Appart[]> {
    const userReference = this.getUserReferenceOrThrow();
    const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts`;
    return this.httpService.get<Appart[]>(url);
  }

  private getUserReferenceOrThrow(): string {
    const ref = this.cookieService.get("userReference");
    if (!ref) throw new Error("User reference is not available");
    return ref;
  }

  addAppart(logementRef: string, appart: Appart): Observable<any> {
    const userReference = this.getUserReferenceOrThrow();
    const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/create`;

    return this.httpService.post(url, appart);
  }

  updateAppart(logementRef: string, appart: Appart): Observable<any> {
    const userReference = this.getUserReferenceOrThrow();
    const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/${appart.reference}`;

    // récupère le bail actif si présent
    const bailActif: Bail | undefined = appart.baux?.find((b) => b.actif);

    const payload: UpdateAppartRequest = {
      reference: appart.reference,
      nom: appart.nom,
      prixLoyer: appart.prixLoyer,
      prixCaution: appart.prixCaution,
      bailleurId: bailActif
        ? bailActif.locataire.reference
        : appart.bailleur?.reference!,
    };

    return this.httpService.put<Appart>(url, payload);
  }

  deleteAppart(logementRef: string, appartReference: string): Observable<any> {
    const userReference = this.getUserReferenceOrThrow();
    const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/${appartReference}`;

    return this.httpService.delete(url);
  }

  getAppartByRef(logementRef: string, appartRef: string): Observable<Appart> {
    const userReference = this.getUserReferenceOrThrow();
    const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/${appartRef}`;
    return this.httpService.get<Appart>(url);
  }

  searchLocatairesByName(name: string): Observable<User[]> {
    const params = new HttpParams().set("role", "LOCATAIRE").set("nom", name);

    return this.httpService.get<User[]>("users/search", params);
  }
}
