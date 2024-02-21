import { AppService } from './../service/app.service';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Mission from '../shared/models/mission-model';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-dialog-warnings',
  templateUrl: './dialog-warnings.component.html',
  styleUrls: ['./dialog-warnings.component.scss']
})
export class DialogWarningsComponent implements OnInit {

  @Input() descricao!: string

  mission: Mission;
  journeyID: number;
  flagDelete: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    public appService : AppService
    ) {
      this.mission = data;
      this.descricao = data.descricao;
      this.flagDelete = data.flagDelete;
      this.journeyID = Number(localStorage.getItem("settedJourney"));
   }

  ngOnInit(): void {
  }

  confirmAction(){
    if(this.flagDelete){
      this.deleteMission()
    }
  }

  deleteMission(){
    this.appService.deleteMission(this.journeyID, this.mission.id).subscribe(
      message => {
        this.openSnackBar(message.message)
      },
      erro =>{
        console.error('Erro ao deletar tarefa', erro);
      });

  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "ok", {
      duration: 3000, horizontalPosition: 'center',
      verticalPosition: 'top',});
  }

}
