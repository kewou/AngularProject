import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ContactComponent } from './contact/contact.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { CompteUserComponent } from './compte-user/compte-user.component';
import { AProposComponent } from './a-propos/a-propos.component';
import { LogementComponent } from './logement/logement.component';
import { AppartComponent } from './appart/appart.component';
import { LoyerComponent } from './loyer/loyer.component';
import { ConfirmationRegisterComponent } from './inscription/confirmation-register/confirmation-register.component';
import { AuthGuard } from './authentication.guard';
import {NotFoundComponent} from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'a-propos', component: AProposComponent},
  { path: 'confirmation-inscription', component: ConfirmationRegisterComponent},
  { path: 'compte-user', component: CompteUserComponent,canActivate: [AuthGuard] },
  { path: 'bailleur/logements', component: LogementComponent,canActivate: [AuthGuard], data: { breadcrumb: 'Mes logements' } },
  { path: 'bailleur/logements/:logementRef/apparts', component: AppartComponent ,canActivate: [AuthGuard], data: { breadcrumb: 'Mes appartements' } },
  { path: 'bailleur/logements/:logementRef/apparts/:appartRef', component: LoyerComponent ,canActivate: [AuthGuard], data: { breadcrumb: 'Historique des loyers' }},
  { path: '**', component: NotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
