import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../utils/httpService';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {

  user: UserInscriptionDto = { firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: ""  };

  errorMessage: string | null = null;

  errorMessages: any[] = [];

  showPass: boolean = false
  showConfirmPass: boolean = false

  constructor(readonly httpService:HttpService, private router: Router) {
  }

  showPassword() {
    this.showPass = !this.showPass;
  }

  showConfirmPassword() {
    this.showConfirmPass = !this.showConfirmPass
  }

  registerLocataire()  {
    return this.registerSubmit("users/create-locataire")
  }

  registerBailleur()  {
    return this.registerSubmit("users/create-bailleur")
  }

  registerAdmin()  {
    return this.registerSubmit("users/create-admin")
  }

  registerSubmit(url: string = "users/create-bailleur") {
    this.errorMessages = []
    let userToSubmit = {name: this.user.firstName, lastName: this.user.lastName, email: this.user.email, phone: this.user.phone, password: this.user.password}
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

}

export interface UserInscriptionDto {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string,
}


