import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Activity, DevDailyReport, ReportStatus } from 'src/app/interfaces/dev-daily-report';
import { Notifying } from 'src/app/interfaces/notification';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountType, Department, Gender, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationService } from 'src/app/services/notification.service';
import {environment} from '../../../../../environments/environment';
import { AdminReports } from 'src/app/interfaces/admin-reports';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
@Component({
  selector: 'app-reports-approval',
  templateUrl: './reports-approval.component.html',
  styleUrls: ['./reports-approval.component.scss']
})
export class ReportsApprovalComponent implements OnInit {
  approveReportsLoader:boolean = false;
  myReportsToApprove:DevDailyReport[] = [] ; 

  currentUser:User;

  allReports:boolean = false ;
  reportToApprove:DevDailyReport;
  approveReportDialog:boolean = false;
  DepartmentEnum = Department;
  // private mytask:Subscription;
  ReportStatusEnum = ReportStatus;
  newServerApi = environment.newServerApi;

  pendingReportsCounter:number = 0;
  recallGetMyReportsFunction:boolean = false;

  adminReports:AdminReports[]=[];
  AdminReportToApprove:AdminReports;
  approveAdminReportDialog:boolean = false;
  userPerms:UserPermissions[] = [];
  allSupportReports:DevDailyReport[]=[];

