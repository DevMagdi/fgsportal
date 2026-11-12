import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalariesComponent } from './salaries.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SalariesComponent', () => {
  let component: SalariesComponent;
  let fixture: ComponentFixture<SalariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ SalariesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
