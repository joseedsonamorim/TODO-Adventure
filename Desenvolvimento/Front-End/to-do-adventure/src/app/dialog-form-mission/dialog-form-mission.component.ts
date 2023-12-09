import { Component, Inject, OnInit } from '@angular/core';
import Mission from '../shared/models/mission-model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dialog-form-mission',
  templateUrl: './dialog-form-mission.component.html',
  styleUrls: ['./dialog-form-mission.component.scss']
})
export class DialogFormMissionComponent implements OnInit {
  mission?: Mission;
  selectedDifficulty: string = "Fácil";
  label: string = "Criar";
  deadline?: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.mission = data;
    if (this.mission) {
      this.selectedDifficulty = this.mission.difficulty;
      this.label = "Editar";
      this.setDeadline(this.mission.deadline);
    }
   }

  ngOnInit(): void {
    }

  setDeadline(data: string) {
    const array_data = data.split('/');
    this.deadline = [array_data[2], array_data[1], array_data[0]].join('-');
  }
}
