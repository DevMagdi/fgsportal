import { Component, Input, OnInit} from '@angular/core';
import { Task } from 'src/app/interfaces/task';
import { AccountPositions, Department, User } from 'src/app/interfaces/user';
import {Sort} from '@angular/material/sort';
import { Status } from 'src/app/interfaces/project';
import { DatabaseService } from 'src/app/services/database.service';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AdminTasks } from 'src/app/interfaces/admin-tasks';

@Component({
  selector: 'app-my-projects-and-tasks',
  templateUrl: './my-projects-and-tasks.component.html',
  styleUrls: ['./my-projects-and-tasks.component.scss']
})
export class MyProjectsAndTasksComponent implements OnInit {
  @Input() currentUser:User;
  @Input() loggedInUser:User;
  myTasks:Task[] = [];
  filteredTasks:Task[] = [];
  searchKey:string = '';
  StatusEnum = Status;
  filtersList:Status[] = [];
  DepartmentEnum = Department;
  accPositionEnum = AccountPositions;

  myTasksAsAdmin:AdminTasks[]=[];

  constructor(private db:DatabaseService) {}

  ngOnInit(): void {
    if(!!this.currentUser){
      if(this.currentUser.department == Department.TECHNICAL_TEAM){
        this.db.getDevAllTasks(this.currentUser.key || '').subscribe(
          (tasks) =>{
            if(tasks['status'] == ResStatus.CRUD){
              this.myTasks = tasks['data'];
              this.filteredTasks = tasks['data'];
            }else{
              this.myTasks = [];
              this.filteredTasks = [];
            }
          }
        )
      }else{
        this.db.getAdminTasks(this.currentUser.key || '').subscribe(
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
    const data = this.myTasks.slice();
    if (!sort.active || sort.direction === '') {
      this.myTasks = data;
      return;
    }

    this.myTasks = data.sort((a, b) => {
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

  // ngAfterViewInit() {
  //   this.dataSource = new MatTableDataSource(this.myTasks);          
  //   this.dataSource.sort = this.matSort;
  //   this.dataSource.paginator = this.paginator;
  //   this.matSort.sortChange.subscribe(() => {
  //     this.paginator.pageIndex = 0
  //     this.dataSource.sort = this.matSort;
  //   } );
  // }


  searchTasks(){
    this.myTasks = this.filteredTasks ; 
    if(!!this.searchKey && this.searchKey.length > 0){
      this.myTasks =  this.myTasks.filter(task=> task.title.toLowerCase().includes(this.searchKey.toLowerCase()))
    }else{
      this.myTasks = this.filteredTasks
    }
  }


  filterProjects(){    
    this.myTasks = this.filteredTasks ; 
    if(this.filtersList.length > 0){
      // for (let i in this.filtersList){
      //   this.myProjects = this.myProjects.filter(project => project.status == this.filtersList[i])
      // }
      this.myTasks = [];
      for (let i in this.filteredTasks){
        const found = this.filtersList.find(status=>this.filteredTasks[i].status == status)
        if(!!found){
          this.myTasks.push(this.filteredTasks[i])
        }
      }


    }else{
      this.myTasks = this.filteredTasks; 
    }
    
  }

}



function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}