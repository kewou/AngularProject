import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ContactComponent } from './contact/contact.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { CompteUserComponent } from './compte-user/compte-user.component';
import { AProposComponent } from './a-propos/a-propos.component';
import { LogementComponent } from './logement/logement.component';


const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'compte-user', component: CompteUserComponent },
  { path: 'a-propos', component: AProposComponent },
  { path: 'logements', component: LogementComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
