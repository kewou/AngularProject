import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { UserService } from '../../user/service/user.service';
import { catchError } from 'rxjs/operators';
import { Appart, UpdateAppartRequest, User, Bail } from '../modele/appart';
import { HttpService } from '../../utils/httpService';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppartService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService
  ) {}

  getAppartsByLogement(logementRef: string): Observable<Appart[]> {
    const userReference = this.getUserReferenceOrThrow();
    const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts`;
    return this.httpService.get<Appart[]>(url).pipe(
      catchError(err => throwError(() => err))
    );
  }

  private getUserReferenceOrThrow(): string {
    const ref = this.userService.getCurrentUserReference('userReference');
    if (!ref) throw new Error('User reference is not available');
    return ref;
  }

  addAppart(logementRef: string, appart: Appart): Observable<any> {
    const userReference = this.getUserReferenceOrThrow();
    const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/create`;

    return this.httpService.post(url, appart).pipe(
      catchError(error => {
        console.error('Error adding appart:', error);
        return throwError(() => 'Failed to add appart');
      })
    );
  }

  updateAppart(logementRef: string, appart: Appart): Observable<any> {
    const userReference = this.getUserReferenceOrThrow();
    const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/${appart.reference}`;

    // récupère le bail actif si présent
    const bailActif: Bail | undefined = appart.baux?.find(b => b.actif);

    const payload: UpdateAppartRequest = {
      reference: appart.reference,
      nom: appart.nom,
      prixLoyer: appart.prixLoyer,
      prixCaution: appart.prixCaution,
      bailleurId: bailActif
        ? bailActif.locataire.reference
        : appart.bailleur?.reference!
    };

    return this.httpService.put<Appart>(url, payload).pipe(
      catchError(error => {
        console.error('Error updating appart:', error);
        return throwError(() => 'Failed to update appart');
      })
    );
  }

  deleteAppart(logementRef: string, appartReference: string): Observable<any> {
    const userReference = this.getUserReferenceOrThrow();
    const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/${appartReference}`;

    return this.httpService.delete(url).pipe(
      catchError(error => {
        console.error('Error deleting appart:', error);
        return throwError(() => 'Failed to delete appart');
      })
    );
  }

  getAppartByRef(logementRef: string, appartRef: string): Observable<Appart> {
    const userReference = this.getUserReferenceOrThrow();
    const url = `bailleur/users/${userReference}/logements/${logementRef}/apparts/${appartRef}`;
    return this.httpService.get<Appart>(url).pipe(
      catchError(err => throwError(() => err))
    );
  }

  searchLocatairesByName(name: string): Observable<User[]> {
    const params = new HttpParams()
      .set('role', 'LOCATAIRE')
      .set('nom', name);

    return this.httpService.get<User[]>('users/search', params).pipe(
      catchError(err => {
        console.error('Error searching locataires:', err);
        return throwError(() => 'Failed to search locataires');
      })
    );
  }
}
