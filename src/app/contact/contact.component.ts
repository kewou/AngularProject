import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";
import { HttpService } from '../utils/httpService'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  message : MessageDto = {"senderName": "", "senderMail": "", "senderMessage": ""}

  isMessageSent = false;

  successMessage: string | null = null;

  errorMessages: any[] = [];

  constructor(readonly httpService:HttpService, private router: Router) {
  }

  sendContactMessage() {
    this.errorMessages = []
    let sendMessage = {"senderName": this.message.senderName, "senderMail": this.message.senderMail, "message": this.message.senderMessage}
    this.httpService.post("contact", sendMessage).subscribe(
        response => {
          console.log('Réponse du serveur :', response);
          // Simuler l'envoi réussi du message
          this.isMessageSent = true;
          // Gérez ici la réponse du serveur en cas de succès
          this.successMessage = "Message envoyé avec succès"
            setTimeout(() => {
              this.router.navigate(['']);
            }, 4000000); // 3000ms = 3 secondes, redirection vers la page d'accueil
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
          if (error.status == 500 || error.status == 0) {
            this.errorMessages.push("Erreur survenue lors de l'envoi du mail, nous allons résoudre ce problème dans les plus bref délais")
          }
          this.router.navigate(['/contact']);
        });
        }

  }

  export interface MessageDto {
  senderName: string,
  senderMail: string,
  senderMessage: string,
}
