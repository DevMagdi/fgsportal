import { Component, OnInit } from '@angular/core';
import { DevDailyReport } from 'src/app/interfaces/dev-daily-report';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Task } from 'src/app/interfaces/task';
import { AccountPositions, AccountType, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-dev-reports',
  templateUrl: './dev-reports.component.html',
  styleUrls: ['./dev-reports.component.scss']
})
export class DevReportsComponent implements OnInit {

  allDevs:User[] = []; 
  devTasks:Task[] = [];
  devKey:string ;
  taskKey:string;
  fromDate:Date;
  toDate:Date;
  periodDates:Date[] = [];
  myReports:DevDailyReport[] = [];


  getToday = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
  fileName= `${this.getToday}.xlsx`;
  
  constructor(private notify:NotificationService,
              private _db:DatabaseService,
              private _auth:AuthApiService) { }

  ngOnInit(): void {


    this._auth.user.subscribe(
      (user)=>{
        if(!!user){
          if(user.department == Department.MANAGEMENT || user.accPosition == AccountPositions.MANAGER || user.department == Department.ADMINSTRATION){
            this._auth.getUserByFilter(Department.TECHNICAL_TEAM).subscribe(res=>{
              if(res['status'] == ResStatus.CRUD){
                const devs = res['data'];
                this.allDevs= devs.filter(d=>d.accPosition != AccountPositions.MANAGER)
                this.allDevs = this.allDevs.sort((a,b)=>{
                  return compare(a.username, b.username, true);
                })
              }
            })
          }else{
            console.log("You Have No Access For This Page");
          }
        }
      }
    )


    
  }


  getDevTasks(e){
    this.devTasks = [];
    this._db.getDevTasks(e.target.value).subscribe(tasks=>{
      if(tasks['status'] == ResStatus.CRUD){
        this.devTasks = tasks['data'];
      }else{
        this.devTasks = [];
      }
    })
  }

  getDevReports(){
    if(!!this.taskKey){
      this._db.getDeveloperTasksReport(this.devKey , this.fromDate , this.toDate , this.taskKey).subscribe(res=>{
        
        if(res['status'] == ResStatus.CRUD){
          this.myReports = res['data'];
          console.log(res['data']);
        }else{
          this.myReports = [];
        }
      })
    }else{
      this._db.getDeveloperTasksReport(this.devKey , this.fromDate , this.toDate).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myReports = res['data'];
          console.log(res['data']);

        }else{
          this.myReports = [];
        }
      })
    }
  }

  getPeriodDates(){
    this.periodDates = []
    
    const from = new Date(this.fromDate)
    const to = new Date(this.toDate)

    let firstday = new Date(from.getFullYear(), from.getMonth() , from.getDate())
    let lastday = new Date(to.getFullYear(), to.getMonth() , to.getDate())
    while(firstday <= lastday){
      this.periodDates.push(new Date(firstday))
      firstday = new Date(firstday.setDate(firstday.getDate()+1));
    }

    let newReportsArray:DevDailyReport[] = [];

    for(let i in this.periodDates){
      const date = `${this.periodDates[i].getMonth() + 1}/${this.periodDates[i].getDate()}/${this.periodDates[i].getFullYear()}`;
      
      const filteredDays =this.myReports.filter(report=>report.reportDate == date)
      if(filteredDays.length > 0){
        filteredDays.map(rep=>newReportsArray.push(rep))
      }
    }
    this.myReports = newReportsArray;
  }



  calculateWorkingHours(){
    const workingHours:number[] = [];
    this.myReports.map(rep=>{
      if(!rep.rejected){
        workingHours.push(rep.durationByHours)
      }
    });
    return workingHours.reduce((a,b)=> a + b )
  }


  exportexcel():void{
    /* table id is passed over here */   
    let element = document.getElementById('excel-table'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
 }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}