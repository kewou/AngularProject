import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '../modules/http/http.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { MenuComponent } from './menu/menu.component';
import { AppRoutingModule } from './app-routing.module';
import { AccueilComponent } from './accueil/accueil.component';
import { ContactComponent } from './contact/contact.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatIconModule } from '@angular/material/icon';
import { CompteUserComponent } from './compte-user/compte-user.component';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { MatchPasswordDirective } from './directives/match-password.directive';
import { AProposComponent } from './a-propos/a-propos.component';
import { LogementComponent } from './logement/logement.component';
import { AppartComponent } from './appart/appart.component';
import { EditLogementDialogComponent } from './logement/edit-logement-dialog/edit-logement-dialog.component';
import { DeleteLogementDialogComponent } from './logement/delete-logement-dialog/delete-logement-dialog.component';
import { AddLogementDialogComponent } from './logement/add-logement-dialog/add-logement-dialog.component';
import { AddAppartDialogComponent } from './appart/add-appart-dialog/add-appart-dialog.component';
import { EditAppartDialogComponent } from './appart/edit-appart-dialog/edit-appart-dialog.component';
import { DeleteAppartDialogComponent } from './appart/delete-appart-dialog/delete-appart-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { LoyerComponent } from './loyer/loyer.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { VersementDialogComponent } from './loyer/versement/versement-dialog.component';

import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './authentication.guard';
import { UserService } from './user/service/user.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { EditProfilUserDialogComponent } from './compte-user/edit-profil-user-dialog/edit-profil-user-dialog.component';
import { ConfirmationRegisterComponent } from './inscription/confirmation-register/confirmation-register.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MenuComponent,
    AccueilComponent,
    ContactComponent,
    InscriptionComponent,
    ConnexionComponent,
    LoginRegisterComponent,
    ResetPasswordComponent,
    CompteUserComponent,
    LogoutDialogComponent,
    MatchPasswordDirective,
    AProposComponent,
    LogementComponent,
    AppartComponent,
    EditLogementDialogComponent,
    DeleteLogementDialogComponent,
    AddLogementDialogComponent,
    AddAppartDialogComponent,
    EditAppartDialogComponent,
    DeleteAppartDialogComponent,
    LoyerComponent,
    VersementDialogComponent,
    NotFoundComponent,
    EditProfilUserDialogComponent,
    ConfirmationRegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' },UserService,AuthGuard,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
