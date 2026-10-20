import { Component, OnInit } from '@angular/core';
import { AdminReports } from 'src/app/interfaces/admin-reports';
import { ReportStatus } from 'src/app/interfaces/dev-daily-report';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-emp-weekly-reports',
  templateUrl: './emp-weekly-reports.component.html',
  styleUrls: ['./emp-weekly-reports.component.scss']
})
export class EmpWeeklyReportsComponent implements OnInit {
  // encapsulation: ViewEncapsulation.None

  // filtersList:Status[] = [];
  // StatusEnum = Status;
  // taskTypeEnum = TaskType;
  taskTypefilter:TaskType | null;

  currentWeekDays:Date[] = [];
  myUsersList:User[]=[];
  // myBAList:User[]=[];
  userToSeeReport:string ;
  myReportsList:AdminReports[] = []
  totalHours:Array<number>= []
  // unCompletedTasks:Task[]=[];
  // filteredTasks:Task[]=[];
  // overDueTasks:Task[]=[];


  // unCompletedProjects:Project[]=[]
  // runningProjects:Project[]=[]

  today:string = '' ;

  reportByMonth:boolean = false ;

  allDevsReports:Array<any> = []
  // finalMonthlyReport:Array<monthlyReport> = []
  // finalProjectsReport:projectsReports[] = []
  DepartmentEnum = Department;
  AccountPositionsEnum = AccountPositions;
  interval;

  loadingSpinnerMode:boolean = false;

  getToday = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
  fileName= `${this.getToday}.xlsx`;
  currentUser:User;
  devWeeklyReport_Dev_ID:string;

  // private mytask:Subscription;

  constructor(private _notify:NotificationService,
              private excelServ:ExportExcelService,
              private _db:DatabaseService,
              private _auth:AuthApiService) { }

  ngOnInit(): void {
    this.getWeek(new Date());
    this._auth.user.subscribe(
      (user)=>{
        this.currentUser = user ;
        if(this.currentUser.department != Department.MANAGEMENT){
          this._auth.getUserByFilter(this.currentUser.department).subscribe(res=>{
            if(res['status'] ==ResStatus.CRUD){
              const devs = res['data'] as User[];
              this.myUsersList= devs.filter(d=>d.accPosition != AccountPositions.MANAGER)
              this.myUsersList = this.myUsersList.sort((a,b)=>{
                return compare(a.username, b.username, true);
              })
            }
          })
        }else{
          this._auth.getAllUsers().subscribe(res=>{
            if(res['status'] ==ResStatus.CRUD){
              const devs = res['data'] as User[];
              this.myUsersList= devs.filter(d=>d.accPosition != AccountPositions.MANAGER && d.department != Department.TECHNICAL_TEAM)
              this.myUsersList = this.myUsersList.sort((a,b)=>{
                return compare(a.username, b.username, true);
              })
            }
          })
        }
      },(err)=>{
        console.log(err);
      }
    )
  }



  getDevReportsByDate(date){
    if(!this.reportByMonth){
      this.getWeek(date)
    }else{
      this.getMonth(date)
    }
  }
  getWeek(date){
    this.currentWeekDays = []
    this.totalHours = []
    
    const today = new Date(date) 
    let first = today.getDate() - (today.getDay())
    let last = first + 6  
    let firstday = new Date(new Date(date).setDate(first))
    let lastday = new Date(new Date(date).setDate(last))
    while(firstday <= lastday){
      this.currentWeekDays.push(new Date(firstday))
      firstday = new Date(firstday.setDate(firstday.getDate()+1));
    }
    this.totalHoursCalculation()
  }


  getMonth(date){
    this.currentWeekDays = []
    this.totalHours = []
    const today = new Date(date) 
    let firstday = new Date(today.getFullYear(), today.getMonth(), 1)
    let lastday = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    while(firstday <= lastday){
      this.currentWeekDays.push(new Date(firstday))
      firstday = new Date(firstday.setDate(firstday.getDate()+1));
    }
    this.totalHoursCalculation()
  }

  getDate(date){
    date = new Date(date)
    const realDate = this._db.getDateFormatted(date)
    // const day =  date.getDate()
    // const month =  date.getMonth()
    // const year =  date.getFullYear()
    // const realDate = `${month +1 }/${day}/${year}`
    return realDate
  }

  changeReportMode(){
    this.reportByMonth = !this.reportByMonth
    if(!this.reportByMonth){
      this.getWeek(new Date())
    }else{
      this.getMonth(new Date())
    }
  }

  getReports(){
    const start = this._db.getDateFormatted(this.currentWeekDays[0])
    const end = this._db.getDateFormatted(this.currentWeekDays[this.currentWeekDays.length-1])
    this._db.getManagerAdminReport(this.devWeeklyReport_Dev_ID,start,end ).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.myReportsList = res['data'];
        this.totalHoursCalculation()
      }else{
        this.myReportsList = [];
      }
    },err=>{
      console.log(err);
    })
  }


  totalHoursCalculation(){
    this.totalHours = []
    for(let i in this.currentWeekDays){
      const day = this._db.getDateFormatted(this.currentWeekDays[i])
      const daysData =  this.myReportsList.filter(report=>report.report_date == day && report.report_status_id==ReportStatus.Approved)    
      if(daysData.length > 0){
        const dayTotal:number[] = []
        for(let i in daysData){
          dayTotal.push(daysData[i].duration)
        }
        const onDay =  dayTotal.reduce((a,b)=>a+b)
        this.totalHours.push(onDay)
      }else{
        this.totalHours.push(0)
      }
    }

    const weekWorkingHours = this.totalHours.reduce((a,b)=>a+b)
    this.totalHours.push(weekWorkingHours)    
  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}