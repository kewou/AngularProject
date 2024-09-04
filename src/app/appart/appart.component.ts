import { Component, OnInit  } from '@angular/core';
import { AppartService } from './service/appart.service';
import { Appart } from './modele/appart';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddAppartDialogComponent } from './add-appart-dialog/add-appart-dialog.component';
import { EditAppartDialogComponent } from './edit-appart-dialog/edit-appart-dialog.component';
import { DeleteAppartDialogComponent } from './delete-appart-dialog/delete-appart-dialog.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LogementService } from '../logement/service/logement.service'

@Component({
  selector: 'app-appart',
  templateUrl: './appart.component.html',
  styleUrls: ['./appart.component.scss']
})
export class AppartComponent implements OnInit{

      apparts: Appart[] = [];
      descriptionLogement:string ='';
      logementRef: string="";
      isModalOpen = false;
      displayedColumns: string[] = ['reference', 'numero', 'prixLoyer', 'prixCaution', 'user'];

       constructor(private route: ActivatedRoute,
          private appartService: AppartService,private location: Location,private logementService:LogementService,
          private dialog: MatDialog,private router: Router
       ) {}

        ngOnInit() : void{
               this.route.paramMap.subscribe(params => {
                   this.logementRef = params.get('logementRef') as string;
                   if(this.logementRef){
                                      this.appartService.getAppartmentsByLogementRef(this.logementRef).subscribe(
                                            (data) => {
                                              this.apparts = data;
                                            },
                                            (error) => {
                                              console.error("Erreur fetching apparts");
                                            }
                                        );

                                    this.logementService.getOneLogement(this.logementRef).subscribe(
                                          (data) => {
                                           this.descriptionLogement= data.description;
                                          },
                                          (error) => {
                                            console.error("Erreur fetching apparts");
                                          }
                                      );
                   }
               })

           }

         closeModal() {
           this.isModalOpen = false;
         }

         openAddAppartDialog(): void {
            const dialogRef = this.dialog.open(AddAppartDialogComponent, {
              width: '520px',
            });

            dialogRef.componentInstance.appartAdded.subscribe((appart: Appart) => {
              this.addAppart(appart);
            });

         }

       openEditAppartDialog(appart: Appart): void {
          const dialogRef = this.dialog.open(EditAppartDialogComponent, {
            width: '520px',
            data: { appart }
          });

          dialogRef.componentInstance.appartUpdated.subscribe((updatedApart: Appart) => {
            this.updateAppart(updatedApart);
          });

       }


         openDeleteAppartDialog(referenceLgt:string): void {
            const dialogRef = this.dialog.open(DeleteAppartDialogComponent, {
              width: '350px',
              data: {reference:referenceLgt},
            });


            dialogRef.afterClosed().subscribe(result => {
                if(result){
                    this.deleteAppart(referenceLgt)
                    }
            });

         }


         addAppart(appart: Appart) {
               this.route.paramMap.subscribe(params => {
                   this.logementRef = params.get('logementRef') as string;
                   if(this.logementRef){
                                      this.appartService.addAppart(this.logementRef,appart).subscribe({
                                         next: (addedAppart) => {
                                           this.apparts.push(addedAppart);
                                         },
                                         error: (error) => {
                                           console.error('Failed to add appart:', error);
                                         }
                                       });
                   }
               })
         }
     
         updateAppart(appart: Appart){
            this.route.paramMap.subscribe(params => {
                this.logementRef = params.get('logementRef') as string;
                    if(this.logementRef){
                       this.appartService.updateAppart(this.logementRef,appart).subscribe({
                         next: (appartUpdated) => {
                           const index = this.apparts.findIndex(l => l.reference === appart.reference);
                           if (index !== -1) {
                             this.apparts[index] = appartUpdated;
                           }
                         },
                         error: (error) => {
                           console.error('Failed to add appart:', error);
                         }
                       });
                   }
               })
        }

       deleteAppart(appartRef: string){
           this.route.paramMap.subscribe(params => {
               this.logementRef = params.get('logementRef') as string;
              if(this.logementRef){
                  this.appartService.deleteAppart(this.logementRef,appartRef).subscribe({
                    next: (appartDeleted) => {
                      this.removeAppartByRef(appartRef);
                    },
                    error: (error) => {
                      console.error('Failed to delete appart:', error);
                    }
                  });
                }
            })
       }

       private removeAppartByRef(appartRef:string): void{
           const index = this.apparts.findIndex(appart => appart.reference === appartRef);

           if (index >= 0) {
               this.apparts.splice(index, 1);
               console.log(`Appart avec la ref ${appartRef} supprimé.`);
           } else {
               console.error(`Appart avec la ref ${appartRef} non trouvé.`);
           }
       }

         viewLoyers(appartRef: string): void {
             this.route.paramMap.subscribe(params => {
                 this.logementRef = params.get('logementRef') as string;
                     if(this.logementRef){
                         this.router.navigate([`/logements/${this.logementRef}/apparts/${appartRef}`]);
                     }
            })
         }

          goBack(): void {
            this.location.back();
          }


}
