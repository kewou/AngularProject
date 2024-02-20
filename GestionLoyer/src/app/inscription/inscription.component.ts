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

  user: User = { name: "", lastName: "", email: "", phone: "", password: ""  };

  private backendUrl = environment.backendUrl;
  errorMessage: string | null = null;

  constructor(private http: HttpClient,private router: Router) {
  }

  ngOnInit(): void {
  }

  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
  };

  registerSubmit() {
    debugger
    this.errorMessage = null;
    if (this.user.name==='' || this.user.lastName==='' || this.user.phone==='' || this.user.email===''|| this.user.password==='') {
      this.errorMessage = "Veuillez remplir tous les champs requis.";
      return;
    }
      const url = `${this.backendUrl}/users/create`;
      this.http.post(url, this.user,this.httpOptions).subscribe(
        response => {
          console.log('Réponse du serveur :', response);
          // Gérez ici la réponse du serveur en cas de succès
            this.router.navigate(['/connexion']); // Redirection vers la page de connexion
        },
        (error) => {
          console.error('Erreur lors de l\'envoi de la requête :', error);
          this.errorMessage="Une erreur s'est produite :" + error;
        }
      );
    }

}
