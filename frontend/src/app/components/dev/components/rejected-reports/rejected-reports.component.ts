import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Activity, DevDailyReport, ReportStatus, ReportType } from 'src/app/interfaces/dev-daily-report';
import { Project} from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { SUB_TASk, Task } from 'src/app/interfaces/task';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';
import { Days } from '../time-sheet/time-sheet.component';

@Component({
  selector: 'app-rejected-reports',
  templateUrl: './rejected-reports.component.html',
  styleUrls: ['./rejected-reports.component.scss']
})
export class RejectedReportsComponent implements OnInit {

  myRejectedReports:DevDailyReport[] = [] ;
  reportToEdit:DevDailyReport;
  rejectedReportInEditMode:boolean = false;
  myReportsList:DevDailyReport[] = []
  myTasks:Task[]= []
  mySupportTasks:Task[] = []

  closeResult: string;
  managers:User[] = [];
  AccountPositionEnum = AccountPositions;
  seniors:User[] = [];

  currentUser:User;
  ActivityEnum = Activity;

  myProjectsList:Project[]= [];
  myProcess:SUB_TASk[] = [] ;
  taskTotalProgress:number = 0;
  reportTypes:ReportType[] = [];
  myTasksList:Task[] = [] ;
  selectedTask:Task | undefined;
  myProcessesList:SUB_TASk[] = [] ;
  displayModal=false;

