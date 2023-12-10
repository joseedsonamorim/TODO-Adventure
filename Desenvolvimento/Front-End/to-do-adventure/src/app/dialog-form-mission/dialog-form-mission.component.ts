import { AppService } from './../service/app.service';
import { Component, Inject, OnInit } from '@angular/core';
import Mission from '../shared/models/mission-model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-form-mission',
  templateUrl: './dialog-form-mission.component.html',
  styleUrls: ['./dialog-form-mission.component.scss']
})
export class DialogFormMissionComponent implements OnInit {

  mission: Mission;
  selectedDifficulty: string = "Fácil";
  label: string = "Criar";
  deadline?: string;
  flagEditar: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public appService: AppService
    ) {
      this.mission = data;
      this.isEditar();
   }

  ngOnInit(): void {
    }

    isEditar(){
      if (this.mission && this.mission.title !== '') {
        this.selectedDifficulty = this.mission.difficulty;
        this.label = "Editar";
        this.flagEditar = true;
        this.deadline = this.setDeadline(this.mission.deadline);
      }
    }

  setDeadline(data: string) {
    const array_data = data.split('/');
    return [array_data[2], array_data[1], array_data[0]].join('-');
  }

  criarOuSalvar(){
    if(this.flagEditar){
      this.editarMissao();
      return
    }
    this.postNewMission();
  }



  postNewMission(){
    console.log(this.mission);
    this.appService.createTask(this.mission).subscribe(
      mensagem => {
        console.log(mensagem);
        this.reloadTasks();
      },
      erro => {
        console.error('Erro ao criar a tarefa', erro);
      });

  }

  editarMissao(){
    this.appService.updateTask(this.mission.id, this.mission).subscribe(
      mensagem => {
        console.log(mensagem);
        this.reloadTasks();
      },
      erro => {
        console.error('Erro ao criar a tarefa', erro);
      });
  }

  private reloadTasks() {
    location.reload();
  }
}
