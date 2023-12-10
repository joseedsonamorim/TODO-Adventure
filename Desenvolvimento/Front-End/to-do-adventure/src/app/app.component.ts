import { AppService } from './service/app.service';
import { Component } from '@angular/core';
import {CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import { DialogFormMissionComponent } from './dialog-form-mission/dialog-form-mission.component';
import Mission from './shared/models/mission-model';
import { DialogWarningsComponent } from './dialog-warnings/dialog-warnings.component';
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
      // this.updateTask();
      // this.getMissions();
    }

    drop(event: CdkDragDrop<any[]>, newList: string) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
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

  openDialogMission(data: any, isDelete?: boolean){
    let dialogRef
    if(isDelete){
      dialogRef = this.dialog.open( DialogWarningsComponent, {data});
      return
    }

    dialogRef = this.dialog.open( DialogFormMissionComponent, {data});


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  getMissions() {
    this.appService.getMissions().subscribe(
      data => {
        this.missions = data;
        this.missoesDisponiveis = this.missions.disponiveis;
        this.missoesConcluidas = this.missions.concluidas;
        this.missoesEmAndamento = this.missions.emAndamento;
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
      console.log(response);
      this.reloadTasks();
    });
  }

  updateTask(mission: Mission) {
    this.appService.updateTask(mission.id, mission).subscribe(response => {
      console.log(response);
      this.reloadTasks();
    });
  }

  private reloadTasks() {
    this.appService.getMissions().subscribe(data => {
      this.missions = data;
    });
  }
}
