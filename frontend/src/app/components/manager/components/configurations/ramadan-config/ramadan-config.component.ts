import { Component, OnInit } from '@angular/core';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { WorkingHoursConfiguration } from 'src/app/interfaces/ramadan';
import { ResStatus } from 'src/app/interfaces/res-status';
import { DatabaseService } from 'src/app/services/database.service';
import { DurationCalculationService } from 'src/app/services/duration-calculation.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-ramadan-config',
  templateUrl: './ramadan-config.component.html',
  styleUrls: ['./ramadan-config.component.scss']
})
export class RamadanConfigComponent implements OnInit {
  from: Date;
  to: Date;
  numberOfWorkingHOurs:number = 6;

  workingHoursConfiguration:WorkingHoursConfiguration;

  allRamadanConfig:WorkingHoursConfiguration[] = [];

  constructor(private _durationServ:DurationCalculationService,
              private _notify:NotificationService,
              private _db:DatabaseService) { }

  ngOnInit(): void {
    this.getAllRamadanConfig()
  }

  getAllRamadanConfig(){
    this._db.getAllRamadanConfig().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.allRamadanConfig = res['data'];
      }else{
        this.allRamadanConfig = [];
      }
    },err=>{
      this.allRamadanConfig = [];
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
    if(this.from >= this.to || !this.numberOfWorkingHOurs || this.numberOfWorkingHOurs <= 0){
      this._notify.openSnackbar(`Invalid`, SnackBarState.Error)
    }else{
      this.submitRamadan()
    }
  }

  // getAllDays(){
  //   const Dates = this._durationServ.datesBetweenTwoDates(this.from , this.to);
  //   let datesInSTR:string[] = [];
  //   for(let i in Dates){
  //     datesInSTR.push(`${Dates[i].getMonth() + 1}/${Dates[i].getDate()}/${Dates[i].getFullYear()}`)
  //   }
  //   this.submitRamadan(datesInSTR)
  // }

  submitRamadan(){
    const newConfig:WorkingHoursConfiguration= {
      title:'Ramadan',
      start_date:this._db.getDateFormatted(this.from),
      end_date:this._db.getDateFormatted(this.to),
      config_duration:this.numberOfWorkingHOurs
    }
    this._db.createRamadanDay(newConfig).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this._notify.openSnackbar('Success' , SnackBarState.Success)
        this.getAllRamadanConfig();
      }
    })
  }

}
