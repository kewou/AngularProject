import { Component, OnInit,AfterViewInit, ViewChild, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';

//declare var $: any;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
      //this.loadScript('assets/js/main.js');
  }

loadScript(src: string) {
  const script = this.renderer.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.onload = () => {

  };
  this.renderer.appendChild(document.body, script);
}


}
