import { AppService } from './../service/app.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Mission from '../shared/models/mission-model';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-dialog-warnings',
  templateUrl: './dialog-warnings.component.html',
  styleUrls: ['./dialog-warnings.component.scss']
})
export class DialogWarningsComponent implements OnInit {

  mission: Mission;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    public appService : AppService
    ) {
    this.mission = data;
   }

  ngOnInit(): void {
  }

  deleteMission(){
    this.appService.deleteTask(this.mission.id).subscribe(
      message => {
        this.openSnackBar(message.message)
      },
      erro =>{
        console.error('Erro ao criar a tarefa', erro);
      });

  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "ok", {
      duration: 3000, horizontalPosition: 'center',
      verticalPosition: 'top',});
  }

}
