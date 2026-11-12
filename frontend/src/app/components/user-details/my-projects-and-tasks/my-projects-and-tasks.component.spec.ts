import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsAndTasksComponent } from './my-projects-and-tasks.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatabaseService } from 'src/app/services/database.service';

describe('MyProjectsAndTasksComponent', () => {
  let component: MyProjectsAndTasksComponent;
  let fixture: ComponentFixture<MyProjectsAndTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ MyProjectsAndTasksComponent ],
      providers: [{ provide: DatabaseService, useValue: {} }]
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
