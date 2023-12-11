import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFormMissionComponent } from './dialog-form-mission.component';

describe('DialogFormMissionComponent', () => {
  let component: DialogFormMissionComponent;
  let fixture: ComponentFixture<DialogFormMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFormMissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFormMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
