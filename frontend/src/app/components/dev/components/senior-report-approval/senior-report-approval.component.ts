import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { DevDailyReport } from 'src/app/interfaces/dev-daily-report';
import { Notifying } from 'src/app/interfaces/notification';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Department, Gender, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-senior-report-approval',
  templateUrl: './senior-report-approval.component.html',
  styleUrls: ['./senior-report-approval.component.scss']
})
export class SeniorReportApprovalComponent implements OnInit {
  myReportsToApprove:DevDailyReport[] = [] ; 

  currentUser:User;

  allReports:boolean = false ;
  reportToApprove:DevDailyReport;
  approveReportDialog:boolean = false;

  managers:User[] = [];
  DepartmentEnum = Department;
  newServerApi = environment.newServerApi;
  
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private router:Router,
              private notify:NotificationService,
              private _message:MessagingService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{     
      if(!user || user.accPosition != AccountPositions.SENIOR){
        console.log('Access Denied');
        this._db.createSystemLogs(
          `${user.username} Tried To Access Senior Report Approval Page At ${new Date().toLocaleString()}`,
          `${user.key} Tried To Access Senior Report Approval Page At ${new Date().toLocaleString()}`,
          user.key,
          user.username,
          'Success'
        ).subscribe(res=>{
          this.router.navigate(['/'])
        },err=>{
          this.router.navigate(['/'])
        })
      }else{
        this.currentUser = user;
        this.getMyReports()
      }
    })
    // this.auth.user.subscribe(user=>{
    //   if(!user || user.accPosition != AccountPositions.SENIOR){
    //     console.log('Access Denied');
    //     this.db.createSystemLog(
    //       `${user.username} Tried To Access Senior Report Approval Page At ${new Date().toLocaleString()}`,
    //       `${user.key} Tried To Access Senior Report Approval Page At ${new Date().toLocaleString()}`,
    //       user.key,
    //       user.username,
    //       'Success'
    //     ).then(()=>{
    //       this.router.navigate(['/'])          
    //     })
    //   }else{
    //     this.currentUser = user;
    //     this.getMyReports()
    //   }
    // })
  }



  getMyReports(){
    this.myReportsToApprove = []
    this._db.getMyPendingReportsToApprove(this.currentUser.key || '').subscribe(
      (reports)=>{
        if(reports['status'] == ResStatus.CRUD){
          this.myReportsToApprove = reports['data'].filter(r=>!r.seniorDecision);
        }
      },(err)=>{
        console.log(err);
      }
    )
  }




  openApproveDialog(report:DevDailyReport){
    this.approveReportDialog = true;
    this.reportToApprove = report;

    this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(mans=>{
      if(mans['status']==ResStatus.CRUD){
        this.managers = mans['data'];
        this._auth.getUserByFilter(Department.TECHNICAL_TEAM,AccountRoles.Automation_Engineer,AccountPositions.MANAGER).subscribe(pms=>{
          if(pms['status']==ResStatus.CRUD){
            this.managers = this.managers.concat(pms['data'])
          }
        })
      }
    })
    // this.auth.getMymanagers().subscribe(man=>{
    //   this.managers = man;
    //   this.auth.getMyPMs().subscribe(pms=>{
    //     this.managers = this.managers.concat(pms)
    //     console.log(this.managers);
        
    //   })
    // })
  }


  
  validateDecision(decision:boolean){
    if(decision == true){
      if((this.reportToApprove.durationByHours != this.reportToApprove.preApprovedDuration) && !this.reportToApprove.managerChangeDurationComment){
        this.notify.openSnackbar('Change Duration Reason Is Required' , SnackBarState.Error)
      }else{
        this.approveReport();
        this.approveReportDialog=false;
      }
    }else{
      if(!this.reportToApprove.rejectionReason){
        this.notify.openSnackbar('Rejection Reason Reason Is Required' , SnackBarState.Error)
      }else{
        this.rejectReport();
        this.approveReportDialog=false;
      }
    }    
  }


  approveReport(){
    this.reportToApprove.seniorDecision = true;
    this.reportToApprove.seniorDecisionKey = this.currentUser.key;
    this.reportToApprove.seniorDecisionName = this.currentUser.username;
    this.reportToApprove.seniorDecisionAt = new Date().toLocaleDateString();
    const manName = this.managers.find(man=>man.key == this.reportToApprove.managerApprovalKey)?.username
    if(!!manName){
      this.reportToApprove.managerApprovalname = manName;
      this._db.ReportSeniorAction(this.reportToApprove).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          const i = this.myReportsToApprove.findIndex(rep => rep.key == this.reportToApprove.key)
          this.myReportsToApprove.splice(i,1)
        }else{
          this.notify.openSnackbar("Error, Please Contact System Adminstration" , SnackBarState.Warning)
        }
      },err=>{
        this.notify.openSnackbar("Error, Please Contact System Adminstration" , SnackBarState.Warning)
        console.log(err);
      })
    }else{
      this.notify.openSnackbar("Please Select Manager TO Assign" , SnackBarState.Warning)
    }
  }

  rejectReport(){
    this.reportToApprove.seniorDecision = false;
    this.reportToApprove.seniorDecisionKey = this.currentUser.key;
    this.reportToApprove.seniorDecisionName = this.currentUser.username;
    this.reportToApprove.seniorDecisionComment = this.reportToApprove.rejectionReason;
    this.reportToApprove.seniorDecisionAt = new Date().toLocaleDateString();
    this.reportToApprove.approved = false;

    this._db.ReportSeniorAction(this.reportToApprove).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        const i = this.myReportsToApprove.findIndex(rep => rep.key == this.reportToApprove.key)
        this.myReportsToApprove.splice(i,1)
      }else{
        this.notify.openSnackbar("Error, Please Contact System Adminstration" , SnackBarState.Warning)
      }
    },err=>{
      this.notify.openSnackbar("Error, Please Contact System Adminstration" , SnackBarState.Warning)
      console.log(err);
    })

  }


  sendNotificationToDev(report:DevDailyReport){
    const newNotification:Notifying = {
      title : ` Your report ${report.approved == true ? 'Approved' : 'Reject'}`,
      body : `${this.currentUser.username} Has ${report.approved == true ? 'Approved' : 'Rejected'} Your report `,
      receverKey : report.devID, 
      receverName : report.devName , 
      senderKey : this.currentUser.key || "",
      senderName: this.currentUser.username,
      senderImg: this.currentUser.photoURL ? this.currentUser.photoURL :  this.currentUser.gender == Gender.MALE ? 'https://bootdey.com/img/Content/avatar/avatar7.png' : this.currentUser.gender == Gender.FEMALE ? 'https://i2.wp.com/nofiredrills.com/wp-content/uploads/2016/10/myavatar.png?fit=400%2C400&ssl=1' : 'https://bootdey.com/img/Content/avatar/avatar7.png',
      redirection:`${report.approved == true ? '/dev/timesheet' : '/dev/rejected'}`
    }
    this._message.createnotification(newNotification)
  }
}
