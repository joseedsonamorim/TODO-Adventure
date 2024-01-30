import { AppService } from './service/app.service';
import { Component } from '@angular/core';
import {CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import { DialogFormMissionComponent } from './dialog-form-mission/dialog-form-mission.component';
import Mission from './shared/models/mission-model';
import { DialogWarningsComponent } from './dialog-warnings/dialog-warnings.component';
import { DialogHeroJorneyComponent } from './dialog-hero-jorney/dialog-hero-jorney.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mission: Mission = {
    'title': '',
    'difficulty': '',
    'description': '',
    'deadline': ''
  };
  missions: any;

  missoesDisponiveis: any = [];
  missoesEmAndamento: any = [];
  missoesConcluidas: any = [];

  statusOK: boolean = false;

  item: any;


  constructor(
    public dialog: MatDialog,
    public appService: AppService
    ) {}

    ngOnInit(){
      this.getMissions();
    }

    drop(event: CdkDragDrop<any[]>, newList: string) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        if(newList == 'emAndamento' && this.missoesEmAndamento.length){
          return;
        }
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }

      const movedItem = {...event.container.data[event.currentIndex],
        status: newList,
      };
      this.updateTask(movedItem);
    }

  openDialogMission(data: any, isDelete?: boolean, tipoDialog?: string){
    let dialogRef
    if(isDelete){
      dialogRef = this.dialog.open( DialogWarningsComponent, {data});
      dialogRef.afterClosed().subscribe(result => {
        this.getMissions();
      });
      return
    }
    switch (tipoDialog) {
      case 'tarefa':
        dialogRef = this.dialog.open( DialogFormMissionComponent, {data});
        dialogRef.afterClosed().subscribe(result => {
        this.getMissions();
        });
        break;
      case 'jornada':
          dialogRef = this.dialog.open( DialogHeroJorneyComponent);
          dialogRef.afterClosed().subscribe(result => {
          // this.getJorneys();
          });

        break;
      default:
        break;
    }

  }

  getJorneys(){
    this.appService.getJounerys().subscribe(
      data => {
        console.log(data);

      },
      error => console.error('Erro ao obter Jornadas', error)
    )
  }

  getMissions() {
    this.appService.getMissions().subscribe(
      data => {
        this.missions = data;
        this.missoesDisponiveis = this.missions.disponiveis ? this.missions.disponiveis : [] ;
        this.missoesConcluidas = this.missions.concluidas ? this.missions.concluidas : [];
        this.missoesEmAndamento = this.missions.emAndamento ? this.missions.emAndamento : [];

      },
      error => console.error('Erro ao obter missões', error)
    );
  }

  createTask() {
    const newTask = {
      title: 'Nova Tarefa',
      description: 'Descrição da Nova Tarefa',
      deadline: '2023-12-31',
      difficulty: 'Média'
    };

    this.appService.createTask(newTask).subscribe(response => {
      this.reloadTasks();
    });
  }

  updateTask(mission: Mission) {
    this.appService.updateTask(mission.id, mission).subscribe(response => {
      this.reloadTasks();
    });
  }

  private reloadTasks() {
    this.appService.getMissions().subscribe(data => {
      this.missions = data;
    });
  }
}
