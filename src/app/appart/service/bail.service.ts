import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { Router } from "@angular/router";
import { UserService } from "../../user/service/user.service";
import { CookieService } from "ngx-cookie-service";
import { catchError } from "rxjs/operators";
import { Appart, Bail, Loyer, Transaction } from "../modele/appart";
import { HttpService } from "../../utils/httpService";

@Injectable({
  providedIn: "root",
})
export class BailService {
  constructor(private readonly httpService: HttpService) {}

  assignLocataire(
    appartRef: string,
    request: {
      locataireRef: string;
      dateEntree: string;
      dateSortiePrevue?: string;
    }
  ): Observable<Bail> {
    return this.httpService.post(`baux/apparts/${appartRef}`, request);
  }

  getHistoriqueLoyers(bailId: number): Observable<Loyer[]> {
    const url = `baux/${bailId}/historique-loyers`;
    return this.httpService
      .get<Loyer[]>(url)
      .pipe(catchError((err) => throwError(() => err)));
  }

  createTransaction(bailId: number, montant: number): Observable<Transaction> {
    const url = `baux/${bailId}/transactions`;
    return this.httpService
      .post<Transaction>(url, { montant })
      .pipe(catchError((err) => throwError(() => err)));
  }

  sortirLocataire(bailId: number): Observable<any> {
    return this.httpService.put(`baux/${bailId}/sortie`, {}).pipe(
      catchError((err) => {
        console.error("Erreur sortie locataire:", err);
        return throwError(() => err);
      })
    );
  }
}
