import { Component, Inject, OnInit } from '@angular/core';
import Mission from '../shared/models/mission-model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-form-mission',
  templateUrl: './dialog-form-mission.component.html',
  styleUrls: ['./dialog-form-mission.component.scss']
})
export class DialogFormMissionComponent implements OnInit {
  mission?: Mission;
  selectedDifficulty: string = "Fácil";
  labelButton: string = "Criar";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.mission = data;
    if (this.mission) {
      this.selectedDifficulty = this.mission.difficulty;
      this.labelButton = "Editar"
    }
   }

  ngOnInit(): void {
    }
}
