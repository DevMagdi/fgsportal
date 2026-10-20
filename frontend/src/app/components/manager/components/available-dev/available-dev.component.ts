import { Component, OnInit } from '@angular/core';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { DurationCalculationService } from 'src/app/services/duration-calculation.service';

@Component({
  selector: 'app-available-dev',
  templateUrl: './available-dev.component.html',
  styleUrls: ['./available-dev.component.scss']
})
export class AvailableDevComponent implements OnInit {
  allDevs: User[] = [];
  devTasksList: Task[] = []
  devKey: string;
  taskKey: string;
  fromDate: Date;
  toDate: Date;
  availableDates: any[] = [];
  availableDevLoader:boolean = false;
  notAvailable:boolean = false;
  constructor(private _db: DatabaseService, private _auth: AuthApiService, private durationCalc: DurationCalculationService) { }

  ngOnInit(): void {

    this._auth.user.subscribe(
      (user) => {
        if (!!user) {
          if (user.department == Department.MANAGEMENT || user.accPosition == AccountPositions.MANAGER || user.department == Department.ADMINSTRATION) {
            this._auth.getUserByFilter(Department.TECHNICAL_TEAM).subscribe(devs => {
              if (devs['status'] == ResStatus.CRUD) {
                this.allDevs = devs['data'].filter(u => u.accPosition != AccountPositions.MANAGER &&
                  u.accPosition != AccountPositions.Team_Leader)

              }
            })
          } else {
            console.log("You Have No Access For This Page");
          }
        }
      }
    )
  }

  getDevReports() {
    this.availableDevLoader = true;
    this._db.getDevTasksOnSpecificDates(this.devKey || '', this.fromDate, this.toDate).subscribe(
      (data) => {
        if (data['status'] == ResStatus.CRUD) {
          this.devTasksList = data['data']
          let allTasksDates: Date[] = []
          // let tasksDate = data.data.map(x => {
          //   return { from: (x.start_date), to: x.end_date }
          // })          
          data.data.forEach(element => {
            let taskDates: any = this.durationCalc.datesBetweenTwoDates(new Date(element.start_date), new Date(element.end_date));
            taskDates = taskDates.map(x => this._db.getDateFormatted(x));
            allTasksDates = allTasksDates.concat(taskDates);
          });
          let allDates: any = this.durationCalc.datesBetweenTwoDates(new Date(this.fromDate), new Date(this.toDate));
          allDates = allDates.map(x => this._db.getDateFormatted(x));
          //   console.log(allTasksDates);
          //  console.log(allDates);
          this.availableDates = allDates.filter((x) => !allTasksDates.includes(x));
          //  console.log(this.availableDates);


          this.availableDevLoader = false;
          if(this.availableDates.length == 0){
            this.notAvailable= true;
          }else{
            this.notAvailable= false;
          }

        } else {
          // console.log(data);
          let allTasksDates: Date[] = []
          let allDates: any = this.durationCalc.datesBetweenTwoDates(new Date(this.fromDate), new Date(this.toDate));
          allDates = allDates.map(x => this._db.getDateFormatted(x));
          this.availableDates = allDates.filter((x) => !allTasksDates.includes(x));
          this.availableDevLoader = false;
          this.notAvailable= false;
        }
      },
    )


  }

  getDaysBetweenDates(from: Date, to: Date) {
    const startDate = new Date(from);
    const endDate = new Date(to);
    console.log(from, to);

    const days: any[] = [];

    // Iterate over each day using a loop
    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      days.push(this._db.getDateFormatted(new Date(currentDate).toISOString()));
    }
    // console.log(days);


    return days;
  }


  getSelcetedDevName(){
    return this.allDevs.find(d=>d.key == this.devKey)?.username 
  }

}

