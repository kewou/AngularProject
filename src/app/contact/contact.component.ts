import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  private backendUrl = environment.backendUrl;

  message : MessageDto = {"senderName": "", "senderMail": "", "message": ""}

  successMessage: string | null = null;
  errorMessages: any[] = [];



  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient,private router: Router) {
  }

  ngOnInit(): void {
  }

  sendContactMessage() {
    const url = `${this.backendUrl}/contact`;
    this.errorMessages = []
    this.http.post(url, this.message,this.httpOptions).subscribe(
        response => {
          console.log('Réponse du serveur :', response);
          // Gérez ici la réponse du serveur en cas de succès
          this.successMessage = "Message envoyé avec succès"
          this.router.navigate(['/contact']); // Redirection vers la page de connexion
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
          if (error.status == 500) {
            this.errorMessages.push("Erreur survenue lors de l'envoi du mail")
          }
          this.router.navigate(['/contact']);
        });
        }

  }

  export interface MessageDto {
  senderName: string,
  senderMail: string,
  message: string,
}
