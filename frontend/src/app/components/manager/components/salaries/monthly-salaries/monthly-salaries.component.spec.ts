import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalariesComponent } from './monthly-salaries.component';

describe('MonthlySalariesComponent', () => {
  let component: MonthlySalariesComponent;
  let fixture: ComponentFixture<MonthlySalariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlySalariesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySalariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
