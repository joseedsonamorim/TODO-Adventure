import {  AppService } from './../service/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-hero-jorney',
  templateUrl: './dialog-hero-jorney.component.html',
  styleUrls: ['./dialog-hero-jorney.component.scss']
})
export class DialogHeroJorneyComponent implements OnInit {

  constructor(   public appService: AppService) { }

  jorneys: any[] = [];
  panelOpenState = false;

  ngOnInit(): void {
    this.appService.getJounerys().subscribe(
      data => {
        console.log( data);
        // console.log( typeof data);

        // let aux = [data]
        this.jorneys = Object.keys(data);
        console.log(this.jorneys);

      },
      error => {

      }
    )
  }

  openJorney(jorney: string){
    this.appService.getJourney(jorney).subscribe(
      data => {
        console.log(data);

      }
    )
  }

}
