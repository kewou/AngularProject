import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user/service/user.service';

@Component({
  selector: 'app-login-success',
  template: '<p>Connexion en cours...</p>',
})
export class LoginSuccessComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router,private userService: UserService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
            this.userService.saveUserAuthenticationInfo(token);
            this.userService.redirectToRoleBasedPage(token);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
