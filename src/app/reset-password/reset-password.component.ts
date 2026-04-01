import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpService } from '../utils/httpService'
import { Router, ActivatedRoute } from "@angular/router";

interface ResetPasswordForm {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  formData: ResetPasswordForm = {
    email: "",
    password: "",
    confirmPassword: ""
  };
  isResetMode: boolean = false;
  url: string = "users/reset-password";
  updatePasswordUrl: string = "users/update-password";
  showPass: boolean = false;
  showConfirmPass: boolean = false;
  errorMessages: any[] = [];
  errorMessage: string | null = null;
  verificationToken: string | null = null;

  constructor(
    readonly httpService: HttpService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if there's an email parameter in the URL
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.formData.email = params['email'];
        this.verificationToken = this.route.snapshot.fragment;
        this.isResetMode = true;
      }
    });
  }

  sentMailResetPasswordSubmit(): void {
    this.errorMessage = null;
    const email = this.formData.email?.trim();
    this.httpService.post(this.url, { email }).subscribe(
      () => {
        this.router.navigate(['/confirmation-sent-mail-reset-password']);
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = this.getReadableError(error);
      }
    );
  }

  updatePasswordSubmit(): void {
    this.errorMessages = []
    this.errorMessage = null;
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessages.push("Les mots de passe ne correspondent pas");
      return;
    }

    if (!this.verificationToken) {
      this.errorMessage = "Le lien de reinitialisation est invalide. Veuillez recommencer la procedure.";
      return;
    }

    const data = {
      email: this.formData.email,
      password: this.formData.password,
      verificationToken: this.verificationToken,
    };

    this.httpService.post(this.updatePasswordUrl, data).subscribe(
      () => {
        // Redirect to login page after successful password update
        this.router.navigate(['/login']);
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = this.getReadableError(error);
      }
    );
  }

  private getReadableError(error: HttpErrorResponse): string {
    const backendMessage = error?.error?.message;
    if (backendMessage && typeof backendMessage === 'string') {
      if (backendMessage.toLowerCase().includes('client not found')) {
        return 'Cette fonctionnalite ne fonctionne pas pour le moment. Veuillez reessayer plus tard.';
      }
      return backendMessage;
    }
    return this.httpService.getErrorMessage(error.status);
  }

  showPassword() {
    this.showPass = !this.showPass
  }

  showConfirmPassword() {
    this.showConfirmPass = !this.showConfirmPass
  }
}
