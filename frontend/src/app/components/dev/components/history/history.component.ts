import { Component, OnInit } from '@angular/core';
import { DevDailyReport } from 'src/app/interfaces/dev-daily-report';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  myReportsList:DevDailyReport[] = []
  myUserKey:string;
  fromDate:Date = new Date();
  toDate:Date = new Date();
  periodDates:Date[] = []

  constructor(private _auth:AuthApiService,
              private _db:DatabaseService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(
      (user)=>{
        if(!!user){
          this.myUserKey = user.key
        }
      }
    )
    // this.auth.user.subscribe(
    //   (user)=>{
    //     if(!!user){
    //       this.myUserKey = user.key
    //     }
    //   }
    // )
  }


  // getMyPreviousReports(){
  //   this.myReportsList = []
  //   this.getPeriodDates()    

  //   let from = new Date(this.fromDate)
  //   let to = new Date(this.toDate)
  //   const finalFrom = `${from.getMonth() +1 }/${from.getDate()}/${from.getFullYear()}`
  //   const finalTo = `${to.getMonth() +1 }/${to.getDate()}/${to.getFullYear()}`

  //   console.log(finalFrom);
  //   console.log(finalTo);
    
  //   this.db.getDevReportsHistory(finalFrom, finalTo).subscribe(
  //     (reports)=>{
  //       this.myReportsList =  reports.filter(report => report.devID == this.myUserKey)
  //       console.log(this.myReportsList);
  //     }
  //   )
  // }


  getMyPreviousReports(){
    this._db.getDevDailyReport(this.myUserKey , this.fromDate , this.toDate).subscribe(
      (reports)=>{        
        if(reports['status'] == ResStatus.CRUD){
          this.myReportsList =  reports['data']
        }
      }
    )
  }


  getPeriodDates(){
    this.periodDates = []
    
    const from = new Date(this.fromDate)
    const to = new Date(this.toDate)

    let firstday = new Date(from.getFullYear(), from.getMonth() , from.getDate())
    let lastday = new Date(to.getFullYear(), to.getMonth() , to.getDate())
    while(firstday <= lastday){
      this.periodDates.push(new Date(firstday))
      firstday = new Date(firstday.setDate(firstday.getDate()+1));
    }

    // for(let i in this.periodDates){
    //   // console.log(this.periodDates[i]);
      
    //   // this.getMyPreviousReports(this.periodDates[i])
    // }

    this.getMyPreviousReports();
  }


  getDate(date){
    const day =  `${date.getDate()}`
    const month =  `${date.getMonth()+1}`
    const year =  date.getFullYear()
    const realDate = `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year}`
    
    return realDate
  }




  workingHoursCalculate(){
    const workingHours:number[] = [] ;
    this.myReportsList.map(rep=>{
      if(!rep.rejected){
        workingHours.push(rep.durationByHours)
      }
    })
    if(workingHours.length > 0){
     return workingHours.reduce((a,b)=>a+b)
    }else{
      return 0
    }
  }
  
}
