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
    'title': '',
    'difficulty': '',
    'description': '',
    'deadline': '',
    'nomeDaJornada': ''
  };
  novaTarefa: string[]  = [];
  deadline?: string;
  selectedDifficulty: string = "Fácil";
  tarefaNovaJornada: boolean = false;
  nomeJornada: string = '';

  novaJornadaObj: any = null;



  ngOnInit(): void {
    this.getJornadas()

  }

  getJornadas(){
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

  clearMission (){
    this.mission = {
      'title': '',
      'difficulty': '',
      'description': '',
      'deadline': '',
      'nomeDaJornada': ''

    };
  }

  adicionarTarefa(){
    this.tarefaNovaJornada = !this.tarefaNovaJornada;
  }

  adicionaTarefaNovaJornada(){
    this.novaTarefa.push(this.mission.title)
    if(this.novaJornadaObj){
      this.novaJornadaObj.tarefas.push(this.mission);
      this.tarefaNovaJornada = false;
      this.clearMission()

      return

    }
    this.iniciaObjNovaJornada()
    this.novaJornadaObj.tarefas.push(this.mission);

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

  selecionaJornada(){
    console.log(this.taskes);
    this.adicionarTarefasDisponiveis(this.taskes);
    this.dialogRef.close();
  }

  adicionarTarefasDisponiveis(taskes: any[]){
    this.appService.createTask(this.taskes).subscribe(
      data => {
      },
      error =>{

      }
    )
  }

  iniciaObjNovaJornada(){
    this.novaJornadaObj = {
       'nome' : this.nomeJornada,
        'tarefas' : []
    }
  }

  enviarNovaJornada(){
    this.appService.createJourney(this.novaJornadaObj).subscribe(
      data => {
        console.log(data);

      }
    )
  }

}
