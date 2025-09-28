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

    private buildOptions(params?: HttpParams, customHeaders?: HttpHeaders): { headers?: HttpHeaders; params?: HttpParams } {
      let headers = customHeaders || new HttpHeaders({
      'Content-Type': 'application/json'
      });

      // 👉 Exemple : ajouter automatiquement un token si présent dans localStorage
      const token = localStorage.getItem('jwt');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      return { headers, params };
    }


  get<T>(endpoint: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.backendUrl}/${endpoint}`, this.buildOptions(params, headers));
  }

  post<T>(endpoint: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.backendUrl}/${endpoint}`, body, this.buildOptions(params, headers));
  }

  put<T>(endpoint: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.backendUrl}/${endpoint}`, body, this.buildOptions(params, headers));
  }

  delete<T>(endpoint: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.backendUrl}/${endpoint}`, this.buildOptions(params, headers));
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