import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ManagerReport, ManagerReportStatus, FilterBody } from 'src/app/interfaces/manager-report';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User, Department, AccountPositions } from 'src/app/interfaces/user';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-project-manager-report',
  templateUrl: './project-manager-report.component.html',
  styleUrls: ['./project-manager-report.component.scss']
})
export class ProjectManagerReportComponent implements OnInit {


  sidebarDisplay = false;
  reports: ManagerReport[] = [];
  report: ManagerReport;
  loading = true;
  reportStatus = ManagerReportStatus;
  date = new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  start_date = this._db.getDateFormattedYearMonthDay(this.firstDay);
  end_date = this._db.getDateFormattedYearMonthDay(this.lastDay);
  showReport = false;
  activeIndex = 0;
  filterBody: FilterBody;
  withNoDates = false;
  currentUser!: User;
  userPerms: UserPermissions[] = [];
  DepartmentEnum = Department;
  AccountPositionEnum = AccountPositions;
  isManager = false;
  isProjectManager = false;
  newReports!:number;
  recallGetMyReportsFunction:boolean=false;
  constructor(
    private _notify: NotificationService,
    private _db: DatabaseService,
    private _auth: AuthApiService,
    private router: Router) { }

  ngOnInit(): void {
    this._auth.user.subscribe(
      (user) => {

        if (!!user) {
          this.currentUser = user;
          this.getUserPermissions();
          if (user.department == Department.MANAGEMENT || this.checkIfHasPerm(23)) {
            this.isManager = true;
            this.getManagerPendingReports();
            // this._auth.getNavPermsByUserID(this.currentUser.key||'').subscribe(res=>{
            //   this.newReports = res.project_manager_reports ? res.project_manager_reports : 0;
            //   if(this.newReports != this.reports.length){
            //     this.recallGetMyReportsFunction = true;
            //   }else{
            //     this.recallGetMyReportsFunction = false;
            //   }
            // })
          } else if ((user.department == Department.TECHNICAL_TEAM && user.accPosition ==
             this.AccountPositionEnum.MANAGER) || this.checkIfHasPerm(24)) {
            this.isProjectManager = true;
            this.getPMMyReports();
          } else {
            this._db.createSystemLogs(
              `${this.currentUser.username} Tried To Access Project manager reports At ${new Date().toLocaleString()}`,
              `${this.currentUser.key} Tried To Access Project manager reports At ${new Date().toLocaleString()}`,
              this.currentUser.key || '',
              this.currentUser.username,
              'Faild'
            ).subscribe(res => {
              this._notify.openSnackbar(`You Don't Have Permission To Access This Page `, SnackBarState.Warning, 10000)
              this.router.navigate(['/'])
            })
          }
        }
      })

    this.manageReport();

  }

  getManagerReports() {
    let filterBody: FilterBody = {
      start_date: this._db.getDateFormatted(this.start_date || new Date()),
      end_date: this._db.getDateFormatted(this.end_date || new Date()),
    }

    this.getManagerPMTeamRequestProject(filterBody);

  }

  getManagerPMTeamRequestProject(filterBody: FilterBody) {
    this.loading = true;

    this._db.getManagerPMTeamRequestProject(filterBody).subscribe({
      next: (res: any) => {

        if (res['status'] == ResStatus.CRUD) {
          this.reports = res.data;
        } else if (res['status'] == ResStatus.Success_But_Empty) {
          this.reports = [];
        }
        this.loading = false;


      }, error: (err: any) => {

        this.loading = false;

        
      }
    })
  }

  getManagerPendingReports() {

    let filterBody: FilterBody = {
      start_date: this._db.getDateFormatted(this.start_date),
      end_date: this._db.getDateFormatted(this.end_date),
      team_request_status_id: this.reportStatus.Open
    }

    this.getManagerPMTeamRequestProject(filterBody);
  }

  getAllPendingReports() {

    if (this.withNoDates) {

      this.filterBody = {
        team_request_status_id: this.reportStatus.Open

      }
    } else {

      if (this.start_date && this.end_date) {

        this.filterBody = {
          start_date: this._db.getDateFormatted(this.start_date),
          end_date: this._db.getDateFormatted(this.end_date),
          team_request_status_id: this.reportStatus.Open
        }
      }
    }
    this.loading = true;
    this._db.getAllPMTeamRequestFilter(this.filterBody).subscribe({
      next: (res: any) => {

        if (res['status'] == ResStatus.CRUD) {
          this.reports = res.data;
        } else if (res['status'] == ResStatus.Success_But_Empty) {
          this.reports = [];
        }
        this.loading = false;
        this.withNoDates = false;

      }, error: (err: any) => {

        this.loading = false;

        console.log("Error");
      }
    })


  }

  getPMMyReports() {
    let body = {
      start_date: this._db.getDateFormatted(this.start_date),
      end_date: this._db.getDateFormatted(this.end_date),
    }
    this.loading = true;
    this._db.getAllPMTeamRequestFilter(body).subscribe({
      next: (res: any) => {
      
        if (res['status'] == ResStatus.CRUD) {
          this.reports = res.data;
        }
        this.loading = false;

      }, error: (err: any) => {
        this.loading = false;

      }
    })
  }

  loadReports(tabIndex: any) {
   
    let index = tabIndex.index as number;
    switch (index != -1) {
      case index == 0:

        this.start_date = this._db.getDateFormattedYearMonthDay(this.firstDay);
        this.end_date = this._db.getDateFormattedYearMonthDay(this.lastDay);
        this.getManagerPendingReports();
        break;

      case index == 1:

      
      this.withNoDates = true;
      this.start_date = '';
      this.end_date = '';
      this.getAllPendingReports();
      
        break;

      case index == 2:
        this.start_date = this._db.getDateFormattedYearMonthDay(this.firstDay);
        this.end_date = this._db.getDateFormattedYearMonthDay(this.lastDay);
        this.getManagerReports();
        break;

      default:
        break;
    }
    if (tabIndex == this.activeIndex) {
      return
    }
    // if (tabIndex==0) {
    //   this.getPMTeam()
    // }else if (tabIndex==1) {
    //   this.GetAllOpenPMTeamRequest()
    // }

  }

  getUserPermissions() {

    this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms => {
      if (perms['status'] == ResStatus.CRUD) {
        this.userPerms = perms['data'];

      }
    })
  }
  checkIfHasPerm(perm_id) {
    const checking = this.userPerms.find(p => p.permission_id == perm_id)
    if (!!checking) {
      return true;
    } else {
      return false;
    }
  }
  manageReport() {
    this._db.manageManagerReport$.subscribe(res => this.getPMMyReports())
  }

  recallGetMyReports(){

  }
}

