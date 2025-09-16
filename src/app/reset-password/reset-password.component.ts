import { Component, OnInit } from '@angular/core';
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
        this.verificationToken = this.router.url.toString().split('#')[1];
        this.isResetMode = true;
      }
    });
  }

  sentMailResetPasswordSubmit(): void {
    console.log("Envoi du mail avec changement de mot de passe", this.formData.email);
    this.httpService.post(this.url, this.formData.email).subscribe(
      response => {
        this.router.navigate(['/confirmation-sent-mail-reset-password']);
      },
      error => {
        this.router.navigate(['/password-reset']);
      }
    );
  }

  updatePasswordSubmit(): void {
    this.errorMessages = []
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessages.push("Les mots de passe ne correspondent pas");
      return;
    }

    const data = {
      email: this.formData.email,
      password: this.formData.password,
      verificationToken: this.verificationToken,
    };

    this.httpService.post(this.updatePasswordUrl, data).subscribe(
      response => {
        // Redirect to login page after successful password update
        this.router.navigate(['/login']);
      },
      error => {
        console.error("Erreur lors de la mise à jour du mot de passe", error);
      }
    );
  }

  showPassword() {
    this.showPass = !this.showPass
  }

  showConfirmPassword() {
    this.showConfirmPass = !this.showConfirmPass
  }
}
