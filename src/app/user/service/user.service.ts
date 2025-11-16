import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { CookieService } from "ngx-cookie-service";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { User } from "../modele/user";
import { HttpService } from "../../utils/httpService";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private estConnecte = false;
  private userReference = "";

  constructor(
    readonly httpService: HttpService,
    private readonly cookieService: CookieService,
    private readonly router: Router
  ) {
    // Initialiser la référence utilisateur depuis les cookies
    this.userReference = this.cookieService.get("userReference") || "";
  }

  getUsers(): Observable<any> {
    return this.httpService.get("users");
  }

  loginUser(loginPassObject: any): Observable<any> {
    return this.httpService.post("authenticate", loginPassObject);
  }

  logout(): void {
    try {
      // Supprimer tous les cookies de session
      this.cookieService.delete("jwtToken");
      this.cookieService.delete("userReference");

      // Réinitialiser l'état interne
      this.estConnecte = false;
      this.userReference = "";

      console.log("Token deleted and user logged out successfully.");

      // Naviguer vers la page d'accueil
      this.router
        .navigate([""])
        .then(() => {
          // Forcer le rechargement de la page pour s'assurer que l'état est mis à jour
          window.location.reload();
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la navigation après déconnexion:",
            error
          );
          // En cas d'erreur, forcer le rechargement
          window.location.href = "/";
        });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // En cas d'erreur, forcer la navigation
      window.location.href = "/";
    }
  }

  estUtilisateurConnecte(): boolean {
    try {
      const token = this.cookieService.get("jwtToken");
      const userRef = this.cookieService.get("userReference");

      // Vérifier que les deux cookies existent
      if (!token || !userRef) {
        this.estConnecte = false;
        return false;
      }

      // Vérifier si le token est expiré
      if (this.isTokenExpired(token)) {
        console.log("Token expiré, déconnexion automatique");
        this.cookieService.delete("jwtToken");
        this.cookieService.delete("userReference");
        this.estConnecte = false;
        this.userReference = "";
        return false;
      }

      // Mettre à jour l'état interne
      this.estConnecte = true;
      this.userReference = userRef;
      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification de connexion:", error);
      this.estConnecte = false;
      return false;
    }
  }

  getCurrentUserReference(tokenJwt: string): string {
    try {
      if (!tokenJwt) {
        throw new Error("Token is missing");
      }
      const decodedToken: any = jwtDecode(tokenJwt);
      const referenceUser = decodedToken.reference;
      if (!referenceUser) {
        throw new Error("Reference user information is missing in the token");
      }
      return referenceUser;
    } catch (error) {
      console.error("Error getting user reference:", error);
      return "";
    }
  }

  decodeJwtToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Erreur lors du décodage du token JWT:", error);
      return null;
    }
  }

  getUserInfo(): Observable<any> {
    let endpointUrl = `users/${this.cookieService.get("userReference")}`;
    return this.httpService.get(endpointUrl).pipe(
      catchError((error) => {
        console.error("Error fetching user info:");
        return throwError("Failed to fetch user info");
      })
    );
  }

  updateUser(updatedUser: User): Observable<any> {
    let endpointUrl = `users/${this.cookieService.get("userReference")}`;
    return this.httpService.put(endpointUrl, updatedUser).pipe(
      catchError((error) => {
        console.error("Error fetching update user:");
        return throwError("Failed to update user ");
      })
    );
  }

  searchLocataires(name: string): Observable<User[]> {
    let endpointUrl = `users/${this.cookieService.get("userReference")}/search`;
    const params = new HttpParams().set("name", name);
    return this.httpService.get<User[]>(endpointUrl, params);
  }

  reinitPassword(email: string): Observable<any> {
    let endpointUrl = `users/reset-password`;
    return this.httpService.post(endpointUrl, email).pipe(
      catchError((error) => {
        console.error("Error fetching reinit password:");
        return throwError("Failed to reinit password ");
      })
    );
  }

  private handleForbidden(message: string): void {
    console.error(message);
    this.router.navigate([""]);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp === undefined) return false;

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date.valueOf() < new Date().valueOf();
    } catch (err) {
      return false;
    }
  }

  public saveUserAuthenticationInfo(tokenJwt: string) {
    try {
      // Sauvegarder le token JWT
      this.cookieService.set(
        "jwtToken",
        tokenJwt,
        undefined,
        undefined,
        undefined,
        true,
        "Lax"
      );

      // Récupérer et sauvegarder la référence utilisateur
      const userReference = this.getCurrentUserReference(tokenJwt);
      if (!userReference) {
        throw new Error("Impossible de récupérer la référence utilisateur");
      }
      this.cookieService.set(
        "userReference",
        userReference,
        undefined,
        undefined,
        undefined,
        true,
        "Lax"
      );

      // Mettre à jour l'état interne
      this.estConnecte = true;
      this.userReference = userReference;

      console.log("Informations d'authentification sauvegardées avec succès");
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde des informations d'authentification:",
        error
      );
      throw error;
    }
  }

  public redirectToRoleBasedPage(tokenJwt: string): void {
    let userAuthority = "";
    try {
      const decodedToken: any = jwtDecode(tokenJwt);

      if (
        decodedToken.roles &&
        Array.isArray(decodedToken.roles) &&
        decodedToken.roles.length > 0
      ) {
        userAuthority = decodedToken.roles[0].authority;
      }

      // Redirection selon le rôle
      switch (userAuthority) {
        case "ADMIN":
        case "BAILLEUR":
          this.router.navigate(["/bailleur/logements"]);
          break;
        case "LOCATAIRE":
          this.router.navigate(["/locataire"]);
          break;
        default:
          console.error("Rôle utilisateur inconnu :", userAuthority);
          this.router.navigate(["/unauthorized"]);
          break;
      }
    } catch (error) {
      console.error("Erreur lors du décodage du token JWT", error);
      this.router.navigate(["/unauthorized"]);
    }
  }
}
