import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWarningsComponent } from './dialog-warnings.component';

describe('DialogWarningsComponent', () => {
  let component: DialogWarningsComponent;
  let fixture: ComponentFixture<DialogWarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogWarningsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogWarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
