import { Component, OnInit } from '@angular/core';
import { User } from '../user/modele/user';
import { UserService } from '../user/service/user.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditProfilUserDialogComponent } from './edit-profil-user-dialog/edit-profil-user-dialog.component';

@Component({
  selector: 'app-compte-user',
  templateUrl: './compte-user.component.html',
  styleUrls: ['./compte-user.component.scss']
})
export class CompteUserComponent implements OnInit{

  user: User = { name: "", lastName: "", email: "", phone: "", password: "",role: ""  };

  constructor(private route: ActivatedRoute,private userService: UserService,
      private dialog: MatDialog,private router: Router) {

  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo():void{
    this.userService.getUserInfo().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error("Erreur fetching user info");
      }
    );
  }

  openEditUserProfilDialog(user:User): void{
                const dialogRef = this.dialog.open(EditProfilUserDialogComponent, {
                  width: '520px',
                  data: { user }
                });

                dialogRef.componentInstance.userUpdated.subscribe((updatedUser: User) => {
                  this.updateUser(updatedUser);
                });
            }

 updateUser(user: User){

           this.userService.updateUser(user).subscribe({
             next: (userUpdated) => {
                this.user= userUpdated;
             },
             error: (error) => {
               console.error('Failed to update user:', error);
             }
           });
     }

}
