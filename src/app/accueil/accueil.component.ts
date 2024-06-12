import { Component, OnInit,AfterViewInit, ViewChild, ElementRef } from '@angular/core';


//declare var $: any;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  /*
  constructor(private elementRef: ElementRef) {
    this.slick = undefined;
  }


  @ViewChild('slick', { static: true }) slick!: ElementRef | undefined;

  ngAfterViewInit(): void {
    const slickElement = this.elementRef.nativeElement.querySelector('.slick-carousel');
    if (slickElement) {
      $(slickElement).slick({
        // Options de configuration de Slick Carousel
        infinite: false,
        slidesToShow: 2,
        autoplay: true,
        autoplaySpeed: 2000,
        dots: false,
        prevArrow: false, // Désactiver le bouton "prev"
        nextArrow: false // Désactiver le bouton "next"
      });
    }
  }
  */
  ngOnInit(): void {}


}
