import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSortModule } from '@angular/material/sort';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Department, User } from 'src/app/interfaces/user';
import { ResStatus } from 'src/app/interfaces/res-status';
import { DatabaseService } from 'src/app/services/database.service';
import { OverDueTasksComponent } from './over-due-tasks.component';

describe('OverDueTasksComponent', () => {
  let component: OverDueTasksComponent;
  let fixture: ComponentFixture<OverDueTasksComponent>;
  let getMyAdminOverDueTasks: jasmine.Spy;

  beforeEach(async () => {
    getMyAdminOverDueTasks = jasmine.createSpy('getMyAdminOverDueTasks').and.returnValue(
      of({ status: ResStatus.Success_But_Empty, data: [] })
    );
    await TestBed.configureTestingModule({
      imports: [MatSortModule, RouterTestingModule],
      declarations: [OverDueTasksComponent],
      providers: [{ provide: DatabaseService, useValue: { getMyAdminOverDueTasks } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverDueTasksComponent);
    component = fixture.componentInstance;
    const manager = { department: Department.MANAGEMENT } as User;
    component.currentUser = manager;
    component.loggedInUser = manager;
    fixture.detectChanges();
  });

  it('loads the empty management overdue-task state for the supplied user', () => {
    expect(component).toBeTruthy();
    expect(getMyAdminOverDueTasks).toHaveBeenCalledTimes(1);
    expect(component.myTasksAsAdmin).toEqual([]);
  });
});
