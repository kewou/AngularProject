import { Injectable } from '@angular/core';
import { Observable, of,throwError } from 'rxjs';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../user/modele/user';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

    private readonly backendUrl = environment.backendUrl;
    private readonly httpOptions = {
                        headers: new HttpHeaders({
                            'Content-Type': 'application/json'
                        })
                     };

    constructor(readonly  http: HttpClient){}

    get(endpoint: string, params?: HttpParams): Observable<any> {
        return this.http.get(`${this.backendUrl}/${endpoint}`, { params });
    }

    post(endpoint: string, body: any): Observable<any> {
      return this.http.post(`${this.backendUrl}/${endpoint}`, body, this.httpOptions);
    }


    put(endpoint: string, body: any): Observable<any> {
      return this.http.put(`${this.backendUrl}/${endpoint}`, body, this.httpOptions);
    }

    delete(endpoint: string, params?: HttpParams): Observable<any> {
     return this.http.delete(`${this.backendUrl}/${endpoint}`, { params });
    }

getErrorMessage(httpStatusCode: number): string {
  switch (httpStatusCode) {
    case 400:
      return "Requête invalide. Veuillez vérifier les informations fournies.";
    case 401:
      return "Login ou mot de passe incorrect !. Veuillez vous réessayer.";
    case 403:
      return "Accès refusé. Vous n'avez pas les permissions nécessaires.";
    case 404:
      return "Ressource introuvable. Veuillez vérifier l'URL ou réessayer.";
    case 408:
      return "La requête a expiré. Veuillez réessayer.";
    case 500:
      return "Erreur interne du serveur. Veuillez réessayer plus tard.";
    case 502:
      return "Mauvaise passerelle. Le serveur est momentanément inaccessible.";
    case 503:
      return "Service indisponible. Veuillez réessayer ultérieurement.";
    case 504:
      return "Le serveur a mis trop de temps à répondre. Veuillez réessayer.";
    case 0:
      return "Impossible de joindre le serveur. Veuillez contacter Beezyweb svp.";
    default:
      return `Une erreur est survenue (code : ${httpStatusCode}). Veuillez réessayer.`;
  }
}




}