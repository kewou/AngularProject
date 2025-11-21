import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
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
    return this.httpService.get<Loyer[]>(url);
  }

  createTransaction(bailId: number, montant: number): Observable<Transaction> {
    const url = `baux/${bailId}/transactions`;
    return this.httpService.post<Transaction>(url, { montant });
  }

  getTransactions(bailId: number): Observable<Transaction[]> {
    const url = `baux/${bailId}/transactions`;
    return this.httpService.get<Transaction[]>(url);
  }

  sortirLocataire(bailId: number): Observable<any> {
    return this.httpService.put(`baux/${bailId}/sortie`, {});
  }
}
