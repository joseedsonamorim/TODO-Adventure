import {  AppService } from './../service/app.service';
import { Component, OnInit } from '@angular/core';
import Mission from '../shared/models/mission-model';
import { runInThisContext } from 'vm';

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
  actionAddNovajornada = 'Fechar'
  actionJornada: string = 'Nova Jornada';
  mission: Mission = {
    'title': '',
    'difficulty': '',
    'description': '',
    'deadline': ''
  };
  novaTarefa: any  = null;
  deadline?: string;
  selectedDifficulty: string = "Fácil";
  tarefaNovaJornada: boolean = true;




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
      }
    )
  }

  novaJornada(){
   this.flagNovaJornada = !this.flagNovaJornada;
   this.actionJornada = this.flagNovaJornada ? 'Cancelar' : 'Nova Jornada';
   this.actionAddNovajornada = this.flagNovaJornada ? 'Criar Jornada' : 'Fechar';
  }

  adicionarTarefa(){
    this.tarefaNovaJornada = !this.tarefaNovaJornada;
    return this.tarefaNovaJornada;
  }

  adicionaTarefaNovaJornada(){
    this.tarefaNovaJornada = true;
  }

}
