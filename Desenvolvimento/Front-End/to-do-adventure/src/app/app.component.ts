import { AppService } from './service/app.service';
import { Component } from '@angular/core';
import {CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import { DialogFormMissionComponent } from './dialog-form-mission/dialog-form-mission.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  missions: any;

  missoesDisponiveis: any;
  missoesEmAndamento: any;
  missoesConcluidas: any;

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
        // Se o item for movido dentro da mesma lista, não faz nada
        return;
      }

      // Obtenha o item que foi movido
      const movedItem = event.previousContainer.data[event.previousIndex];

      // Chame o método para atualizar o status
      this.updateTask(newList, movedItem.id);
    }

  getItemDrag(item: any){
    console.log(item);

  }

  evenPredicate(item: CdkDrag<any>) {
    console.log(item.data);
    this.item = item.data

    // this.updateTask(item.data);


    return true
  }

  openDialogMission(data: any){
    const dialogRef = this.dialog.open(DialogFormMissionComponent, {data});

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

  updateTask(status?:any , id?:number) {
    // const taskId = item.id; // Substitua pelo ID da tarefa que você deseja atualizar
    // const updatedTask = {
    //   title: item.title,
    //   description: item.description,
    //   deadline: item.deadline,
    //   status: item.status,
    //   difficulty: item.difficulty
    // };

    const updatedTask = {
      status: status,
    };

    this.appService.updateTask(id, updatedTask).subscribe(response => {
      console.log(response);
      this.reloadTasks();
    });
  }

  deleteTask() {
    const taskId = '1'; // Substitua pelo ID da tarefa que você deseja excluir

    this.appService.deleteTask(taskId).subscribe(response => {
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
