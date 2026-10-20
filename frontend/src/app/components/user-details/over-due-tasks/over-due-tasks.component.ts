import { Component, Input, OnInit } from '@angular/core';
import { Status } from 'src/app/interfaces/project';
import { Task } from 'src/app/interfaces/task';
import { AccountPositions, Department, User } from 'src/app/interfaces/user';
import {Sort} from '@angular/material/sort';
import { DatabaseService } from 'src/app/services/database.service';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AdminTasks } from 'src/app/interfaces/admin-tasks';

@Component({
  selector: 'app-over-due-tasks',
  templateUrl: './over-due-tasks.component.html',
  styleUrls: ['./over-due-tasks.component.scss']
})
export class OverDueTasksComponent implements OnInit {
  @Input() currentUser:User;
  @Input() loggedInUser:User;
  overDueTasks:Task[] = [];
  DepartmentEnum = Department;
  accPositionEnum = AccountPositions;

  myTasksAsAdmin:AdminTasks[]=[];
  constructor(private _db:DatabaseService) { }

  ngOnInit(): void {
    if(!!this.currentUser){
      if(this.currentUser.department == Department.TECHNICAL_TEAM){
        this._db.getDevOverDueTasks(this.currentUser.key ? this.currentUser.key : '').subscribe(
          (tasks)=>{
            if(tasks['status'] == ResStatus.CRUD){
              this.overDueTasks = tasks['data'] ;
            }else{
              this.overDueTasks = [];
            }
          }
        )
      }else{
        this._db.getMyAdminOverDueTasks(this.currentUser.key || '').subscribe(
          (tasks) =>{
            if(tasks['status'] == ResStatus.CRUD){
              this.myTasksAsAdmin = tasks['data'];
              this.myTasksAsAdmin = tasks['data'];
            }else{
              this.myTasksAsAdmin = [];
              this.myTasksAsAdmin = [];
            }
          },err=>{
            this.myTasksAsAdmin = [];
            this.myTasksAsAdmin = [];
          }
        )
      }
    }
    
  }


  sortData(sort: Sort) {
    const data = this.overDueTasks.slice();
    if (!sort.active || sort.direction === '') {
      this.overDueTasks = data;
      return;
    }

    this.overDueTasks = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'order': return compare(a.order?a.order:0, b.order? b.order:0, isAsc);
        case 'taskTitle': return compare(a.title, b.title, isAsc);
        case 'projectTitle': return compare(a.project_title, b.project_title, isAsc);
        case 'processTitle': return compare(a.process_title ?a.process_title : '' , b.process_title ? b.process_title : '' , isAsc);
        case 'expectedDuration': return compare(a.ex_duration, b.ex_duration, isAsc);
        case 'realDuration': return compare(a.real_duration ? a.real_duration : '', b.real_duration? b.real_duration : '', isAsc);
        case 'startDate': return compare(new Date(a.start_date).toDateString(), new Date(b.start_date).toDateString(), isAsc);
        case 'endDate': return compare(new Date(a.end_date).toDateString(), new Date(b.end_date).toDateString(), isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }



}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}