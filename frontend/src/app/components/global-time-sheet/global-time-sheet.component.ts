import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from '../snackbar/snackbar.component';
import { Days } from '../dev/components/time-sheet/time-sheet.component';
import { Activity, ReportStatus, ReportType } from 'src/app/interfaces/dev-daily-report';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminReports } from 'src/app/interfaces/admin-reports';
import { AdminTasks } from 'src/app/interfaces/admin-tasks';

@Component({
  selector: 'app-global-time-sheet',
  templateUrl: './global-time-sheet.component.html',
  styleUrls: ['./global-time-sheet.component.scss']
})
export class GlobalTimeSheetComponent implements OnInit {
  currentUser:User;
  globaltimesheetLoader:boolean = false;
  days = Days;
  currentWeekDays:Date[] = [];
  myTasksList:Task[] = [] ;
  myReportsList:AdminReports[] = []
  totalHours:Array<number>= []
  reportInEditMode:boolean = false;
  managers:User[] = [];
  publicDate:Date;
  today:Date;
  AccountPositionEnum = AccountPositions;
  reportTypes:ReportType[] = [];
  reportStatusEnum = ReportStatus;
  
  editMode:boolean;
  ActivityEnum = Activity;
  newGlobalReportForm:FormGroup = new FormGroup({
    'report_date':new FormControl(null, Validators.required),
    'task_id':new FormControl(null),
    'duration':new FormControl(null,Validators.required),
    'report_details':new FormControl(null,Validators.required),
    'report_progress':new FormControl(null),
    'manager_approve_id':new FormControl(null,Validators.required),
    'report_type_id':new FormControl(null,Validators.required),
    'report_id':new FormControl(null)
  })