  constructor(private modalService: NgbModal,
              private notify:NotificationService,
              private _db:DatabaseService,
              private _auth:AuthApiService) {
                this.reportToEdit = {
                  devID:'',
                  devName:'',
                  reportDate:new Date().toDateString(),
                  durationByHours:0,
                  time_activity:Activity.DAILY_TASK,
                  preApprovedDuration:0
                }
               }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      this.getDevREjectedReport();
      this.getDevProjectsAndProcessAndTasks();
      const userNavParamsSub:Subscription =  this._auth.getNavPermsByUserID(this.currentUser.key || '').subscribe(res=>{
        userNavParamsSub.unsubscribe();
        res.rejectedReport = 0;
        this._auth.updateNavPerms(res);
      })
    })
  }

  getDevREjectedReport(){
    this._db.getMyRejectedReports(this.currentUser.key || '').subscribe(res=>{
        
      if(res['status'] == ResStatus.CRUD){
        this.myRejectedReports = res['data'];
      }
    })
  }
  getReportTypes(){
    this._db.getReportTypes().subscribe(types=>{
      if(types['status'] == ResStatus.CRUD){
        this.reportTypes = types['data'];
      }
    })
  }


  // onEdit(){
  //   this.getReportTypes();
  //   this.getManagersAndSeniors();

    
  // }

  getProjectProcess(){
    this.myProcess = [];
    this.reportToEdit.processID = null;
    this.reportToEdit.taskID = null;
    this.myProcess = this.myProcessesList.filter(p=>p.project_key == this.reportToEdit.projectID)    
    for(let i in this.myProcess){
      let ps;
      if(this.reportToEdit.time_activity == Activity.DAILY_TASK){
        ps = this.myTasks.filter(t=>t.process_key == this.myProcess[i].key)
      }else if(this.reportToEdit.time_activity == Activity.SUPPORT){
        ps = this.mySupportTasks.filter(t=>t.process_key == this.myProcess[i].key)
      }
      if(!!ps && ps.length < 1){
        this.myProcess.splice(parseInt(i),1)
      }
    }
  }

  getDevProjectsAndProcessAndTasks(){
    this._db.getDevTasks(this.currentUser.key || '').subscribe(data=>{
      if(data['status'] == ResStatus.CRUD){
        this.myTasks = data['data'];
        this._db.getDevSupportTasks(this.currentUser.key || '').subscribe(res=>{
          if(res['status'] == ResStatus.CRUD){
            this.mySupportTasks = res['data']
            for(let i in res['data']){
              this.myTasks.push(data['data'][i])
            }
          }
        })
      }
    },
      (err)=>console.log(err)
    )

    this._db.getDevProjects(this.currentUser.key || '').subscribe(data=>{
        if(data['status'] == ResStatus.CRUD){
          this.myProjectsList = data['data']
        }
      }
    )

    this._db.getDevProcesses(this.currentUser.key  || '').subscribe(data=>{
      if(data['status'] == ResStatus.CRUD){
        this.myProcessesList = data['data']
      }
    })
  }

  editRejectedReport(report:DevDailyReport){
    this.getReportTypes();
    this.getManagersAndSeniors();
    

    this.reportToEdit = report;
    this.rejectedReportInEditMode = true;
    if(this.reportToEdit.report_status_id == ReportStatus.Pending_On_Manager){
      this.reportToEdit.seniorToApproveKey = null
      this.reportToEdit.seniorToApproveName = null
    }
    
    this.myProcess = [];
    this.myProcess = this.myProcessesList.filter(p=>p.project_key == this.reportToEdit.projectID)    
    for(let i in this.myProcess){
      let ps;
      if(this.reportToEdit.time_activity == Activity.DAILY_TASK){
        ps = this.myTasks.filter(t=>t.process_key == this.myProcess[i].key)
      }else if(this.reportToEdit.time_activity == Activity.SUPPORT){
        ps = this.mySupportTasks.filter(t=>t.process_key == this.myProcess[i].key)
      }
      if(!!ps && ps.length < 1){
        this.myProcess.splice(parseInt(i),1)
      }
    }

    this.myTasksList = [];
    if(this.reportToEdit.time_activity == Activity.DAILY_TASK){
      this.myTasksList = this.myTasks.filter(t=>t.process_key == this.reportToEdit.processID)
    }else if(this.reportToEdit.time_activity == Activity.SUPPORT){
      this.myTasksList = this.mySupportTasks.filter(t=>t.process_key == this.reportToEdit.processID)
    }
    this.getSelectedTask();
    this.getTaskProgress();
    
    if(!this.reportToEdit.preApprovedDuration){
      this.reportToEdit.preApprovedDuration = this.reportToEdit.durationByHours;
    }
  }


  changeDuration(){
    if(this.reportToEdit.time_activity == Activity.UNPAID_VACATION || this.reportToEdit.time_activity == Activity.OFFICIAL_VACATION){
      const rDate = new Date(this.reportToEdit.reportDate)
      this.reportToEdit.preApprovedDuration = 6;
      // this.db.getRamadanDay(`${rDate.getMonth()+1}/${rDate.getDate()}/${rDate.getFullYear()}`).subscribe(ramadan=>{      
      //   if(ramadan.length > 0){
      //   }else{
      //     this.reportToEdit.preApprovedDuration = 8;
      //   }
      // })
    }else{
      this.reportToEdit.preApprovedDuration = 0
    }
  }

  resetForm(){
    this.rejectedReportInEditMode = false;
    this.reportToEdit = {
      devID:'',
      devName:'',
      reportDate:new Date().toDateString(),
      durationByHours:0,
      details:"",
      progress:0 , 
      time_activity:Activity.DAILY_TASK,
      preApprovedDuration:0
    }
    this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  }
  getTaskProgress(){
    if(!!this.reportToEdit.taskID){
      this._db.getTaskProgress(this.reportToEdit.taskID).subscribe(res => {
        if(res['status'] == ResStatus.CRUD){
          this.taskTotalProgress = res['data']
        }
      })
    }
  }

  getTaskProgressOLd(){
    if(!this.rejectedReportInEditMode){
      if(!!this.reportToEdit.taskID){
        const reports =  this.myReportsList.filter(report => report.taskID == this.reportToEdit.taskID)
        
        let allPorgress:number[] = []
  
        reports.map(report => allPorgress.push(report.progress || 0))
        let progress = 0 ;
        if (allPorgress.length > 0){
          progress = allPorgress.reduce((a,b) => a+b)
        }else{
          progress = 0
        }
        return progress
      }else{
        return 0
      }
    }else{
      if(!!this.reportToEdit.taskID){
        
        // const i = this.myReportsList.findIndex(reports => reports.key == this.reportToEdit.key)
        // this.myReportsList[i].progress = this.reportToEdit.progress

        const reports =  this.myReportsList.filter(report => report.taskID == this.reportToEdit.taskID)
        
        let allPorgress:number[] = []
  
        reports.map(report => allPorgress.push(report.progress || 0))
        let progress = 0 ;
        if (allPorgress.length > 0){
          progress = allPorgress.reduce((a,b) => a+b)
          if(!!this.reportToEdit.progress){
            progress = progress + this.reportToEdit.progress
          }
        }else{
          progress = 0
        }
        return progress
      }else{
        return 0
      }
    }
    

  }



  validateReportData(){
    let invalid = false

    if((new Date(this.reportToEdit.reportDate).getDay() == Days.Friday || new Date(this.reportToEdit.reportDate).getDay() == Days.Saturday) && (this.reportToEdit.time_activity == Activity.UNPAID_VACATION ||this.reportToEdit.time_activity == Activity.OFFICIAL_VACATION ||this.reportToEdit.time_activity == Activity.IDEAL_HOURS) ){
      invalid = true;
      return this.notify.openSnackbar('You tried to fill a report on the weekend with invalid data!', SnackBarState.Error);
    }

    if(!!this.reportToEdit.details && this.reportToEdit.details.length <= 10 || this.reportToEdit.details == undefined){
      invalid = true;
      return this.notify.openSnackbar('Details Is Invalid Please Enter a valid Data!', SnackBarState.Error);
    }

    if(this.reportToEdit.durationByHours == undefined || this.reportToEdit.durationByHours <= 0){
      invalid = true;
      return this.notify.openSnackbar('Duration Is Invalid Please Enter a valid Data!', SnackBarState.Error);
    }

    if(this.reportToEdit.time_activity == Activity.DAILY_TASK && this.reportToEdit.taskID == undefined){
      invalid = true;
      return this.notify.openSnackbar('Task Is Invalid Please Enter a valid Data!', SnackBarState.Error);
    }


    if(this.reportToEdit.managerApprovalKey == undefined){
      invalid = true;
      return this.notify.openSnackbar('Please Choose Approval Manager!', SnackBarState.Error);
    }

    if(!this.rejectedReportInEditMode){
      if((!!this.reportToEdit.progress && (this.taskTotalProgress + this.reportToEdit.progress > 100)) || (!!this.reportToEdit.progress && (this.reportToEdit.progress <= 0  || this.reportToEdit.progress > 100) ) ){
        invalid = true
        return this.notify.openSnackbar('Your Progress Is Invalid!', SnackBarState.Error);
      }  
    }else{
      if((!!this.reportToEdit.progress && (this.taskTotalProgress > 100)) || (!!this.reportToEdit.progress && (this.reportToEdit.progress <= 0  || this.reportToEdit.progress > 100) ) ){
        invalid = true
        return this.notify.openSnackbar('Your Progress Is Invalid!', SnackBarState.Error);
      }
    }
    
    if(!invalid){
      if(this.rejectedReportInEditMode){
        this.saveEditedReport()
      }else{
        // this.createreportToEdit()
      }
    }


  }

  saveEditedReport(){
    // this.reportToEdit.durationByHours = this.reportToEdit.preApprovedDuration;

    if(!!this.reportToEdit.taskID){
      let task;
      if(this.reportToEdit.time_activity == Activity.DAILY_TASK){
        task =  this.myTasks.find(task=>task.key == this.reportToEdit.taskID)
      }else if(this.reportToEdit.time_activity == Activity.SUPPORT){
        task =  this.mySupportTasks.find(task=>task.key == this.reportToEdit.taskID)
      }
      this.reportToEdit.taskTitle = task?.title
      this.reportToEdit.projectID = task?.project_key
      this.reportToEdit.projectName= task?.project_title
      this.reportToEdit.processID = task?.process_key
      this.reportToEdit.processName= task?.process_title
    }


    if(this.reportToEdit.time_activity == Activity.IDEAL_HOURS){
      if(!!this.reportToEdit.projectID){ 
        this.reportToEdit.projectName = this.myProjectsList.find(project=>project.key == this.reportToEdit.projectID)?.title
      }else{
        this.reportToEdit.projectName = environment.staticFGSProjectTitle;
        this.reportToEdit.projectID = environment.staticFGSProjectKey;
      }
    }

    if(!!this.reportToEdit.seniorToApproveKey && this.reportToEdit.seniorToApproveKey.length > 0){
      const serName = this.seniors.find(user=>this.reportToEdit.seniorToApproveKey == user.key)?.username ;
      if(!!serName){
        this.reportToEdit.seniorToApproveName = serName 
      }

      this.reportToEdit.managerApprovalKey = '';
      this.reportToEdit.managerApprovalname = '';
      this.reportToEdit.report_status_id = ReportStatus.Pending_On_Senior;

    }else{
      const manName = this.managers.find(user=>this.reportToEdit.managerApprovalKey == user.key)?.username ;
      if(!!manName){
        this.reportToEdit.managerApprovalname = manName 
      }
      this.reportToEdit.report_status_id = ReportStatus.Pending_On_Manager;
    }

    

    this._db.editReport(this.reportToEdit).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.rejectedReportInEditMode = false;
        this.notify.openSnackbar("Report Edited Successfully!" , SnackBarState.Success)
        this.reportToEdit = {
          devID:'',
          devName:'',
          reportDate:new Date().toDateString(),
          durationByHours:0,
          details:"",
          progress:0 , 
          time_activity:Activity.DAILY_TASK,
          preApprovedDuration:0
        }
        this.getDevREjectedReport()
      }else{
        this.notify.openSnackbar("Error !" , SnackBarState.Error)
      }
    },err=>{
      this.notify.openSnackbar("Error !" , SnackBarState.Error)
    })
  }

  // saveEditedReport(){

  //   this.notify.openDialog(
  //     'Edit Report ?!',
  //     `Are you sure you want to edit This Report ?!`,
  //     false,
  //     "* By Editing this Report You It Will be sent again To Manager !!",
  //     true,
  //     false).subscribe(response => {
  //       if (response) {
  //         this.reportToEdit.rejected = false;
  //         if(!!this.reportToEdit.processID){
  //           this.reportToEdit.processName = this.myProcess.find(p=>p.key == this.reportToEdit.processID)?.title
  //         }

  //         if(!!this.reportToEdit.projectID){
  //           this.reportToEdit.projectName = this.myProjectsList.find(p=>p.key == this.reportToEdit.projectID)?.title
  //         }

  //         if(!!this.reportToEdit.taskID){
  //           this.reportToEdit.taskTitle = this.myTasks.find(t=>t.key == this.reportToEdit.taskID)?.title
  //         }
          
  //         this.reOpenReport(this.reportToEdit)
  //         this.rejectedReportInEditMode = false;
  //           // this.notify.openSnackbar("Report Edited Successfully!" , SnackBarState.Success)
  //           this.reportToEdit = {
  //             devID:'',
  //             devName:'',
  //             reportDate:new Date().toDateString(),
  //             durationByHours:0,
  //             details:"",
  //             progress:0 , 
  //             time_activity:Activity.DAILY_TASK,
  //             preApprovedDuration:0
  //         }
  //       } else {
  //         this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  //       }
  //     });



   
  // }


  // reOpenReport(report:DevDailyReport){
    
  //   this.db.moveFromRejectedReportToPending(report).then(
  //     (data)=>{
  //       this.db.deleteRejectedDevDailyReport(report).then(
  //         ()=>{
  //           this.notify.openSnackbar("Report Edited Successfully!" , SnackBarState.Success)
  //         }
  //       ).catch(
  //         ()=>{
  //           this.notify.openSnackbar("Error !" , SnackBarState.Error)
  //         }
  //       )
  //     }
  //   ).catch(
  //     ()=>{
  //       this.notify.openSnackbar("Error !" , SnackBarState.Error)
  //     }
  //   )
  // }



  open(content , report:DevDailyReport) {
    this.displayModal=true
    this.editRejectedReport(report);
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  getProcessTasks(){
    this.myTasksList = [];
    this.reportToEdit.taskID = null;
    if(this.reportToEdit.time_activity == Activity.DAILY_TASK){
      this.myTasksList = this.myTasks.filter(t=>t.process_key == this.reportToEdit.processID)
    }else if(this.reportToEdit.time_activity == Activity.SUPPORT){
      this.myTasksList = this.mySupportTasks.filter(t=>t.process_key == this.reportToEdit.processID)
    }
  }

  getSelectedTask(){
    const selectedTask = this.myTasks.find(t=>t.key == this.reportToEdit.taskID)
    if(!!selectedTask){
      this.selectedTask = selectedTask;
      if(this.selectedTask.seniorToApproveID){
        if(this.selectedTask.seniorIsMandatory){
          this.reportToEdit.seniorToApproveKey = this.selectedTask.seniorToApproveID;
          this.reportToEdit.seniorToApproveName = this.selectedTask.seniorToApproveName;
          this.seniors = this.seniors.filter(s=>s.key == this.selectedTask?.seniorToApproveID)
        }else{
          this.seniors = this.seniors.filter(s=>s.key == this.selectedTask?.seniorToApproveID)
        }
      }else{
        this.getManagersAndSeniors()
        this.selectedTask = undefined;
        this.reportToEdit.seniorToApproveKey = null;
        this.reportToEdit.seniorToApproveName = null;
      }
    }else{
      this.selectedTask = undefined;
      this.reportToEdit.seniorToApproveKey = null;
      this.reportToEdit.seniorToApproveName = null;
      this.getManagersAndSeniors()
    }
  }

  getManagersAndSeniors(){
    this._auth.getUserByFilter(Department.TECHNICAL_TEAM , AccountRoles.Automation_Engineer , AccountPositions.MANAGER).subscribe(pms=>{      
      if(pms['status'] == ResStatus.CRUD){
        this.managers = pms['data']
      }
      this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(managers=>{      
        if(managers['status'] == ResStatus.CRUD){
          managers['data'].map((man)=>this.managers.push(man))
        }
      }) 
    })  

    this._auth.getUserByFilter(Department.TECHNICAL_TEAM , AccountRoles.Automation_Engineer , AccountPositions.SENIOR).subscribe(sers=>{           
      if(sers['status'] == ResStatus.CRUD){
        this.seniors = sers['data'];
      }
    })  


  }


}
