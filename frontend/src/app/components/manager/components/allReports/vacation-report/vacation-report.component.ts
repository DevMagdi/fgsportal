import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { AnnualLeave, leaveFinalStatus, LeavesReport, LeaveType } from 'src/app/interfaces/annualLeave';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { DatabaseService } from 'src/app/services/database.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-vacation-report',
  templateUrl: './vacation-report.component.html',
  styleUrls: ['./vacation-report.component.scss']
})
export class VacationReportComponent implements OnInit {
  vacationReport:LeavesReport[] = [];
  allEmps:User[] = [];
  selectedEmps:User[] = [];
  AnnualLeaveTypeEnum = LeaveType;
  finalStatusEnum = leaveFinalStatus;
  math= Math;

  searchForm:FormGroup = new FormGroup({
    'emps':new FormControl(null),
    'from':new FormControl(null),
    'to':new FormControl(null),
    'type':new FormControl(null)
  });

  constructor(private _db:DatabaseService,
              private _notify:NotificationService,
              private excelServ:ExportExcelService) { }

  ngOnInit(): void {
    // this.getAllEmps();  
  }

  getAllVacations(){
    this.vacationReport = [];
    this._db.getVacationsReport().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.vacationReport  = res['data'];
      }else{
        this.vacationReport = [];
      }
    },err=>{
      console.log(err);
      this._notify.openSnackbar('Error , Please Contact System Administrator' , SnackBarState.Warning)
    })
  }

  // getAllVacationsold(){
  //   this.vacationReport = [];
  //   const allVacations:Subscription =  this.db.getAllVacations().subscribe(vacations=>{
  //     allVacations.unsubscribe();
  //     this.createReport(vacations)  
  //   })
  // }


  // createReport(vacations:AnnualLeave[]){
    
  //   const getUsers:Subscription =  this.auth.getAllUsers().subscribe(users=>{
  //     getUsers.unsubscribe();
  //     this.allEmps = users.filter(user => user.department == Department.TECHNICAL_TEAM || user.department == Department.ADMINSTRATION);  // filter on another edit 
  //     for (let i in this.allEmps){
  //       const empVacations = vacations.filter(vac=>vac.empKey == this.allEmps[i].key);
  //       if(!!empVacations && empVacations.length > 0){
  //         const newReport:LeavesReport={
  //           empKey:this.allEmps[i].key || '',
  //           empName:this.allEmps[i].username,
  //           hiringDate:this.allEmps[i].hiringDate as string || '',
  //           totalBalance:this.allEmps[i].annualLeaveBalance || 0,
  //           currentBalance:this.allEmps[i].currentLeaveBalance || 0,
  //           annualLeave:0,
  //           examLeave:0,
  //           permission:0,
  //           SickLeave:0,
  //           unpaid:0,
  //           total:0
  //         }
  //         empVacations.map(vac=>{
  //           if(vac.finalStatus == leaveFinalStatus.Approved){
  //             switch(vac.leaveType){
  //               case LeaveType.AnnualLeave:
  //                 newReport.annualLeave += this.leaveDurationCalculation(vac)
  //                 newReport.total += this.leaveDurationCalculation(vac)
  //                 break;
  //               case LeaveType.EXAMLEAVE:
  //                 newReport.examLeave += this.leaveDurationCalculation(vac)
  //                 newReport.total += this.leaveDurationCalculation(vac)
  //                 break;
  //               case LeaveType.SICK:
  //                 newReport.SickLeave += this.leaveDurationCalculation(vac)
  //                 newReport.total += this.leaveDurationCalculation(vac)
  //                 break;
  //               case LeaveType.UNPAID:
  //                 newReport.unpaid += this.leaveDurationCalculation(vac)
  //                 newReport.total += this.leaveDurationCalculation(vac)
  //                 break;
  //               case LeaveType.PERMISSION:
  //                 newReport.permission += this.permissionDurationCalculation(vac)
  //                 break;
  //             }
  //           }
  //         })
  //         this.vacationReport.push(newReport)

  //       }else{
  //         const newReport:LeavesReport={
  //           empKey:this.allEmps[i].key || '',
  //           empName:this.allEmps[i].username,
  //           hiringDate:this.allEmps[i].hiringDate as string || '',
  //           totalBalance:this.allEmps[i].annualLeaveBalance || 0,
  //           currentBalance:this.allEmps[i].currentLeaveBalance || 0,
  //           annualLeave:0,
  //           examLeave:0,
  //           permission:0,
  //           SickLeave:0,
  //           unpaid:0,
  //           total:0
  //         }
  //         this.vacationReport.push(newReport)
  //       }
  //     }
  //   })
  // }


  // leaveDurationCalculation(annualLeave:AnnualLeave){
  //   let duration = 0;
  //   let from = new Date(annualLeave.from)
  //   let to = new Date(annualLeave.to)

  //   while( from <= to){
  //     if(from.getDay() != Days.Friday && from.getDay() != Days.Saturday){
  //       duration++;
  //     }
  //     from = new Date(from.setDate(from.getDate() + 1))
  //   }
  //   return duration;
  // }

  permissionDurationCalculation(annualLeave:AnnualLeave){
    let duration = 0;
    let from = (new Date(annualLeave.from).getHours() * 60) + new Date(annualLeave.from).getMinutes();
    let to = (new Date(annualLeave.to).getHours() * 60) + new Date(annualLeave.to).getMinutes();    
    duration = to - from;
    return duration;
  }


  exportVacationsReport():void{
    let element = document.getElementById('vacationReport'); 
    this.excelServ.exportexcel(element , `Vacations Report.xlsx`)
  }


}