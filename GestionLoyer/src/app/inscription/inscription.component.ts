import { Component, OnInit } from '@angular/core';
import { User } from '../user/modele/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  user: User;
  private backendUrl = environment.backendUrl;

  constructor(private http: HttpClient,private router: Router) {
    this.user = { name: '', lastName: '', email: '', phone: '', password: ''  };
  }

  ngOnInit(): void {
  }

    submitForm() {
      const url = `${this.backendUrl}/users/create`;
      this.http.post(url, this.user).subscribe(
        response => {
          console.log('Réponse du serveur :', response);
          // Gérez ici la réponse du serveur en cas de succès
            this.router.navigate(['/connexion']); // Redirection vers la page de connexion
        },
        (error) => {
          console.error('Erreur lors de l\'envoi de la requête :', error);
          // Gérez ici les erreurs de la requête
        }
      );
    }

}