  myTasks:AdminTasks[]=[];

  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private router:Router,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this._auth.getCurrentLoggedInUser()?.subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.currentUser = res['data'];
        if(!this.currentUser.canAddPreviousReports){
          this.newGlobalReportForm.get('report_date')?.disable();
        }else{
          this.newGlobalReportForm.get('report_date')?.enable();
        }
        this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
          if(perms['status'] == ResStatus.CRUD){
            const allperms:UserPermissions[] = perms['data'];
            const checking = allperms.find(p=>p.permission_id == 12)
            if(!!checking){
              const timeSubscrib:Subscription = this._db.getServerTime().subscribe(
                (date)=>{
                  timeSubscrib.unsubscribe()                
                  // try to get the date from API And If it is not working get it from local time
                  this.today = date;
                  const today =  `${new DatePipe('en-Us').transform(date, 'EEE MMM dd yyyy', 'GMT')}`;
                  let first = new Date(today).getDate() - (new Date(today).getDay() ) 
                  let last = first + 6  
          
                  let firstday = new Date(new Date(today).setDate(first))
                  let lastday = new Date(new Date(today).setDate(last))
                  while(firstday <= lastday){
                    this.currentWeekDays.push(new Date(firstday))
                    firstday = new Date(firstday.setDate(firstday.getDate()+1));
                  }
          
          
                  if(this.currentWeekDays.length < 7){
                    console.log('Loaded From Local');
                    this.today = new Date();
                    // this.newReport.reportDate = new Date().toDateString();
                    this.resetReportFormDate();
          
                    const today = new Date();
                    let first = today.getDate() - (today.getDay() )
                    let last = first + 6  
                    let firstday = new Date(new Date().setDate(first))
                    let lastday = new Date(new Date().setDate(last))
                    while(firstday <= lastday){
                      this.currentWeekDays.push(new Date(firstday))
                      firstday = new Date(firstday.setDate(firstday.getDate()+1));
                    }
                    this.getMyReports();
          
                    // this.getUserData()
                  }else{
                    console.log('Loaded From public');
                    // console.log(new Date(this.today).toDateString());
                    // console.log(new DatePipe('en-Us').transform(this.today, 'EEE MMM dd yyyy', 'GMT'));
                    
                    // this.newReport.reportDate = `${new DatePipe('en-Us').transform(this.today, 'EEE MMM dd yyyy', 'GMT')}`;
                    // this.getUserData()
                    this.resetReportFormDate();
                    this.getMyReports();
                    
                    
                  }
                },err=>{
                  console.log('Loaded From Local');
                  this.today = new Date();
                  // this.newReport.reportDate = new Date().toDateString();
                  this.resetReportFormDate();
          
                  const today = new Date();
                  let first = today.getDate() - (today.getDay())
                  let last = first + 6  
                  let firstday = new Date(new Date().setDate(first))
                  let lastday = new Date(new Date().setDate(last))
                  while(firstday <= lastday){
                    this.currentWeekDays.push(new Date(firstday))
                    firstday = new Date(firstday.setDate(firstday.getDate()+1));
                  }
                  this.getMyReports();
          
                  // this.getUserData()
                }
              ) 
            }else{
              this._db.createSystemLogs(
                `Unautorized user ${this.currentUser.username} tried to access my work page At ${new Date().toLocaleString()}`,
                `Unautorized user ${this.currentUser.key} tried to access my work page At ${new Date().toLocaleString()}`,
                this.currentUser.key || '',
                this.currentUser.username,
                'Faild'
              ).subscribe(res=>{
                this._notify.openSnackbar(`You Don't Have Permission To Access This Page` , SnackBarState.Warning , 10000)
                this.router.navigate(['/']) 
              })
            }
          }
        },err=>{
          console.log(err);
        })
      }else{
        this.router.navigate(['/'])
      }
    })
  }


  getDate(date){
    const day =  `${date.getDate()}`
    const month =  `${date.getMonth() + 1}`
    const year =  date.getFullYear()
    const realDate = `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year}`    
    return realDate
  }

  deleteReport(report:AdminReports){
    this.globaltimesheetLoader = true;
    this._notify.openDialog(
      'Delete Report ?!',
      `Are you sure you want to delete This Report ?!`,
      false,
      '* Deleteing this task Report not be restored !!',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deletePendingAdminReport(report.id || '').subscribe(res=>{
            this.globaltimesheetLoader = false;
            if(res['status'] == ResStatus.CRUD){
              this._notify.openSnackbar('Report Deleted Successfully!', SnackBarState.Success);
              this.getMyReports()
            }else{
              this._notify.openSnackbar('Somthing Wrong!', SnackBarState.Error , 5000);
            }
          },err=>{
            this.globaltimesheetLoader = false;
            this._notify.openSnackbar('Somthing Wrong!', SnackBarState.Error , 5000);
            console.log(err);
          })   
          
        } else {
          this.globaltimesheetLoader = false;
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

  // getDevDailyReport(){
  //   this._db.getDevDailyReport(this.currentUser.key  || '', this.currentWeekDays[0] , this.currentWeekDays[this.currentWeekDays.length - 1]).subscribe(data=>{        
  //     if(data['status'] == ResStatus.CRUD){
        
  //       this.myReportsList = data['data']
  //       this.totalHoursCalculation()
        
  //     }else if(data['status'] == ResStatus.Success_But_Empty){
  //       this.myReportsList = [];
  //     }
  //   },console.log) 
  // }

  totalHoursCalculation(){
    this.totalHours = []
    for(let i in this.currentWeekDays){
      const day = this.getDate(this.currentWeekDays[i])
      const daysData =  this.myReportsList.filter(report=>report.report_date == day)
      if(daysData.length > 0){
        const dayTotal:number[] = []
        for(let i in daysData){
          if(daysData[i].report_status_id != ReportStatus.Rejected){
            dayTotal.push(daysData[i].duration)
          }
        }
        const onDay =  dayTotal.reduce((a,b)=>a+b)
        this.totalHours.push(onDay)
      }else{
        this.totalHours.push(0)
      }
    }
  }

  openNewReportForm(){
    this.getManagers();
    this.getReportTypes();
    this.getMyTasks();
  }

  getMyTasks(){
    this._db.getMyAdminRunningTasks().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.myTasks = res['data'];
      }else{
        this.myTasks = [];
      }
    },err=>{
      this.myTasks = [];
    })
  }

  closeForm(){
    this.newGlobalReportForm.reset();
    this.resetReportFormDate();
    this.editMode = false;
  }

  getManagers(){
    this._auth.getUserByFilter(this.currentUser.department , undefined , AccountPositions.MANAGER).subscribe(pms=>{      
      if(pms['status'] == ResStatus.CRUD){
        this.managers = pms['data']
      }
      this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(managers=>{      
        if(managers['status'] == ResStatus.CRUD){
          managers['data'].map((man)=>this.managers.push(man))
        }
      }) 
    })
  }


  getReportTypes(){
    this._db.getReportTypes().subscribe(types=>{
      if(types['status'] == ResStatus.CRUD){
        this.reportTypes = types['data'];
      }
    })
  }



  validateReportData(){
    this.globaltimesheetLoader = true;
    let invalid = false;    
    
    const todayDate = new DatePipe('en-Us').transform(this.today, 'yyyy-M-d', 'GMT');
    const d = this.newGlobalReportForm.get(['report_date'])?.value
    const reportDate =`${new Date(d).getFullYear()}-${new Date(d).getMonth() + 1}-${new Date(d).getDate()}`
    if(!this.currentUser.canAddPreviousReports){
      if(todayDate != reportDate){
        invalid = true;
        this.globaltimesheetLoader = false;
        return this._notify.openSnackbar(`Stop Sheeting Ya ${this.currentUser.username},You tried to fill a report with wrong date!`, SnackBarState.Error , 10000);
      }
    }

    const details = this.newGlobalReportForm.get(['report_details'])?.value


    if((!!details && details.trim().length <= 10)|| details == undefined){
      invalid = true;
      this.globaltimesheetLoader = false;

      return this._notify.openSnackbar('Details Is Invalid Please Enter a valid Data!', SnackBarState.Error , 5000);
    }


    const duration = this.newGlobalReportForm.get(['duration'])?.value

    if(duration == undefined || duration <= 0){
      invalid = true;
      this.globaltimesheetLoader = false;

      return this._notify.openSnackbar('Duration Is Invalid Please Enter a valid Data!', SnackBarState.Error , 5000);
    }
    
    const manager_approve_id = this.newGlobalReportForm.get(['manager_approve_id'])?.value

    if( manager_approve_id == undefined || manager_approve_id.length <= 0 ){
      invalid = true;
      this.globaltimesheetLoader = false;
      return this._notify.openSnackbar('Please Choose Approval Manager Or Senior!', SnackBarState.Error , 5000);
    }

    // if(!this.reportInEditMode){
    //   if((!!this.newReport.progress && (this.taskTotalProgress + this.newReport.progress > 100)) || (!!this.newReport.progress && (this.newReport.progress <= 0  || this.newReport.progress > 100) ) ){
    //     invalid = true
    //     this.globaltimesheetLoader = false;
    //     return this._notify.openSnackbar('Your Progress Is Invalid!', SnackBarState.Error);
    //   }  
    // }else{
    //   if((!!this.newReport.progress && (this.taskTotalProgress > 100)) || (!!this.newReport.progress && (this.newReport.progress <= 0  || this.newReport.progress > 100) ) ){
    //     invalid = true
    //     this.globaltimesheetLoader = false;
    //     return this._notify.openSnackbar('Your Progress Is Invalid!', SnackBarState.Error);
    //   }
    // }
    
    if(!invalid){
      if(this.reportInEditMode){
        this.saveEditedReport()
      }else{
        this.createNewReport()
      }
    }else{
      this.globaltimesheetLoader = false;
    }

  }

  createNewReport(){
    this.globaltimesheetLoader = true;
    const newReport:AdminReports = {
      report_date:this._db.getDateFormatted(this.newGlobalReportForm.get('report_date')?.value),
      duration:this.newGlobalReportForm.get('duration')?.value,
      report_details:this.newGlobalReportForm.get('report_details')?.value,
      report_progress:this.newGlobalReportForm.get('report_progress')?.value,
      manager_approve_id:this.newGlobalReportForm.get('manager_approve_id')?.value,
      report_type_id:this.newGlobalReportForm.get('report_type_id')?.value,
    }


    if(!!this.newGlobalReportForm.get('task_id')?.value){
      newReport.task_id = this.newGlobalReportForm.get('task_id')?.value;
    }


    this._db.createNewAdminReport(newReport).subscribe(res=>{
      this.globaltimesheetLoader = false;
      if(res['status'] == ResStatus.CRUD){
        this._notify.openSnackbar('Success', SnackBarState.Success);
        this.newGlobalReportForm.reset();
        this.resetReportFormDate();
        this.globaltimesheetLoader = false;
        this.getMyReports();
      }else{
        this._notify.openSnackbar(`${JSON.stringify(res['data'])}`, SnackBarState.Success);
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Status ${JSON.stringify(res['status'])} =>  Error ${JSON.stringify(res['data'])} while creating his report ${JSON.stringify(newReport)}`,
          `${this.currentUser.key} Has Error while creating his report`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Faild'
        ).subscribe()
        this.globaltimesheetLoader = false;
      }
    },err=>{
      this._notify.openSnackbar(`${JSON.stringify(err['error']['data'])}`, SnackBarState.Error , 5000)
      this._db.createSystemLogs(
        `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while creating his report ${JSON.stringify(newReport)}`,
        `${this.currentUser.key} Has Error while creating his report`,
        this.currentUser.key || '',
        this.currentUser.username,
        'Faild'
      ).subscribe()
      this.globaltimesheetLoader = false;
    })
  }


  resetReportFormDate(){
    this.newGlobalReportForm.patchValue({
      // report_date:this.today ? `${new DatePipe('en-Us').transform(this.today, 'EEE MMM dd yyyy', 'GMT')}` : new Date().toDateString()
      report_date:this._db.getDateFormattedYearMonthDay(this.today)
    })
  }



  getMyReports(){
    this._db.getAdminReports(this.currentUser.key  || '', this.currentWeekDays[0] , this.currentWeekDays[this.currentWeekDays.length - 1]).subscribe(data=>{        
      if(data['status'] == ResStatus.CRUD){
        
        this.myReportsList = data['data']
        this.totalHoursCalculation()
        
      }else if(data['status'] == ResStatus.Success_But_Empty){
        this.myReportsList = [];
      }
    },console.log) 
  }




  editReport(report:AdminReports){
    this.getReportTypes();
    this.getManagers();
    this.reportInEditMode = true;
    this.newGlobalReportForm.patchValue({
      'report_date':this._db.getDateFormattedYearMonthDay(report.report_date),
      'duration':report.duration,
      'report_details':report.report_details,
      'report_progress':report.report_progress,
      'manager_approve_id':report.manager_approve_id,
      'report_type_id':parseInt(report.report_type_id||''),
      'task_id':report.task_id,
      'report_id':report.id
    })
    // this.newReport = report
    // if(!this.newReport.preApprovedDuration){
    //   this.newReport.preApprovedDuration = this.newReport.durationByHours;
    // }    
  }


  saveEditedReport(){
    this.globaltimesheetLoader = true;
    const newReport:AdminReports = {
      report_date:this._db.getDateFormatted(this.newGlobalReportForm.get('report_date')?.value),
      duration:this.newGlobalReportForm.get('duration')?.value,
      report_details:this.newGlobalReportForm.get('report_details')?.value,
      report_progress:this.newGlobalReportForm.get('report_progress')?.value,
      manager_approve_id:this.newGlobalReportForm.get('manager_approve_id')?.value,
      report_type_id:this.newGlobalReportForm.get('report_type_id')?.value,
      id:this.newGlobalReportForm.get('report_id')?.value,
    }


    if(!!this.newGlobalReportForm.get('task_id')?.value){
      newReport.task_id = this.newGlobalReportForm.get('task_id')?.value;
    }


    this._db.updateAdminReport(newReport).subscribe(res=>{
      this.globaltimesheetLoader = false;
      if(res['status'] == ResStatus.CRUD){
        this._notify.openSnackbar('Success', SnackBarState.Success);
        this.newGlobalReportForm.reset();
        this.resetReportFormDate();
        this.globaltimesheetLoader = false;
        this.getMyReports();
        this.reportInEditMode = false;
      }else{
        this._notify.openSnackbar(`${JSON.stringify(res['data'])}`, SnackBarState.Success);
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Status ${JSON.stringify(res['status'])} =>  Error ${JSON.stringify(res['data'])} while creating his report ${JSON.stringify(newReport)}`,
          `${this.currentUser.key} Has Error while creating his report`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Faild'
        ).subscribe()
        this.globaltimesheetLoader = false;
      }
    },err=>{
      this._notify.openSnackbar(`${JSON.stringify(err['error']['data'])}`, SnackBarState.Error , 5000)
      this._db.createSystemLogs(
        `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while creating his report ${JSON.stringify(newReport)}`,
        `${this.currentUser.key} Has Error while creating his report`,
        this.currentUser.key || '',
        this.currentUser.username,
        'Faild'
      ).subscribe()
      this.globaltimesheetLoader = false;
    })
  }

}