  constructor(private _db:DatabaseService,
              private _auth:AuthApiService,
              private notify:NotificationService,
              private el: ElementRef,
              private _message:MessagingService,
              private router:Router) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
        this.currentUser = user;
        this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
          if(perms['status'] == ResStatus.CRUD){
            this.userPerms = perms['data'];
            if(user.department == Department.MANAGEMENT || user.accPosition == AccountPositions.MANAGER || this.checkIfHasPerm(25)){
              if(this.currentUser.department == Department.MANAGEMENT){
                this.getMyAdminReports();
                this.getMyReports();
                this.GetSupportPendingReport();
    
              }else if(this.currentUser.department == Department.TECHNICAL_TEAM){
                this.getMyReports();
              }else if(this.checkIfHasPerm(25)){
    
                this.GetSupportPendingReport();
              }
              else{
                this.getMyAdminReports();
              }
    
              this._auth.getNavPermsByUserID(this.currentUser.key||'').subscribe(res=>{
                this.pendingReportsCounter = res.pendingReport ? res.pendingReport : 0;
                if(this.pendingReportsCounter != this.myReportsToApprove.length){
                  this.recallGetMyReportsFunction = true;
                }else{
                  this.recallGetMyReportsFunction = false;
                }
              })
             
            }else{
              console.log('You Have No Access TO This Page');
              this._db.createSystemLogs(
                `${user.username} Tried To Access Report Approval Page At ${new Date().toLocaleString()}`,
                `${user.key} Tried To Access Report Approval Page At ${new Date().toLocaleString()}`,
                user.key,
                user.username,
                'Fail'
              ).subscribe(()=>{
                this.router.navigate(['/'])          
              })
            }
          }
        });
      }
    )
  }

  approveAllMyReports(){
    
    if(this.currentUser.department == Department.MANAGEMENT){
      this.notify.openDialog(
        `Approve All?`,
        `Are you sure you want to Approve All Reports?`,
        false,
        `${!!this.allReports ? 'Please Note that you will approve all pending reports in the system ? ': ''}`,
        true,
        false).subscribe(response => {
          if (response) {
            if(this.allReports == true){
              this._db.approveAllPendingReports().subscribe(res=>{
                if(res['status'] == ResStatus.CRUD){
                  this.getMyReports();
                  this.notify.openSnackbar('Done' , SnackBarState.Success)
                }else{
                  console.log(res);
                  this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
                }
              },err=>{
                console.log(err);
                this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
              })
            }else{
              this._db.approveAllMyReports().subscribe(res=>{
                if(res['status'] == ResStatus.CRUD){
                  this.getMyReports();
                  this.notify.openSnackbar('Done' , SnackBarState.Success)
                }else{
                  console.log(res);
                  this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
                }
              },err=>{
                console.log(err);
                this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
              })
            }

          } else {
            this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
          }
      });
      
    }
  }

  recallGetMyReports(){
    if(this.currentUser.department == Department.MANAGEMENT){
      this.getMyReports();
      this.getMyAdminReports();
    }else if (this.currentUser.department == Department.TECHNICAL_TEAM){
      this.getMyReports();
    }else{
      this.getMyAdminReports();
    }
    this.recallGetMyReportsFunction = false;
  }


  getMyAdminReports(){
    this.approveReportsLoader = true;
    this._db.getMyAdminPendingReportsToApprove(this.currentUser.key || '').subscribe(
      (adminreports)=>{
        if(adminreports['status'] == ResStatus.CRUD){
          this.adminReports  = adminreports['data'];
          this.approveReportsLoader = false;
          if(this.pendingReportsCounter != this.myReportsToApprove.length){
            this.recallGetMyReportsFunction = true;
          }else{
            this.recallGetMyReportsFunction = false;
          }
        }else{
          this.adminReports  =[];
          this.approveReportsLoader = false;
          // console.log(reports);
        }
      },(err)=>{
        this.adminReports  =[];
        this.approveReportsLoader = false;
        console.log(err);
      }
    )
  }

  getAllAdminReports(){
    this.approveReportsLoader = true;
    this._db.getAllAdminPendingReportsToApprove().subscribe(
      (adminreports)=>{
        if(adminreports['status'] == ResStatus.CRUD){
          this.adminReports  = adminreports['data'];
          this.approveReportsLoader = false;
          if(this.pendingReportsCounter != this.myReportsToApprove.length){
            this.recallGetMyReportsFunction = true;
          }else{
            this.recallGetMyReportsFunction = false;
          }
        }else{
          this.adminReports  =[]
          this.approveReportsLoader = false;
        }
      },(err)=>{
        this.adminReports  =[]
        this.approveReportsLoader = false;
        console.log(err);
      }
    )   
    
  }

  getMyReports(){
    this.approveReportsLoader = true;
    this.allReports = false ;

    let myReportsBtn = this.el.nativeElement.querySelector('.myReportsBtn')
    let allReportsBtn = this.el.nativeElement.querySelector('.allReportsBtn')
    if(myReportsBtn != null && allReportsBtn != null){
      myReportsBtn.classList.remove('allReports')
      myReportsBtn.classList.add('myReports')
      allReportsBtn.classList.remove('myReports')
      allReportsBtn.classList.add('allReports')  
    }


    this.myReportsToApprove = []
    this._db.getMyPendingReportsToApprove(this.currentUser.key || '').subscribe(
      (reports)=>{
        if(reports['status'] == ResStatus.CRUD){
          this.myReportsToApprove = reports['data']; 
          this.approveReportsLoader = false;
          if(this.pendingReportsCounter != this.myReportsToApprove.length){
            this.recallGetMyReportsFunction = true;
          }else{
            this.recallGetMyReportsFunction = false;
          }         

        }else{
          // console.log(reports);
          this.myReportsToApprove = [];
          this.approveReportsLoader = false;
        }
      },(err)=>{
        this.myReportsToApprove = [];
        this.approveReportsLoader = false;
        console.log(err);
      }
    )
    this.GetSupportPendingReport();
  }

  getAllReports(){    
    this.allReports = true ;
    this.approveReportsLoader = true;
    let myReportsBtn = this.el.nativeElement.querySelector('.myReportsBtn')
    let allReportsBtn = this.el.nativeElement.querySelector('.allReportsBtn')
    myReportsBtn.classList.add('allReports')
    myReportsBtn.classList.remove('myReports')
    allReportsBtn.classList.add('myReports')
    allReportsBtn.classList.remove('allReports')

    this.myReportsToApprove = []
    this._db.getAllPendingReports().subscribe(
      (reports)=>{
        if(reports['status'] == ResStatus.CRUD){
          this.myReportsToApprove = reports['data']; 
          this.approveReportsLoader = false;
          if(this.pendingReportsCounter != this.myReportsToApprove.length){
            this.recallGetMyReportsFunction = true;
          }else{
            this.recallGetMyReportsFunction = false;
          }
        }else{
          console.log(reports);
          this.myReportsToApprove = []
        }
      },(err)=>{
        this.myReportsToApprove = []
        this.approveReportsLoader = false;
        console.log(err);
      }
    )

    if(this.currentUser.department == Department.MANAGEMENT){
      this.getAllAdminReports();
      this.GetAllSupportReport();
    }

  
  }


  openAdminApproveDialog(report:AdminReports){
    this.approveAdminReportDialog = true;
    this.AdminReportToApprove = report;
  }

  openApproveDialog(report:DevDailyReport){
    this.approveReportDialog = true;
    this.reportToApprove = report;
  }

  
  // ====================================================== Tech Decision ===============================================

  validateDecision(decision:boolean){
    if(decision == true){
      if((this.reportToApprove.durationByHours != this.reportToApprove.preApprovedDuration) && !this.reportToApprove.managerChangeDurationComment){
        this.notify.openSnackbar('Change Duration Reason Is Required' , SnackBarState.Error)
      }else{
        this.approveReport(this.reportToApprove);
        this.approveReportDialog=false;
      }
    }else{
      if(!this.reportToApprove.rejectionReason){
        this.notify.openSnackbar('Rejection Reason Reason Is Required' , SnackBarState.Error)
      }else{
        this.rejectReport(this.reportToApprove);
        this.approveReportDialog=false;
      }
    }
  }

  approveReport(report:DevDailyReport){
    report.approved = true;
    report.approvedByKey = this.currentUser.key;
    report.approvedByName = this.currentUser.username;
    this._db.ReportManagerAction(report).subscribe(res=>{      
      if(res['status'] == ResStatus.CRUD){
        const i = this.myReportsToApprove.findIndex(rep => rep.key == report.key)
        this.myReportsToApprove.splice(i,1)
        if(this.myReportsToApprove.length  == 0){
          this.getMyReports();
        }
      }else{
        console.log(res);
        this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
      }
    },err=>{
      console.log(err);
      this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
    })
  }

  rejectReport(report:DevDailyReport){
    report.approved = false;
    report.rejected = true;
    report.approvedByKey = this.currentUser.key;
    report.approvedByName = this.currentUser.username;

    
    this._db.ReportManagerAction(report).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        const i = this.myReportsToApprove.findIndex(rep => rep.key == report.key)
        this.myReportsToApprove.splice(i,1)
        if(this.myReportsToApprove.length  == 0){
          this.getMyReports();
        }
      }else{
        console.log(res);
        this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
      }
    },err=>{
      console.log(err);
      this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
    })
  }

  // ====================================================== Admin Decision ===============================================

  validateAdminDecision(decision:boolean){
    if(decision == true){
      this.approveAdminReport(this.AdminReportToApprove);
      this.approveAdminReportDialog=false;
    }else{
      if(!this.AdminReportToApprove.reject_reason){
        this.notify.openSnackbar('Rejection Reason Reason Is Required' , SnackBarState.Error)
        // this.approveAdminReportDialog = false;
      }else{
        this.rejectAdminReport(this.AdminReportToApprove);
        this.approveAdminReportDialog=false;
      }
    }
  }

  approveAdminReport(report:AdminReports){
    this.approveReportsLoader = true;
    report.approved = true;
    // report.approvedByKey = this.currentUser.key;
    // report.approvedByName = this.currentUser.username;
    this._db.AdminReportManagerAction(report).subscribe(res=>{      
      if(res['status'] == ResStatus.CRUD){
        this.approveReportsLoader = false;
        // this.sendNotificationToManager(report);
        const i = this.myReportsToApprove.findIndex(rep => rep.key == report.id)
        this.myReportsToApprove.splice(i,1)
        if(this.myReportsToApprove.length  == 0){
          this.getMyAdminReports();
        }
      }else{
        console.log(res);
        this.approveReportsLoader = false;
        this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
      }
    },err=>{
      console.log(err);
      this.approveReportsLoader = false;
      this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
    })
  }

  rejectAdminReport(report:AdminReports){
    this.approveReportsLoader = true;
    report.approved = false;    
    this._db.AdminReportManagerAction(report).subscribe(res=>{
      this.approveReportsLoader = false;
      if(res['status'] == ResStatus.CRUD){
        const i = this.myReportsToApprove.findIndex(rep => rep.key == report.id)
        this.myReportsToApprove.splice(i,1)
        if(this.myReportsToApprove.length  == 0){
          this.getMyAdminReports();
        }
      }else{
        console.log(res);
        this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
      }
    },err=>{
      this.approveReportsLoader = false;
      console.log(err);
      this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
    })
  }



  // sendNotificationToManager(report:DevDailyReport){
  //   const newNotification:Notifying = {
  //     title : ` Your report ${report.approved == true ? 'Approved' : 'Reject'}`,
  //     body : `${this.currentUser.username} Has ${report.approved == true ? 'Approved' : 'Rejected'} Your report `,
  //     receverKey : report.devID, 
  //     receverName : report.devName , 
  //     senderKey : this.currentUser.key || "",
  //     senderName: this.currentUser.username,
  //     senderImg: this.currentUser.photoURL ? this.currentUser.photoURL :  this.currentUser.gender == Gender.MALE ? 'https://bootdey.com/img/Content/avatar/avatar7.png' : this.currentUser.gender == Gender.FEMALE ? 'https://i2.wp.com/nofiredrills.com/wp-content/uploads/2016/10/myavatar.png?fit=400%2C400&ssl=1' : 'https://bootdey.com/img/Content/avatar/avatar7.png',
  //     redirection:`${report.approved == true ? '/dev/timesheet' : '/dev/rejected'}`
  //   }
  //   this._message.createnotification(newNotification)
  // } 
  checkIfHasPerm(perm_id){
    // console.log(this.userPerms);
    
    const checking = this.userPerms.find(p=>p.permission_id == perm_id)
    if(!!checking){
      return true;
    }else{
      return false;
    }
  }
  GetSupportPendingReport(){
    this._db.GetSupportPendingReport().subscribe(
      res=>{
        if(res['status'] == ResStatus.CRUD){
          
          console.log(this.currentUser.key);
          
          // res['data'].forEach(element => {
          //   if(this.currentUser.key==element.managerApprovalKey){
          //     this.allSupportReports.push(element);
          //   }
          // });
          this.allSupportReports=res['data'];
          console.log(this.allSupportReports);
          
        }
        
      }
    )
  }
  GetAllSupportReport(){
    this._db.GetAllSupportReport().subscribe(
      res=>{
        if(res['status'] == ResStatus.CRUD){
          
          console.log(this.currentUser.key);
          
          // res['data'].forEach(element => {
          //   if(this.currentUser.key==element.managerApprovalKey){
          //     this.allSupportReports.push(element);
          //   }
          // });
          this.allSupportReports=res['data'];
          console.log(this.allSupportReports);
          
        }
        
      }
    )
  }
}
