import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReportsTableComponent } from './reports-table.component';
import { DatabaseService } from 'src/app/services/database.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

describe('ReportsTableComponent', () => {
  let component: ReportsTableComponent;
  let fixture: ComponentFixture<ReportsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule],
      declarations: [ ReportsTableComponent ],
      providers: [{ provide: DatabaseService, useValue: {} }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsTableComponent);
    component = fixture.componentInstance;
    component.reports = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
