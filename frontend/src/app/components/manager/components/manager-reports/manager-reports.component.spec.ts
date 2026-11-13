import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerReportsComponent } from './manager-reports.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ManagerReportsComponent', () => {
  let component: ManagerReportsComponent;
  let fixture: ComponentFixture<ManagerReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [ ManagerReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
