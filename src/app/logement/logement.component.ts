import { Component, OnInit  } from '@angular/core';
import { LogementService } from './service/logement.service';
import { Logement } from './modele/logement';
import { MatDialog } from '@angular/material/dialog';
import { AddLogementDialogComponent } from './add-logement-dialog/add-logement-dialog.component';
import { EditLogementDialogComponent } from './edit-logement-dialog/edit-logement-dialog.component';
import { DeleteLogementDialogComponent } from './delete-logement-dialog/delete-logement-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-logement',
  templateUrl: './logement.component.html',
  styleUrls: ['./logement.component.scss']
})


export class LogementComponent implements OnInit{

    logements: Logement[]=[];
    logement: Logement = {
        reference: '',
        quartier: '',
        ville: '',
        description: ''
    };

    isModalOpen = false;

    constructor(private logementService: LogementService,private dialog: MatDialog,private router: Router){}

    ngOnInit() : void{
        this.logementService.getLogements().subscribe(
              (data) => {
                this.logements = data;
              },
              (error) => {
                console.error("Erreur fetching logements");
              }
          );
    }

  openAddLogementDialog(event: Event): void {
     event.preventDefault();
     const dialogRef = this.dialog.open(AddLogementDialogComponent, {
       width: '520px',
     });

     dialogRef.componentInstance.logementAdded.subscribe((logement: Logement) => {
       this.addLogement(logement);
     });

  }


  openEditLogementDialog(logement: Logement): void {
     const dialogRef = this.dialog.open(EditLogementDialogComponent, {
       width: '520px',
       data: { logement }
     });

     dialogRef.componentInstance.logementUpdated.subscribe((updatedLogement: Logement) => {
       this.updateLogement(updatedLogement);
     });

  }


    openDeleteLogementDialog(referenceLgt:string): void {
       const dialogRef = this.dialog.open(DeleteLogementDialogComponent, {
         width: '350px',
         data: {reference:referenceLgt},
       });


       dialogRef.afterClosed().subscribe(result => {
           if(result){
               this.deleteLogement(referenceLgt)
               }
       });

    }

  closeModal() {
    this.isModalOpen = false;
  }

    addLogement(logement: Logement) {
      this.logementService.addLogement(logement).subscribe({
        next: (addedLogement) => {
          this.logements.push(addedLogement);
        },
        error: (error) => {
          console.error('Failed to add logement:', error);
        }
      });
    }

    updateLogement(logement: Logement){
      this.logementService.updateLogement(logement).subscribe({
        next: (logementUpdated) => {
          const index = this.logements.findIndex(l => l.reference === logement.reference);
          if (index !== -1) {
            this.logements[index] = logementUpdated;
          }
        },
        error: (error) => {
          console.error('Failed to add logement:', error);
        }
      });
   }

    deleteLogement(logementRef: string){
      this.logementService.deleteLogement(logementRef).subscribe({
        next: (logementDeleted) => {
          this.removeLogementByRef(logementRef);
        },
        error: (error) => {
          console.error('Failed to delete logement:', error);
        }
      });
    }

    private removeLogementByRef(refLgt:string): void{
        const index = this.logements.findIndex(logement => logement.reference === refLgt);

        if (index >= 0) {
            this.logements.splice(index, 1);
            console.log(`Logement avec la ref ${refLgt} supprimé.`);
        } else {
            console.error(`Logement avec la ref ${refLgt} non trouvé.`);
        }
    }



      viewApparts(logementRef: string): void {
        this.router.navigate([`/logements/${logementRef}/apparts`]);
      }





}
