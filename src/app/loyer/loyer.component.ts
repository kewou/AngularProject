import { Component, OnInit,OnChanges, SimpleChanges  } from '@angular/core';
import { AppartService } from '../appart/service/appart.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Loyer } from './modele/loyer';
import { Appart } from '../appart/modele/appart';
import {Transaction } from './modele/transaction';
import { LoyerService } from './service/loyer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VersementDialogComponent} from './versement/versement-dialog.component';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-loyer',
  templateUrl: './loyer.component.html',
  styleUrls: ['./loyer.component.scss']
})
export class LoyerComponent implements OnInit, OnChanges {

      appart: Appart = {
         reference: '',
         numero: 0,
         prixLoyer: 0,
         prixCaution: 0,
         user: null,
         loyers: []
      };
     logementRef: string="";
     appartRef: string="";
     transactionForm: FormGroup;



    constructor(private route: ActivatedRoute,
       private appartService: AppartService,private loyerService:LoyerService,
       private router: Router,private dialog: MatDialog,private location: Location,
       private fb: FormBuilder){

               this.transactionForm = this.fb.group({
                 reference: [''],
                 montantVerser: ['', [Validators.required,CustomValidators.noSpecialCharacters()]]
               });
       }

    ngOnInit() : void{
           this.route.paramMap.subscribe(params => {
               this.logementRef = params.get('logementRef') as string;
               this.appartRef = params.get('appartRef') as string;
               if(this.logementRef && this.appartRef){
                                  this.appartService.getAppartmentByLogementRefAndAppartRef(this.logementRef,this.appartRef).subscribe(
                                        (data) => {
                                          this.appart = data;
                                          this.updateValidators();
                                          this.sortLoyersByDate();
                                        },
                                        (error) => {
                                          console.error("Erreur fetching loyers");
                                        }
                                    );
               }
           });



       }

     ngOnChanges(changes: SimpleChanges): void {
       if (changes['appart'] && !changes['appart'].isFirstChange()) {
         this.updateValidators();
       }
     }

   updateValidators(): void {
     const montantControl = this.transactionForm.get('montantVerser');
     if (montantControl) {
       montantControl.setValidators([
         Validators.required,
         CustomValidators.multipleOf(this.appart.prixLoyer),
         CustomValidators.noSpecialCharacters(),
         CustomValidators.minimumAmount(this.appart.prixLoyer)
       ]);
       montantControl.updateValueAndValidity();
     }
   }

     sortLoyersByDate(): void {
       this.appart.loyers.sort((a, b) => {
         return new Date(a.dateLoyer).getTime() - new Date(b.dateLoyer).getTime();
       });
     }

   openVersementDialog(){
       if (this.transactionForm.invalid) {
           this.transactionForm.markAllAsTouched(); // Marquer tous les champs comme "touchés" pour déclencher la validation
         return;
       }
       const montant = this.transactionForm.get('montantVerser')?.value;
       const transaction: Transaction = {
         reference: '',
         montantVerser: montant

       };


       const dialogRef = this.dialog.open(VersementDialogComponent, {
         width: '450px',
         data: { amount: montant}
       });

       dialogRef.afterClosed().subscribe(result => {
           if(result){
               this.doTransaction(transaction);
               }
           else {
                        console.log('Versement annulé');
                      }
       });
   }

     formatAmount(amount: number): string {
       if (amount >= 1000000) {
         return (amount / 1000000).toFixed(1) + ' M'; // Million
       } else if (amount >= 1000) {
         return (amount / 1000).toFixed(1) + ' K'; // Mille
       } else {
         return amount.toString(); // Moins de mille
       }
     }

   doTransaction(transaction:Transaction){
        this.loyerService.newTransaction(this.appart.reference,transaction).subscribe({
                                                     next: (addedAppart) => {
                                                       this.ngOnInit()
                                                     },
                                                     error: (error) => {
                                                       console.error('Failed to do transaction:', error);
                                                     }
                                                   });
       }

     goBack(): void {
       this.location.back();
     }



}
