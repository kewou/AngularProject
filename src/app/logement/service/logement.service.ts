import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { Router } from "@angular/router";
import { UserService } from "../../user/service/user.service";
import { CookieService } from "ngx-cookie-service";
import { catchError } from "rxjs/operators";
import { Logement } from "../modele/logement";
import { HttpService } from "../../utils/httpService";

@Injectable({
  providedIn: "root",
})
export class LogementService {
  constructor(
    readonly httpService: HttpService,
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService
  ) {}

  getLogements(): Observable<any> {
    const userReference = this.getUserReference();
    const url = `bailleur/users/${userReference}/logements`;
    return this.httpService.get(url).pipe(
      catchError((error) => {
        console.error("Error fetching user logements:");
        return throwError("Failed to fetch user logements");
      })
    );
  }

  getOneLogement(logementRef: string): Observable<any> {
    const userReference = this.getUserReference();
    const url = `bailleur/users/${userReference}/logements/${logementRef}`;
    return this.httpService.get(url).pipe(
      catchError((error) => {
        console.error("Error fetching user logement:");
        return throwError("Failed to fetch user logement");
      })
    );
  }

  addLogement(logement: Logement): Observable<any> {
    const userReference = this.getUserReference();
    const url = `bailleur/users/${userReference}/logements/create`;

    return this.httpService.post(url, logement).pipe(
      catchError((error) => {
        console.error("Error adding logement:", error);
        return throwError("Failed to add logement");
      })
    );
  }

  updateLogement(updatedLogement: Logement): Observable<any> {
    const userReference = this.getUserReference();
    const url = `bailleur/users/${userReference}/logements/${updatedLogement.reference}`;

    return this.httpService.put(url, updatedLogement).pipe(
      catchError((error) => {
        console.error("Error adding logement:", error);
        return throwError("Failed to add logement");
      })
    );
  }

  deleteLogement(refLogement: string): Observable<any> {
    const userReference = this.getUserReference();
    const url = `bailleur/users/${userReference}/logements/${refLogement}`;

    return this.httpService.delete(url).pipe(
      catchError((error) => {
        console.error("Error deleteting logement:", error);
        return throwError("Failed to delete logement");
      })
    );
  }

  private getUserReference(): string {
    const userReference = this.cookieService.get("userReference");
    if (!userReference) {
      throw new Error("User reference is not available");
    }
    return userReference;
  }
}
