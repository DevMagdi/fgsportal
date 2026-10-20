import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedSalariesComponent } from './approved-salaries.component';

describe('ApprovedSalariesComponent', () => {
  let component: ApprovedSalariesComponent;
  let fixture: ComponentFixture<ApprovedSalariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
