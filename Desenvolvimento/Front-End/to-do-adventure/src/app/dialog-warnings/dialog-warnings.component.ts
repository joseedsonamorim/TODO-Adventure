import { AppService } from './../service/app.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Mission from '../shared/models/mission-model';

@Component({
  selector: 'app-dialog-warnings',
  templateUrl: './dialog-warnings.component.html',
  styleUrls: ['./dialog-warnings.component.scss']
})
export class DialogWarningsComponent implements OnInit {

  mission: Mission;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public appService : AppService
    ) {
    this.mission = data;
   }

  ngOnInit(): void {
  }

  deleteMission(){
    this.appService.deleteTask(this.mission.id).subscribe(
      message => {
      console.log(message);
      this.reloadTasks();

      },
      erro =>{
        console.error('Erro ao criar a tarefa', erro);
      });


  }

  private reloadTasks() {
    location.reload();
  }

}
