import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ManagerReport, ManagerReportStatus } from 'src/app/interfaces/manager-report';
import { ResStatus } from 'src/app/interfaces/res-status';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-reports-table',
  templateUrl: './reports-table.component.html',
  styleUrls: ['./reports-table.component.scss']
})
export class ReportsTableComponent implements OnInit {

  @Input() reports:ManagerReport[];
  @Input() isManager=false;
  report: ManagerReport;
  reportStatus = ManagerReportStatus;
  showReport = false;
  @Input() sidebarDisplay=false;
  @Output() deletePmReport=new EventEmitter();
  @Output() approveMReport=new EventEmitter();
  @Output() closeSideBar=new EventEmitter();
  constructor(private _notify: NotificationService, private _db: DatabaseService) { }

  ngOnInit(): void {
  }

  changePMTeamRequestStatus(pm_team_request_id: string) {
    this._notify.openDialog(
      'Approve Report?',
      `Are you sure you want to Approve this Report?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.changePMTeamRequestStatus(pm_team_request_id, this.reportStatus.Closed).subscribe({
            next: (res: any) => {
              if (res['status'] == ResStatus.CRUD) {
                this._notify.openSnackbar('Report Approved Successfully');
                // this.getPMTeam();
                this.approveMReport.emit(true);
              }


            }, error: (err: any) => {
              this._notify.openSnackbar(err.error.data.message);

            }
          })

        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
    ;
  }

  deleteReport(report:ManagerReport){
    this._notify.openDialog(
      'Delete Report?',
      `Are you sure you want to Delete this Report?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deletePMTeamRequest(report.key || '').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this._notify.openSnackbar('Deleted')
              this.deletePmReport.emit(true)
            }
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  } 
}
