import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Department, User } from 'src/app/interfaces/user';
import { ResStatus } from 'src/app/interfaces/res-status';
import { DatabaseService } from 'src/app/services/database.service';
import { MyProjectsAndTasksComponent } from './my-projects-and-tasks.component';

describe('MyProjectsAndTasksComponent', () => {
  let component: MyProjectsAndTasksComponent;
  let fixture: ComponentFixture<MyProjectsAndTasksComponent>;
  let getAdminTasks: jasmine.Spy;

  beforeEach(async () => {
    getAdminTasks = jasmine.createSpy('getAdminTasks').and.returnValue(
      of({ status: ResStatus.Success_But_Empty, data: [] })
    );
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSelectModule,
        MatTableModule,
        MatSortModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [MyProjectsAndTasksComponent],
      providers: [{ provide: DatabaseService, useValue: { getAdminTasks } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProjectsAndTasksComponent);
    component = fixture.componentInstance;
    const manager = { department: Department.MANAGEMENT } as User;
    component.currentUser = manager;
    component.loggedInUser = manager;
    fixture.detectChanges();
  });

  it('loads the empty management task state for the supplied user', () => {
    expect(component).toBeTruthy();
    expect(getAdminTasks).toHaveBeenCalledTimes(1);
    expect(component.myTasksAsAdmin).toEqual([]);
  });
});
