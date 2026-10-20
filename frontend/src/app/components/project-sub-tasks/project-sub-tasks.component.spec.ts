import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSubTasksComponent } from './project-sub-tasks.component';

describe('ProjectSubTasksComponent', () => {
  let component: ProjectSubTasksComponent;
  let fixture: ComponentFixture<ProjectSubTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSubTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSubTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
