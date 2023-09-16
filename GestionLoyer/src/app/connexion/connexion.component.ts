import { Component, OnInit } from '@angular/core';
import { User } from '../user/modele/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  username: string="";
  password: string="";

  private backendUrl = environment.backendUrl;

  constructor(private http: HttpClient,private router: Router) {

  }

  ngOnInit(): void {
  }

  submitForm() {
    const url = `${this.backendUrl}/authenticate`;
    this.http.post(url, {username:this.username,password:this.password}).subscribe(
      response => {
        console.log('Réponse du serveur :', response);
        // Gérez ici la réponse du serveur en cas de succès
          this.router.navigate(['/locataire']); // Redirection vers la page de connexion
      },
      (error) => {
        console.error('Erreur lors de l\'envoi de la requête :', error);
        // Gérez ici les erreurs de la requête
      }
    );
  }

}
