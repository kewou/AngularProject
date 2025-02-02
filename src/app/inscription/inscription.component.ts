import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../utils/httpService';
import { UserInscriptionDto } from './userInscriptionDto';




@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {

  user: UserInscriptionDto = { firstName: "", lastName: "", email: "", role: "", password: "", confirmPassword: ""  };
  errorMessage: string | null = null;

  errorMessages: any[] = [];

  showPass: boolean = false
  showConfirmPass: boolean = false

  constructor(readonly httpService:HttpService, private router: Router) {
      this.user.role = "BAILLEUR"
  }

  showPassword() {
    this.showPass = !this.showPass;
  }

  showConfirmPassword() {
    this.showConfirmPass = !this.showConfirmPass
  }


  registerUser() {
    this.errorMessages = []
    let url = this.getUrlByRole(this.user.role);
    let userToSubmit = {name: this.user.firstName, lastName: this.user.lastName, email: this.user.email, password: this.user.password}
    this.httpService.post(url,userToSubmit)
            .subscribe(
                response => {
                  console.log('Réponse du serveur :', response);
                  // Gérez ici la réponse du serveur en cas de succès
                  this.router.navigate(['/confirmation-inscription']); // Redirection vers la page de connexion
                },
                (error) => {
                  console.error('Erreur lors de l\'envoi de la requête :', error);
                  let errorResponse = error.error;
                  if (errorResponse) {
                    let formErrors = errorResponse.errors;
                    if (formErrors != null) {
                      for (const element of formErrors) {
                        this.errorMessages.push(element.defaultMessage);
                      }
                    }
                  }
                  this.errorMessages.push(this.httpService.getErrorMessage(error.status));
                }
            );
  }

  getUrlByRole(role:string) : string {
      if (this.user.role === 'BAILLEUR') {
        return "users/create-bailleur";
      } else if (this.user.role === 'LOCATAIRE') {
        return "users/create-locataire";
      } else {
         console.error('Rôle utilisateur non valide');
         return "";

      }
  }

}



