import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
// import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
// import { Ramadan } from 'src/app/interfaces/ramadan';
// import { DurationCalculationService } from 'src/app/services/duration-calculation.service';
// import { FirebaseServiceService } from 'src/app/services/firebase-service.service';
// import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {
  // from: Date;
  // to: Date;
  currentUser:User;
  constructor(private _auth:AuthApiService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
    })
  }

  // openDatePicker(dp) {
  //   dp.open();
  // }

  // closeDatePicker(eventData: any, fromOrTo:string ,dp:any) {
  //   // get month and year from eventData and close datepicker, thus not allowing user to select date    
  //   if(fromOrTo = 'from'){
  //     this.from = eventData;
  //   }else{
  //     this.to = eventData;
  //   }    
  //   dp.close();    
  // }


  // validateDates(){
  //   if(this.from >= this.to){
  //     this._notify.openSnackbar(`Invalid`, SnackBarState.Error)
  //   }else{
  //     this.getAllDays()
  //   }
  // }

  // getAllDays(){
  //   const Dates = this._durationServ.datesBetweenTwoDates(this.from , this.to);
  //   let datesInSTR:string[] = [];
  //   for(let i in Dates){
  //     datesInSTR.push(`${Dates[i].getMonth() + 1}/${Dates[i].getDate()}/${Dates[i].getFullYear()}`)
  //   }
  //   this.submitRamadan(datesInSTR)
  // }

  // submitRamadan(dates:string[]){
  //   for(let i in dates){
  //     const rm:Ramadan = {
  //       date : dates[i]
  //     }
  //     this._db.createRamadanDay(rm)
  //   }
  // }


  
}
