import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSubTasksComponent } from './project-sub-tasks.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProjectSubTasksComponent', () => {
  let component: ProjectSubTasksComponent;
  let fixture: ComponentFixture<ProjectSubTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
