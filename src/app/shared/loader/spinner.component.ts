import {Component, OnInit} from '@angular/core';
import {LoaderService} from './loader.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
    loading$!: Observable<boolean>;

    constructor(private loaderService: LoaderService) {
    }

    ngOnInit(): void {
        this.loading$ = this.loaderService.loading$;
    }
}

