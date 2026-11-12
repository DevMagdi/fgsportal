import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedProjectsComponent } from './closed-projects.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ClosedProjectsComponent', () => {
  let component: ClosedProjectsComponent;
  let fixture: ComponentFixture<ClosedProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [ ClosedProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
