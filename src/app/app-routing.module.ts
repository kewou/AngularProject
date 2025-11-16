import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccueilComponent } from "./accueil/accueil.component";
import { ContactComponent } from "./contact/contact.component";
import { ConnexionComponent } from "./connexion/connexion.component";
import { LoginRegisterComponent } from "./login-register/login-register.component";
import { CompteUserComponent } from "./compte-user/compte-user.component";
import { AProposComponent } from "./a-propos/a-propos.component";
import { LogementComponent } from "./logement/logement.component";
import { AppartComponent } from "./appart/appart.component";
import { ConfirmationRegisterComponent } from "./inscription/confirmation-register/confirmation-register.component";
import { AuthGuard } from "./authentication.guard";
import { NotFoundComponent } from "./not-found/not-found.component";
import { LoginSuccessComponent } from "./connexion/login-success.component";
import { HistoriqueComponent } from "./historique/historique.component";
import { LogementTransactionsComponent } from "./logement-transactions/logement-transactions.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ConfirmationSentMailResetPasswordComponent } from "./reset-password/confirmation-sent-mail-reset-password/confirmation-sent-mail-reset-password.component";
import { LocataireComponent } from "./locataire/locataire.component";
import { HistoriqueLocataireComponent } from "./locataire/historique-locataire/historique-locataire.component";
import { DebugTestComponent } from "./debug-test/debug-test.component";

const routes: Routes = [
  { path: "", component: AccueilComponent },
  { path: "contact", component: ContactComponent },
  { path: "login", component: LoginRegisterComponent },
  { path: "connexion", component: ConnexionComponent },
  { path: "login/success", component: LoginSuccessComponent },
  { path: "password-reset", component: ResetPasswordComponent },
  {
    path: "confirmation-sent-mail-reset-password",
    component: ConfirmationSentMailResetPasswordComponent,
  },
  { path: "a-propos", component: AProposComponent },
  {
    path: "confirmation-inscription",
    component: ConfirmationRegisterComponent,
  },
  {
    path: "compte-user",
    component: CompteUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "bailleur",
    component: AccueilComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Espace bailleur" },
  },
  {
    path: "bailleur/compte-user",
    component: CompteUserComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Mon profil" },
  },
  {
    path: "bailleur/logements",
    component: LogementComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Mes logements" },
  },
  {
    path: "bailleur/logements/:logementRef/apparts",
    component: AppartComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Mes appartements" },
  },
  {
    path: "bailleur/logements/:logementRef/transactions",
    component: LogementTransactionsComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Transactions du logement" },
  },
  {
    path: "bailleur/logements/:logementRef/apparts/:appartRef",
    component: HistoriqueComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Historique des loyers" },
  },
  {
    path: "locataire",
    component: LocataireComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Mon espace locataire" },
  },
  {
    path: "locataire/historique",
    component: HistoriqueLocataireComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Mon historique" },
  },
  {
    path: "locataire/compte-user",
    component: CompteUserComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Mon profil" },
  },
  {
    path: "locataires/:reference",
    component: LocataireComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Mon espace locataire" },
  },
  {
    path: "locataires/:reference/historique",
    component: HistoriqueLocataireComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Mon historique" },
  },
  {
    path: "debug-test",
    component: DebugTestComponent,
  },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
