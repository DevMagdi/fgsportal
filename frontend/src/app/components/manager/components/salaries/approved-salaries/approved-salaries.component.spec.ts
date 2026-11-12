import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedSalariesComponent } from './approved-salaries.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ApprovedSalariesComponent', () => {
  let component: ApprovedSalariesComponent;
  let fixture: ComponentFixture<ApprovedSalariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ApprovedSalariesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedSalariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
