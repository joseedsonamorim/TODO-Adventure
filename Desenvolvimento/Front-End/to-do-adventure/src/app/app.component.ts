import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
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
}
