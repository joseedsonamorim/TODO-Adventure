import { AppService } from './service/app.service';
import { Component, VERSION } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormMissionComponent } from './dialog-form-mission/dialog-form-mission.component';
import Mission from './shared/models/mission-model';
import { DialogWarningsComponent } from './dialog-warnings/dialog-warnings.component';
import { DialogHeroJorneyComponent } from './dialog-hero-jorney/dialog-hero-jorney.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  mission: Mission = {
    'id': 0,
    'title': '',
    'difficulty': '',
    'description': '',
    'deadline': '',
    'runningTime': '00:00:00',
    'status': 'available'
  };

  settedJourney: any;

  missions: any;
  missoesDisponiveis: any = [];
  missoesEmAndamento: any = [];
  missoesConcluidas: any = [];

  startTimer: any;
  rodandoCronometro = false;
  mostrarCronometro = false;
  botaoCronometro = "play_arrow";
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  name = 'Angular ' + VERSION.major;
  progresso: number = 10;

  flagRetornoAndamento: boolean = false;
  flagIntervalo: boolean = false;
  flagContinuarTarefa: boolean = false;
  intervaloCount: number = 1;

  constructor(
    public dialog: MatDialog,
    public appService: AppService,
    private _snackBar: MatSnackBar,
    ) {}

  ngOnInit() {
    this.getSettedJourney();
  }

  getSettedJourney() {
    this.appService.getSettedJourney().subscribe(
      data => {
        this.settedJourney = data;
        this.missoesDisponiveis =  this.settedJourney.missions.filter((mission: { status: string; }) => mission.status === 'available');
        this.missoesConcluidas = this.settedJourney.missions.filter((mission: { status: string; }) => mission.status === 'completed');
        this.missoesEmAndamento = this.settedJourney.missions.filter((mission: { status: string; }) => mission.status === 'in progress');
        localStorage.setItem("settedJourney", this.settedJourney.id);
        this.somarProgresso();

      },
      error => console.error('Não há jornada setada', error)
    );

  }

 drop(event: CdkDragDrop<any[]>, newList: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if(event.container.id == 'in progress' &&  event.previousContainer.id !== 'completed') {
        if (this.missoesEmAndamento.length) { return; }
        const array_data = event.previousContainer.data[event.previousIndex].runningTime.split(':');
        this.sec = parseInt(array_data[2]) < 10 ? '0' + parseInt(array_data[2]) : parseInt(array_data[2]);
        this.min = parseInt(array_data[1]) < 10 ? '0' + parseInt(array_data[1]) : parseInt(array_data[1]);
        this.hr = parseInt(array_data[0]) < 10 ? '0' + parseInt(array_data[0]) : parseInt(array_data[0]);
        this.mostrarCronometro = true;

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
        this.startCronometro();
        const movedItem = {...event.container.data[event.currentIndex],
          status: newList,
        };
        this.updateMission(movedItem);
      }
      if(event.container.id == 'available') {
        let dialogRef
        const data = {
          descricao: 'Você tem certeza que deseja cancelar o andamento da tarefa?',
          flagDelete: false
        }
        dialogRef = this.dialog.open( DialogWarningsComponent, {data});
        dialogRef.afterClosed().subscribe(result => {
          this.flagRetornoAndamento = result;
          if(this.flagRetornoAndamento){
            event.previousContainer.data[event.previousIndex].runningTime = '00:00:00'

            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex,
            );
            this.mostrarCronometro = false;
            this.stopCronometro();
            const movedItem = {...event.container.data[event.currentIndex],
              status: newList,
            };
            this.updateMission(movedItem);

          }

        });

      }
       if(event.previousContainer.id == 'in progress' && event.container.id !== 'available') {
        this.stopCronometro();
        event.previousContainer.data[event.previousIndex].runningTime = [this.hr, this.min, this.sec].join(':');
        this.mostrarCronometro = false;

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
        const movedItem = {...event.container.data[event.currentIndex],
          status: newList,
        };
        this.updateMission(movedItem);
      }

      if(event.previousContainer.id == 'completed' && event.container.id == 'in progress') {
        let dialogRef
        const data = {
          descricao: 'Você deseja reiniciar essa tarefa? Se sim, seu andamento será zerado',
          flagDelete: false
        }
        dialogRef = this.dialog.open( DialogWarningsComponent, {data});
        dialogRef.afterClosed().subscribe(result => {
          this.flagRetornoAndamento = result;
          if(this.flagRetornoAndamento){
            event.previousContainer.data[event.previousIndex].runningTime = '00:00:00'
            const array_data = event.previousContainer.data[event.previousIndex].runningTime.split(':');
            this.sec = parseInt(array_data[2]) < 10 ? '0' + parseInt(array_data[2]) : parseInt(array_data[2]);
            this.min = parseInt(array_data[1]) < 10 ? '0' + parseInt(array_data[1]) : parseInt(array_data[1]);
            this.hr = parseInt(array_data[0]) < 10 ? '0' + parseInt(array_data[0]) : parseInt(array_data[0]);
            this.mostrarCronometro = true;


            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex,
            );

            this.startCronometro();
            const movedItem = {...event.container.data[event.currentIndex],
              status: newList,
            };
            this.updateMission(movedItem);

          }
        });

      }



    }
  }

  clearMission(){
    this.mission = {
      'id': 0,
      'title': '',
      'difficulty': '',
      'description': '',
      'deadline': '',
      'runningTime': '00:00:00',
      'status': 'available'
    };
  }

  openDialogMission(data: any, isDelete?: boolean, tipoDialog?: string){
    let dialogRef
    if(isDelete){
      data.descricao = 'Você tem certeza que deseja excluir essa missão?';
      data.flagDelete = true;
      dialogRef = this.dialog.open( DialogWarningsComponent, {data});
      dialogRef.afterClosed().subscribe(result => {
        this.getSettedJourney();
        this.clearMission();
      });
      return
    }
    switch (tipoDialog) {
      case 'tarefa':
        dialogRef = this.dialog.open( DialogFormMissionComponent, {data});
        dialogRef.afterClosed().subscribe(result => {
          this.getSettedJourney();
          this.clearMission();
        });
        break;
      case 'jornada':
          dialogRef = this.dialog.open( DialogHeroJorneyComponent);
          dialogRef.afterClosed().subscribe(result => {
            this.getSettedJourney();
            this.clearMission();
          });

        break;
      default:
        break;
    }
  }

  setDeadline(data: string) {
    const array_data = data.split('-');
    return [array_data[2], array_data[1], array_data[0]].join('/');
  }

  updateMission(mission: Mission) {
    this.appService.updateMission(this.settedJourney.id, mission.id, mission).subscribe(response => {
      this.getSettedJourney();
    });
  }

  startCronometro() {
    this.flagContinuarTarefa = false;
    this.flagIntervalo = false;
    this.intervaloCount = 1;

    if(!this.rodandoCronometro) {
      this.rodandoCronometro = true;
      this.botaoCronometro = "pause";
      this.startTimer = setInterval(() => {
        this.sec++;
        this.sec = this.sec < 10 ? '0' + this.sec : this.sec;

        if(this.sec === 60) {
          this.min++;
          this.min = this.min < 10 ? '0' + this.min : this.min;
          this.sec = '0' + 0;
        }

        if(this.sec == 5 && !this.flagIntervalo && this.intervaloCount <= 3){
          this.openSnackBar('Modo de intervalo iniciado.\n Você terá 5 minutos para descansar!');
          this.flagIntervalo = true;

        }

        if(this.sec == 5 && !this.flagIntervalo && this.intervaloCount === 4){
          this.openSnackBar('Modo de intervalo iniciado.\n Você terá 15 minutos para descansar!');
          this.flagIntervalo = true;

        }

        if(this.sec == 10 && this.flagIntervalo && this.intervaloCount <= 3 ){
          this.intervaloCount++;
          let dialogRef
          const data = {
            descricao: 'Seu intervalo acabou, precisa de mais 30 minutos para concluir a tarefa?',
            flagDelete: false
          }
            dialogRef = this.dialog.open( DialogWarningsComponent, {data});
            dialogRef.afterClosed().subscribe(result => {
              this.flagContinuarTarefa = result;
              if(this.flagContinuarTarefa){
                this.sec = '00';
                this.min = '00';
                this.hr = '00';
                this.flagIntervalo = false;
              } else {
                this.flagIntervalo = false;
                this.min =  this.sec !== '00' ? 30 * (this.intervaloCount - 1) : '00';
                this.sec = '00' ;
                this.hr = this.min >= 60 ? this.min / 60 : '00';
                if(this.min == 60){
                  this.hr = '01';
                  this.min = '00';
                }
                if(this.hr == 1.5){
                  this.hr = '01';
                  this.min = '30';
                }
                if(this.hr == 2){
                  this.min = '00';
                }
                this.stopCronometro();
                this.openSnackBar('mova a tarefa para concluidas!')
              }

            });

        }

        if(this.sec == 15 && this.flagIntervalo && this.intervaloCount == 4){
          let dialogRef
          const data = {
            descricao: 'Seu intervalo acabou, precisa de mais 30 minutos para concluir a tarefa?',
            flagDelete: false
          }
            dialogRef = this.dialog.open( DialogWarningsComponent, {data});
            dialogRef.afterClosed().subscribe(result => {
              this.flagContinuarTarefa = result;
              if(this.flagContinuarTarefa){
                this.sec = '00';
                this.min = '00';
                this.hr = '00';
                this.flagIntervalo = false;
                this.intervaloCount = 1;
              } else {
                this.flagIntervalo = false;
                this.intervaloCount = 1;
                this.sec = '00';
                this.min = '10';
                this.hr = '02';
                this.stopCronometro();
                this.openSnackBar('mova a tarefa para concluidas!')
              }

            });

        }

        if(this.min === 60) {
          this.hr++;
          this.hr = this.hr < 10 ? '0' + this.hr : this.hr;
          this.min = '0' + 0;
        }
      }, 1000);
    } else {
      this.stopCronometro();
    }
  }

  stopCronometro() {
    clearInterval(this.startTimer);
    this.rodandoCronometro = false;
    this.botaoCronometro = "play_arrow";
  }

  resetCronometro() {
    clearInterval(this.startTimer);
    this.rodandoCronometro = false;
    this.hr = this.min = this.sec = '0' + 0;
  }

  somarProgresso() {
    const numTarefasConcluidas = this.missoesConcluidas.length;
    const numTotalTarefas = this.missoesDisponiveis.length + this.missoesEmAndamento.length + numTarefasConcluidas;
    const porcentagemConcluidas = (numTarefasConcluidas / numTotalTarefas) * 100;
    this.progresso = porcentagemConcluidas;

  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "ok", {
      duration: 5000, horizontalPosition: 'center',
      verticalPosition: 'top',});
  }

}
