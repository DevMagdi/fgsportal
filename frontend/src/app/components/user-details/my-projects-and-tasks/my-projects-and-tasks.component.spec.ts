import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsAndTasksComponent } from './my-projects-and-tasks.component';

describe('MyProjectsAndTasksComponent', () => {
  let component: MyProjectsAndTasksComponent;
  let fixture: ComponentFixture<MyProjectsAndTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyProjectsAndTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProjectsAndTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
