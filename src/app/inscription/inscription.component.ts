import { Component, OnInit } from '@angular/core';
import { User } from '../user/modele/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  user: UserInscriptionDto = { firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: ""  };

  private backendUrl = environment.backendUrl;
  errorMessage: string | null = null;

  errorMessages: any[] = [];

  constructor(private http: HttpClient,private router: Router) {
  }

  ngOnInit(): void {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  registerLocataire()  {
    return this.registerSubmit(`${this.backendUrl}/users/create-locataire`)
  }

  registerBailleur()  {
    return this.registerSubmit(`${this.backendUrl}/users/create-bailleur`)
  }

  registerAdmin()  {
    return this.registerSubmit(`${this.backendUrl}/users/create-admin`)
  }

  registerSubmit(url: string = `${this.backendUrl}/users/create-bailleur`) {
    this.errorMessages = []
    if (this.user.firstName==='' || this.user.lastName==='' || this.user.phone==='' || this.user.email===''|| this.user.password==='') {
      this.errorMessage = "Veuillez remplir tous les champs requis.";
      return;
    }
    let userToSubmit = {name: this.user.firstName, lastName: this.user.lastName, email: this.user.email, phone: this.user.phone, password: this.user.password}
    this.http.post(url, userToSubmit,this.httpOptions).subscribe(
        response => {
          console.log('Réponse du serveur :', response);
          // Gérez ici la réponse du serveur en cas de succès
          this.router.navigate(['/connexion']); // Redirection vers la page de connexion
        },
        (error) => {
          console.error('Erreur lors de l\'envoi de la requête :', error);
          let errorResponse = error.error;
          if (errorResponse) {
            let formErrors = errorResponse.errors;
            if (formErrors != null) {
              for (let i = 0; i < formErrors.length; i++) {
                this.errorMessages.push(formErrors[i].defaultMessage);
              }
            }
          }
          if (error.status == 500 || error.status == 0) {
            this.errorMessages.push("Une erreur s'est produite durant l'inscription")
          }
        }
    );
  }

}

export interface UserInscriptionDto {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string,
}


