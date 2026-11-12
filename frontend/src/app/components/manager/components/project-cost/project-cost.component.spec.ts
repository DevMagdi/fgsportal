import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCostComponent } from './project-cost.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ProjectCostComponent', () => {
  let component: ProjectCostComponent;
  let fixture: ComponentFixture<ProjectCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [ ProjectCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
