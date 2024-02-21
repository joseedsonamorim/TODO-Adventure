import {  AppService } from './../service/app.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Mission from '../shared/models/mission-model';
import { runInThisContext } from 'vm';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-hero-jorney',
  templateUrl: './dialog-hero-jorney.component.html',
  styleUrls: ['./dialog-hero-jorney.component.scss']
})
export class DialogHeroJorneyComponent implements OnInit {

  constructor(   public appService: AppService,
    public dialogRef: MatDialogRef<DialogHeroJorneyComponent>) { }

  jorneys: any[] = [];
  taskes: any[] = [];
  panelOpenState = false;
  panelOpenStates: boolean[] = [];
  flagNovaJornada: boolean = false;
  actionAddNovajornada = 'Fechar'
  actionJornada: string = 'Nova Jornada';
  mission: Mission = {
    'id': 0,
    'title': '',
    'difficulty': '',
    'description': '',
    'deadline': '',
    'runningTime': '00:00:00',
    'status': 'available'
  };
  novaTarefa: string[]  = [];
  deadline?: string;
  selectedDifficulty: string = "Easy";
  tarefaNovaJornada: boolean = false;
  nomeJornada: string = '';

  novaJornadaObj: any = null;



  ngOnInit(): void {
    this.getJornadas()

  }

  getJornadas(){
    this.appService.getJourneys().subscribe(
      data => {

        this.jorneys = data;

      },
      error => {

      }
    )
  }

  openJorney(jorney: any){
    this.taskes = jorney.missions;
  }

  novaJornada(){
    this.flagNovaJornada = !this.flagNovaJornada;
    this.actionJornada = this.flagNovaJornada ? 'Cancelar' : 'Nova Jornada';
    this.actionAddNovajornada = this.flagNovaJornada ? 'Criar Jornada' : 'Fechar';

  }

  clearMission (){
    this.mission = {
      'id': 0,
      'title': '',
      'difficulty': '',
      'description': '',
      'deadline': '',
      'runningTime': '00:00:00',
      'status': 'available'
    };
  }

  adicionarTarefa(){
    this.tarefaNovaJornada = !this.tarefaNovaJornada;
  }

  adicionaTarefaNovaJornada(){
    this.novaTarefa.push(this.mission.title)
    if(this.novaJornadaObj){
      this.novaJornadaObj.missions.push(this.mission);
      this.tarefaNovaJornada = false;
      this.clearMission()

      return

    }
    this.iniciaObjNovaJornada()
    this.novaJornadaObj.missions.push(this.mission);

    this.tarefaNovaJornada = false;
    console.log(this.novaJornadaObj);
    this.clearMission();

  }

  FechaOuCriaJornada(){
    switch (this.actionAddNovajornada) {
      case 'Criar Jornada':
          console.log('jornada criada');
          this.enviarNovaJornada();
            this.actionAddNovajornada = 'Cancelar';
            this.actionJornada = 'Nova Jornada';
            this.clearMission();
            this.nomeJornada = '';
            this.taskes = [];

            setTimeout(() => {
              this.getJornadas();
            }, 1000);
          this.flagNovaJornada = false;
        break;
      default:
        this.dialogRef.close();
        break;
    }
  }

  selecionaJornada(journeyID: number){
    this.appService.setSettedJourney(journeyID).subscribe(
      data => {
        this.dialogRef.close();
      },
      error =>{
        console.error('Não foi possível setar a jornada', error)
      }
    );

  }

  iniciaObjNovaJornada(){
    this.novaJornadaObj = {
      'name' : this.nomeJornada,
      'missions' : []
    }
  }

  enviarNovaJornada(){
    this.appService.createJourney(this.novaJornadaObj).subscribe(
      data => {
        console.log(data);

      }
    )
  }

  setDeadline(data: string) {
    const array_data = data.split('-');
    return [array_data[2], array_data[1], array_data[0]].join('/');
  }
}
