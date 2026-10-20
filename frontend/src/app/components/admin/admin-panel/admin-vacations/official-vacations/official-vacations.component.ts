import { Component, OnInit } from '@angular/core';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { OfficialVacation } from 'src/app/interfaces/ramadan';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-official-vacations',
  templateUrl: './official-vacations.component.html',
  styleUrls: ['./official-vacations.component.scss']
})
export class OfficialVacationsComponent implements OnInit {
  from: Date;
  to: Date;
  details: string;
  currentUser:User;
  officialVacationLoading:boolean = false;
  constructor(private _notify:NotificationService,
              private _auth:AuthApiService,
              private _db:DatabaseService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
    })
  }

  openDatePicker(dp) {
    dp.open();
  }

  closeDatePicker(eventData: any, fromOrTo:string ,dp:any) {
    // get month and year from eventData and close datepicker, thus not allowing user to select date    
    if(fromOrTo = 'from'){
      this.from = eventData;
    }else{
      this.to = eventData;
    }    
    dp.close();    
  }


  validateDates(){
    if(this.from > this.to || !this.details || this.details.length == 0){
      this._notify.openSnackbar(`Invalid`, SnackBarState.Error)
    }else{
      this.submitVacation()
    }
  }


  submitVacation(){
    this.officialVacationLoading = true;
    const createVacatioReq:OfficialVacation = {
      start_date:this._db.getDateFormatted(this.from),
      end_date:this._db.getDateFormatted(this.to),
      manager_approve_id:this.currentUser.key || '',
      report_details:this.details
    }
    this._db.createVacationDays(createVacatioReq).subscribe(res=>{
    
      if(res['status'] == ResStatus.CRUD){
        this._notify.openSnackbar('Success' , SnackBarState.Success)
        this.details = '';
        this.from = new Date();
        this.to = new Date();
        this.officialVacationLoading = false;
      }else{
        this.officialVacationLoading = false;
      }
    },err=>{
      this.officialVacationLoading = false;
    })
  }
}
