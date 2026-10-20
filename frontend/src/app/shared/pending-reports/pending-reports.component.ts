import { Component, OnInit } from '@angular/core';
import { DevDailyReport } from 'src/app/interfaces/dev-daily-report';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-pending-reports',
  templateUrl: './pending-reports.component.html',
  styleUrls: ['./pending-reports.component.scss']
})
export class PendingReportsComponent implements OnInit {
  
  myPendingReports:DevDailyReport[]=[];


  constructor(private _db:DatabaseService,
              private _auth:AuthApiService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(
      (user)=>{        
        this._db.getMyPendingReports(user.key).subscribe(
          (reports)=>{            
            if(reports['status'] == ResStatus.CRUD){
              this.myPendingReports = reports['data'];
            }
          }
        )
      }
    )
    // this.auth.user.subscribe(
    //   (user)=>{
    //     this.db.getMyPendingReports(user.key).subscribe(
    //       (reports)=>{
    //         this.myPendingReports = reports;
    //       }
    //     )
    //   }
    // )
  }

}
