import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsTableComponent } from './reports-table.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ReportsTableComponent', () => {
  let component: ReportsTableComponent;
  let fixture: ComponentFixture<ReportsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [ ReportsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
