import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DevDailyReport, ReportStatus } from 'src/app/interfaces/dev-daily-report';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Department, User } from 'src/app/interfaces/user';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from '../snackbar/snackbar.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support-reports',
  templateUrl: './support-reports.component.html',
  styleUrls: ['./support-reports.component.scss']
})
export class SupportReportsComponent implements OnInit {

  currentUser: User;
  userPerms: UserPermissions[] = [];
  allSupportReports: DevDailyReport[] = [];
  allReports:boolean = false ;
  ReportStatusEnum = ReportStatus;
  reportToApprove:DevDailyReport;
  approveReportDialog:boolean = false;
  newServerApi = environment.newServerApi;
  approveReportsLoader=true;
  constructor(
    private _db: DatabaseService,
    private _auth: AuthApiService,
    private notify:NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this._auth.user.subscribe(user => {
      this.currentUser = user;
      this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms => {
        if (perms['status'] == ResStatus.CRUD) {
          this.userPerms = perms['data'];
          if (this.checkIfHasPerm(25)) {
            this.GetSupportPendingReport();
          }

        } else {
          console.log('You Have No Access TO This Page');
          this._db.createSystemLogs(
            `${user.username} Tried To Access Report Approval Page At ${new Date().toLocaleString()}`,
            `${user.key} Tried To Access Report Approval Page At ${new Date().toLocaleString()}`,
            user.key,
            user.username,
            'Fail'
          ).subscribe(() => {
            this.router.navigate(['/'])
          })
        }
      }
      )
    });


  }


  GetSupportPendingReport() {
    this.approveReportsLoader=true;
    this._db.GetSupportPendingReport().subscribe(
      res => {
        this.approveReportsLoader=false;
        if (res['status'] == ResStatus.CRUD) {

          console.log(this.currentUser.key);

          // res['data'].forEach(element => {
          //   if(this.currentUser.key==element.managerApprovalKey){
          //     this.allSupportReports.push(element);
          //   }
          // });
          this.allSupportReports = res['data'];
          console.log(this.allSupportReports);

        }else if(res['status'] ==ResStatus.Success_But_Empty){
          this.allSupportReports=[];
        }

      }
    )
  }

  checkIfHasPerm(perm_id) {
    // console.log(this.userPerms);

    const checking = this.userPerms.find(p => p.permission_id == perm_id)
    if (!!checking) {
      return true;
    } else {
      return false;
    }
  }
  approveAllReports(){
    
    this.notify.openDialog(
      `Approve All?`,
      `Are you sure you want to Approve All Reports?`,
      false,
      `${!!this.allReports ? 'Please Note that you will approve all pending reports in the system ? ': ''}`,
      true,
      false).subscribe(response => {
        if (response) {
          this._db.approveAllPendingReports().subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              
              this.notify.openSnackbar('Done' , SnackBarState.Success)
            }else{
              console.log(res);
              this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
            }
          },err=>{
            console.log(err);
            this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
          })

        } else {
          this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
    
  }
  openApproveDialog(report:DevDailyReport){
    this.approveReportDialog = true;
    this.reportToApprove = report;
  }
  validateDecision(decision:boolean){
    if(decision == true){
      if((this.reportToApprove.durationByHours != this.reportToApprove.preApprovedDuration) && !this.reportToApprove.managerChangeDurationComment){
        this.notify.openSnackbar('Change Duration Reason Is Required' , SnackBarState.Error)
      }else{
        this.approveReport(this.reportToApprove);
      }
    }else{
      if(!this.reportToApprove.rejectionReason){
        this.notify.openSnackbar('Rejection Reason Reason Is Required' , SnackBarState.Error)
      }else{
        this.rejectReport(this.reportToApprove);
        // this.approveReportDialog=false;
      }
    }
  }

  approveReport(report:DevDailyReport){
    report.approved = true;
    report.approvedByKey = this.currentUser.key;
    report.approvedByName = this.currentUser.username;
    this.approveReportsLoader=true;
    this._db.ReportManagerAction(report).subscribe(res=>{      
      if(res['status'] == ResStatus.CRUD){
        this.GetSupportPendingReport()
        this.approveReportDialog=false;
        this.approveReportsLoader=false;

      
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

        this.GetSupportPendingReport();
        this.approveReportDialog=false;

      }else{
        console.log(res);
        this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
      }
    },err=>{
      console.log(err);
      this.notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Error)
    })
  }
}
