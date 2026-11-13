import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalariesComponent } from './monthly-salaries.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MonthlySalariesComponent', () => {
  let component: MonthlySalariesComponent;
  let fixture: ComponentFixture<MonthlySalariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
