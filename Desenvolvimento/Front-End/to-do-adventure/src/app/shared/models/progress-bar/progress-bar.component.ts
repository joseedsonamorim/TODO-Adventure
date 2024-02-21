import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  // @Input() label1: string = 'Label 1';
  // @Input() label2: string = 'Label 2';
  @Input() progresso: number = 10;

  constructor() { }

  ngOnInit(): void {
  }

}
