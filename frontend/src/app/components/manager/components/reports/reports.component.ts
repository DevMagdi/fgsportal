import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import {DevDailyReport, monthlyReport,  projectsReports } from 'src/app/interfaces/dev-daily-report';
import { Project, Status } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Task, TaskType } from 'src/app/interfaces/task';
import { AccountPositions, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  encapsulation: ViewEncapsulation.None

  filtersList:Status[] = [];
  StatusEnum = Status;
  taskTypeEnum = TaskType;
  taskTypefilter:TaskType | null;

  currentWeekDays:Date[] = [];
  myUsersList:User[]=[];
  myBAList:User[]=[];
  userToSeeReport:string ;
  myReportsList:DevDailyReport[] = []
  totalHours:Array<number>= []
  unCompletedTasks:Task[]=[];
  filteredTasks:Task[]=[];
  overDueTasks:Task[]=[];


  unCompletedProjects:Project[]=[]
  runningProjects:Project[]=[]

  today:string = '' ;

  reportByMonth:boolean = false ;

  allDevsReports:Array<any> = []
  finalMonthlyReport:Array<monthlyReport> = []
  finalProjectsReport:projectsReports[] = []
  DepartmentEnum = Department;
  AccountPositionsEnum = AccountPositions;
  interval;

  loadingSpinnerMode:boolean = false;

  getToday = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
  fileName= `${this.getToday}.xlsx`;
  currentUser:User;
  devWeeklyReport_Dev_ID:string;

  private mytask:Subscription;

  constructor(private notify:NotificationService,
              private excelServ:ExportExcelService,
              private _db:DatabaseService,
              private _auth:AuthApiService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(
      (user)=>{
        this.currentUser = user ;
      },(err)=>{
        console.log(err);
      }
    )

    const day = new Date()
    this.today = `${day.getUTCMonth()+1}/${day.getUTCDate()}/${day.getUTCFullYear()}`    
    if(!this.reportByMonth){
      this.getWeek(new Date)
    }else{
      this.getMonth(new Date)
    }


    this._auth.getUserByFilter(Department.TECHNICAL_TEAM).subscribe(res=>{
      if(res['status'] ==ResStatus.CRUD){
        const devs = res['data'] as User[];
        this.myUsersList= devs.filter(d=>d.accPosition != AccountPositions.MANAGER)
        this.myUsersList = this.myUsersList.sort((a,b)=>{
          return compare(a.username, b.username, true);
        })
      }
    })

   

    this._db.getAllProjects().subscribe(projects=>{     
      if(projects['status'] == ResStatus.CRUD){
        this.unCompletedProjects = projects['data'];
      }
    },err=>{
      console.log(err);
    })

    this.getRunningTasks();
    this.getOverDueTasks();
  }

  getOverDueTasks(){
    this._db.getOverDueTasks().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.overDueTasks = res['data']
      }      
    })
  }

  getRunningTasks(){
    this._db.getRunningTasks().subscribe(res=>{      
      if(res['status'] == ResStatus.CRUD){
        this.unCompletedTasks = res['data']
        this.filteredTasks = res['data']
      }
      
    })
  }

  getDevReportsByDate(date){
    console.log(date);
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

  getDevReports(){
    const start = this._db.getDateFormatted(this.currentWeekDays[0])
    const end = this._db.getDateFormatted(this.currentWeekDays[this.currentWeekDays.length-1])
    this._db.getManagerDevDailyReport(this.devWeeklyReport_Dev_ID,start,end ).subscribe(res=>{
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
      const daysData =  this.myReportsList.filter(report=>report.reportDate == day)      
      if(daysData.length > 0){
        const dayTotal:number[] = []
        for(let i in daysData){
          dayTotal.push(daysData[i].durationByHours)
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

  getTotalMonthlyReport(date){
    this.finalMonthlyReport = [];

    this._db.getDevMonthlyReport(date).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.finalMonthlyReport = res['data'];
      }else{
        this.finalMonthlyReport = [];
      }
    })
  }
  // getTotalMonthlyReportold(date){  
  //   this.loadingSpinnerMode = true 
  //   this.allDevsReports = []
  //   this.finalMonthlyReport = []    
  //   this.getMonth(new Date(date))
  //   // console.log(this.currentWeekDays);
    
  //   for(let i in this.myUsersList){      
  //     let devRepors:DevDailyReport[] = []
  //     this.db.getDevDailyReport(this.myUsersList[i].key).subscribe(
  //       (data)=>{
  //         this.myReportsList = data
  //         if(!!data && data.length > 0){
  //           for(let d in this.currentWeekDays){
  //             for (let r in data){
  //               if(data[r].reportDate == this.currentWeekDays[d].toLocaleDateString()){
  //                 devRepors.push(data[r])
  //               }
  //             }
  //           }
  //         }
  //         let eachDev: {[k: string]: any} = {}
  //         eachDev[this.myUsersList[i].username] = devRepors
  //         this.allDevsReports.push(eachDev)
          
  //         if(this.myUsersList.length == this.allDevsReports.length){
  //           for (let i = 0 ; i < this.allDevsReports.length ; i++){

  //             let devR:monthlyReport = {
  //               devName: "",
  //               actualWorkingHours : 0 ,
  //               idealHours:0, 
  //               officalVacations:0,
  //               unpaidVacations:0,
  //               total:0
  //             } 
    
  //             devR.devName = Object.keys(this.allDevsReports[i])[0] 
  //             let myArr = this.allDevsReports[i][Object.keys(this.allDevsReports[i])[0]]
              
  //             if(myArr.length > 0){
  //               // console.log(myArr);
                
  //               const totalHours =  myArr.map(report => report.durationByHours)
  //               if(totalHours.length > 0){
  //                 devR.total =  totalHours.reduce((a,b)=>a+b)
  //               }else{
  //                 devR.total = 0
  //               }
    
    
  //               let actualWorkingHours = myArr.filter(report => report.time_activity != Activity.UNPAID_VACATION && report.time_activity != Activity.OFFICIAL_VACATION && report.time_activity != Activity.IDEAL_HOURS)
  //               const onlyHours =  actualWorkingHours.map(report => report.durationByHours)
  //               if(onlyHours.length > 0){
  //                 devR.actualWorkingHours =  onlyHours.reduce((a,b)=>a+b)
  //               }else{
  //                 devR.actualWorkingHours = 0
  //               }
    
    
  //               let idealHours = myArr.filter(report => report.time_activity == Activity.IDEAL_HOURS)
  //               const onlyIdealsHours =  idealHours.map(report => report.durationByHours)
  //               if(onlyIdealsHours.length > 0){
  //                 devR.idealHours = onlyIdealsHours.reduce((a,b)=>a+b)
  //                 // console.log(totalIdealsHours)
  //               }else{
  //                 devR.idealHours = 0 
  //                 // console.log(totalIdealsHours)
  //               }
    
  //               let officalVacations = myArr.filter(report => report.time_activity == Activity.OFFICIAL_VACATION)
  //               const onlyVacationsHours =  officalVacations.map(report => report.durationByHours)
  //               if(onlyVacationsHours.length > 0){
  //                 devR.officalVacations = onlyVacationsHours.reduce((a,b)=>a+b)
  //                 // console.log(totalOVacationsHours)
  //               }else{
  //                 devR.officalVacations = 0 
  //                 // console.log(totalOVacationsHours)
  //               }
    
  //               let unpaidVacations = myArr.filter(report => report.time_activity == Activity.UNPAID_VACATION)
  //               const onlyunPaidVacationsHours =  unpaidVacations.map(report => report.durationByHours)
  //               if(onlyunPaidVacationsHours.length > 0){
  //                 devR.unpaidVacations = onlyunPaidVacationsHours.reduce((a,b)=>a+b)
  //                 // console.log(totalUnpaidVacationsHours)
  //               }else{
  //                 devR.unpaidVacations = 0 
  //                 // console.log(totalUnpaidVacationsHours)
  //               }            
  //             }else{
  //               devR.actualWorkingHours = 0 
  //               devR.idealHours = 0 
  //               devR.officalVacations = 0 
  //               devR.unpaidVacations = 0 
  //               devR.total = 0
  //             }
  //             // console.log(devR);
  //             this.finalMonthlyReport.push(devR)
  //           }
  
  
  //           this.getWeek(new Date)
  //           this.loadingSpinnerMode = false
  //         }

         

  //       },
  //       (err)=>{
  //         console.log(err);
  //       }
  //     )
  //   }
  // }

  
  
  exportDevsMonthlyReport():void{
    let element = document.getElementById('devsMonthlyReport'); 
    this.excelServ.exportexcel(element , `monthlyReport${this.fileName}`)
  }


   exportOverDueTasksReport():void{
    let element = document.getElementById('overDueTasksReport'); 
    this.excelServ.exportexcel(element , `overdue${this.fileName}`)
   }


   exportRunningTasksReport():void{
    let element = document.getElementById('runningTasksReport'); 
    this.excelServ.exportexcel(element , `runningTasks${this.fileName}`)
   }

   exportRunningprojectsReport():void{
    let element = document.getElementById('runningProjectsReport'); 
    this.excelServ.exportexcel(element , `runningProjects${this.fileName}`)
   }
  
  returnReportToPending(report:DevDailyReport){
  this.notify.openDialog(
    'Return To Pending ?!',
    `Are you sure you want To Return This Report To Pending ?!`,
    false,
    "",
    true,
    false).subscribe(response => {
      if (response) {


        this._db.returnReportToPending(report.key || '').subscribe(res=>{
          console.log(res);
          
          if(res['status'] == ResStatus.CRUD){
            this.getDevReports();
            this.notify.openSnackbar('Report Moved To Pending SuccessFully' , SnackBarState.Success)
          }else{
            this.notify.openSnackbar('Something Wrong , please contact system administrator' , SnackBarState.Warning)
          }
        },err=>{
          console.log(err);
          this.notify.openSnackbar('Something Wrong , please contact system administrator' , SnackBarState.Warning)
        })
      }
    });   
}

  // returnReportToPendingOLD(report:DevDailyReport){
  //   this.notify.openDialog(
  //     'Return To Pending ?!',
  //     `Are you sure you want To Return This Report To Pending ?!`,
  //     false,
  //     "",
  //     true,
  //     false).subscribe(response => {
  //       if (response) {

  //         if(!!report.taskID){
  //           this.mytask = this.db.getTaskByID(report.taskID).subscribe(
  //             (task)=>{
  //               console.log(task);
  //               this.mytask.unsubscribe()
                
  //               if(!!task){
  //                 if(!!task.real_duration){
  //                   task.real_duration = task.real_duration - report.durationByHours
  //                 }else{
  //                   task.real_duration =  report.durationByHours
  //                 }
  //                 this.db.editTask(task)
  //                 .then(()=>{console.log("success")})
  //                 .catch((err)=>{console.log(err);})
  //               }
                
  //               this.projectProgressCalculation(report.projectID || '')
  //             }
  //           )
  //         }
          


  //         if(report.time_activity == Activity.IDEAL_HOURS){
  //           if(!!report.projectID && report.projectID != 'FGS'){
  //             const getProject:Subscription = this.db.getProjectByID(report.projectID).subscribe(
  //               (project)=>{
  //                 if(!!project){
  //                   if(!!project.idelHoues){
  //                     project.idelHoues -= report.durationByHours;
  //                     this.db.updateProject(project)
  //                     getProject.unsubscribe()
  //                   }else{
  //                     project.idelHoues = 0 ;
  //                     getProject.unsubscribe()
  //                   }
  //                 }else{
  //                   getProject.unsubscribe()
  //                 }
  //               }
  //             )
  //           }
  //         }

  //         report.approved = false;

  //         this.db.createDevDailyReport(report).then(
  //           ()=>{
  //             this.db.deleteApprovedDevDailyReport(report).then(
  //               ()=>{
  //                 this.notify.openSnackbar('Report Moved To Pending SuccessFully' , SnackBarState.Success)
  //               }
  //             )
  //           }
  //         )
  //       }
  //     });   
  // }


  // projectProgressCalculation(projectKey:string){
  //   const getProjectSubsc:Subscription = this.db.getProjectByID(projectKey).subscribe(
  //     (project)=>{
  //         getProjectSubsc.unsubscribe();
  //         const getProjectReportsSubsc:Subscription =  this.db.getReportsByProject(project.key || '').subscribe(
  //           (reports)=>{
  //             getProjectReportsSubsc.unsubscribe();
  //             if(reports.length > 0){
  //               reports.map(report=>{
  //                 if(!report.progress){
  //                   report.progress = 0;
  //                 }
  //               })
  
  //               const total:number[] = []
  
  //               reports.map(repor=>{total.push(repor.progress ?? 0)})                
  //               const totalProgress = total.reduce((a,b)=>{return a+b})


  //               const getProjectTasksSubsc:Subscription =  this.db.getProjectTasks(project.key || '').subscribe(
  //                 (tasks)=>{
  //                   getProjectTasksSubsc.unsubscribe();
  //                   if(tasks.length > 0){
  //                     project.progress = totalProgress / tasks.length                      
  //                   }else{
  //                     project.progress = 0
  //                     // this.db.updateProject(project)
  //                   }
  //                   this.db.updateProject(project)
  //                 }
  //               )
  //             }else{
  //               project.progress = 0 ;
  //               this.db.updateProject(project)

  //             }
  //           }
  //         )          
  //     }
  //   )
  // }

  filterRunnignTasks(){    
    this.unCompletedTasks = this.filteredTasks ; 
    if(this.filtersList.length > 0){
      this.unCompletedTasks = [];
      for (let i in this.filteredTasks){
        const found = this.filtersList.find(status=>this.filteredTasks[i].status == status)
        if(!!found){
          this.unCompletedTasks.push(this.filteredTasks[i])
        }
      }
    }else{
      this.unCompletedTasks = this.filteredTasks; 
    } 
  }

  filterByTaskType(){
    this.unCompletedTasks = this.filteredTasks ; 
    if(!!this.taskTypefilter && this.taskTypefilter.length > 0){
      this.unCompletedTasks = this.filteredTasks.filter(task=>task.type == this.taskTypefilter);
    }else{
      this.unCompletedTasks = this.filteredTasks; 
    } 
  }


  filtertasks(){
    
    this.unCompletedTasks = [];
    

    if((!!this.taskTypefilter && this.taskTypefilter.length > 0) || (!!this.filtersList && this.filtersList.length > 0)){      
      for (let i in this.filteredTasks){
        const found = this.filtersList.find(status=>this.filteredTasks[i].status == status)
        if(!!found){
          this.unCompletedTasks.push(this.filteredTasks[i])
        }
      }
      
      if(!!this.taskTypefilter && this.taskTypefilter.length > 0){
        this.unCompletedTasks = this.unCompletedTasks.filter(task=>task.type == this.taskTypefilter);
      }
      
    }else{
      this.unCompletedTasks = this.filteredTasks; 
    }
  }


  resetFilter(){
    this.unCompletedTasks = this.filteredTasks;
    this.filtersList = [];
    this.taskTypefilter = null;
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}