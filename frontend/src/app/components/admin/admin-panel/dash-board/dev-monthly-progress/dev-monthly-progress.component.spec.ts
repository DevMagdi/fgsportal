import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevMonthlyProgressComponent } from './dev-monthly-progress.component';

describe('DevMonthlyProgressComponent', () => {
  let component: DevMonthlyProgressComponent;
  let fixture: ComponentFixture<DevMonthlyProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevMonthlyProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevMonthlyProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
