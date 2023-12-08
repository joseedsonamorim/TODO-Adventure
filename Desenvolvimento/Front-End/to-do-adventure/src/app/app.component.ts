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

  disponiveis = ['Escovar os dentes', 'Usar fio dental', 'Fazer SkinCare'];

  andamento = ['Escovar os dentes'];

  concluidas = ['Escovar os dentes', 'Escovar os dentes'];

  todoObjects = this.disponiveis.map(item => ({
    title: item,
    description: `Description for ${item}`,
    prazo: '19/12/2023',
    difficulty: 'easy'
  }));

   doneObjects = this.andamento.map(item => ({
    title: item,
    description: `Description for ${item}`,
    prazo: '19/12/2023',
    difficulty: 'medium'
  }));

  doneObjects2 = this.concluidas.map(item => ({
    title: item,
    description: `Description for ${item}`,
    prazo: '19/12/2023',
    difficulty: 'medium'
  }));

  constructor(public dialog: MatDialog) {}

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
}
