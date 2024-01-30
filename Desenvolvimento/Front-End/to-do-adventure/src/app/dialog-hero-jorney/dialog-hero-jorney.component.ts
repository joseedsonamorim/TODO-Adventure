import {  AppService } from './../service/app.service';
import { Component, OnInit } from '@angular/core';
import Mission from '../shared/models/mission-model';

@Component({
  selector: 'app-dialog-hero-jorney',
  templateUrl: './dialog-hero-jorney.component.html',
  styleUrls: ['./dialog-hero-jorney.component.scss']
})
export class DialogHeroJorneyComponent implements OnInit {

  constructor(   public appService: AppService) { }

  jorneys: any[] = [];
  taskes: any[] = [];
  panelOpenState = false;
  panelOpenStates: boolean[] = [];
  flagNovaJornada: boolean = false;
  actionJornada: string = 'Nova Jornada';
  mission: Mission = {
    'title': '',
    'difficulty': '',
    'description': '',
    'deadline': ''
  };
  deadline?: string;
  selectedDifficulty: string = "Fácil";




  ngOnInit(): void {
    this.appService.getJounerys().subscribe(
      data => {

        this.jorneys = Object.keys(data);

      },
      error => {

      }
    )
  }

  openJorney(jorney: string){
    this.taskes = [];
    this.appService.getJourney(jorney).subscribe(
      data => {
        this.taskes = data.jornada.tarefas;
        // console.log(this.taskes);

      }
    )
  }
  expandido(event: any){
    console.log(event);

  }

  novaJornada(){
   this.flagNovaJornada = !this.flagNovaJornada;
   this.actionJornada = this.flagNovaJornada ? 'Cancelar' : 'Nova Jornada';
  }

}
