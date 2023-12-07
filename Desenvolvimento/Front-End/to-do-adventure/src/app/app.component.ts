import { AppService } from './service/app.service';
import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import { DialogFormMissionComponent } from './dialog-form-mission/dialog-form-mission.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'to-do-adventure';

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  done2 = ['Get up2', 'Brush teeth2', 'Take a shower2', 'Check e-mai2l', 'Walk dog2'];

  missions: any;

  todoObjects = this.todo.map(item => ({
    title: item,
    description: `Description for ${item}`,
    prazo: '19/12/2023',
    difficulty: 'easy'
  }));

   doneObjects = this.done.map(item => ({
    title: item,
    description: `Description for ${item}`,
    prazo: '19/12/2023',
    difficulty: 'medium'
  }));

  doneObjects2 = this.done2.map(item => ({
    title: item,
    description: `Description for ${item}`,
    prazo: '19/12/2023',
    difficulty: 'medium'
  }));

  constructor(
    public dialog: MatDialog,
    public appService: AppService
    ) {}

    ngOnInit(){
      this.getMissions();
    }

  drop(event: CdkDragDrop<any[]>) {
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
  }

  openCreatNewMission(){
    const dialogRef = this.dialog.open( DialogFormMissionComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  getMissions(){
    this.appService.getMissions().subscribe(
      data => this.missions = data.missions,
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

  updateTask() {
    const taskId = '1'; // Substitua pelo ID da tarefa que você deseja atualizar
    const updatedTask = {
      title: 'Tarefa Atualizada',
      description: 'Descrição Atualizada',
      deadline: '2023-12-31',
      difficulty: 'Alta'
    };

    this.appService.updateTask(taskId, updatedTask).subscribe(response => {
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
