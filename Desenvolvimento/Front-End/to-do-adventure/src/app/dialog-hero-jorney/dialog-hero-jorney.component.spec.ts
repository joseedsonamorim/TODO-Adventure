import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHeroJorneyComponent } from './dialog-hero-jorney.component';

describe('DialogHeroJorneyComponent', () => {
  let component: DialogHeroJorneyComponent;
  let fixture: ComponentFixture<DialogHeroJorneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogHeroJorneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHeroJorneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
