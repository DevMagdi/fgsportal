import { Component, OnInit } from '@angular/core';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ResStatus } from 'src/app/interfaces/res-status';
import { EmpMonthlySalary, MonthSalaryFinalStatus } from 'src/app/interfaces/salary';
import { AccountRoles, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { FinanceService } from 'src/app/services/finance.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-approved-salaries',
  templateUrl: './approved-salaries.component.html',
  styleUrls: ['./approved-salaries.component.scss']
})
export class ApprovedSalariesComponent implements OnInit {
  currentUser:User;
  loadingSpinnerMode:boolean = false;
  finalMonthlySalaries:EmpMonthlySalary[] = [];
  date:Date;
  AccountRolesEnum = AccountRoles;
  SalaryFinalStatusEnum = MonthSalaryFinalStatus;
  DepartmentEnum = Department;
  constructor(private _auth:AuthApiService,
              private _finance:FinanceService,
              private _notify:NotificationService,
              private excelServ:ExportExcelService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      if(!!user){
        this.currentUser = user;
      }
    })

    this.date = new Date(new Date().setMonth(new Date().getMonth() - 1))  //new Date(new Date())
    // this.getApprovedSalaries()

  }

  

  getApprovedSalaries(){
    this.finalMonthlySalaries = [];
    this.loadingSpinnerMode = true;
    // const year = new Date(this.date).getFullYear();
    // const month = new Date(this.date).getMonth() + 1;
    this._finance.getApprovedMonthlySalaryReport(this.date).subscribe(approvedSalaries=>{
      if(approvedSalaries['status'] == ResStatus.CRUD){
        this.finalMonthlySalaries = approvedSalaries['data'];
        this.loadingSpinnerMode = false;
      }else{
        this.loadingSpinnerMode = false;
      }
    },err=>{
      this.loadingSpinnerMode = false;
      this._notify.openSnackbar('Error , Please Contact System Adminstrator!', SnackBarState.Error , 10000);
    })
  }

  openDatePicker(dp) {
    dp.open();
  }

  closeDatePicker(eventData: any, dp?:any) {
    // get month and year from eventData and close datepicker, thus not allowing user to select date    
    this.date = eventData;
    this.getApprovedSalaries();
    dp.close();    
  }

  exportMonthlySalaries():void{
    let element = document.getElementById('approvedMonthlySalary'); 
    this.excelServ.exportexcel(element , `monthlySalary${this.date.getFullYear()}-${this.date.getMonth() + 1}.xlsx`)
  }
  payAll(){
    this._notify.openDialog(
      'Pay All',
      `Are you sure you want to Pay All?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          const reportDate = `${new Date(this.finalMonthlySalaries[0].date).getMonth() +1 }/${new Date(this.finalMonthlySalaries[0].date).getDate()}/${new Date(this.finalMonthlySalaries[0].date).getFullYear()}`;
          this._finance.financePaySalary(reportDate,0).subscribe(res=>{
            console.log("Da el response bta3 el pay ya ahmad" , res);
            
            if(res['status'] == ResStatus.CRUD){
              console.log(res);
              this.getApprovedSalaries();
              this._notify.openSnackbar('Sucess', SnackBarState.Success);
            }else{
              console.log(res);
              this._notify.openSnackbar('Error , Please Contact System Adminstrator', SnackBarState.Error);
            }
          },err=>{
            this._notify.openSnackbar('Error , Please Contact System Adminstrator', SnackBarState.Error);
            console.log(err);
          });
          // for(let i in this.finalMonthlySalaries){
            // this.finalMonthlySalaries[i].MonthSalaryFinalStatus = MonthSalaryFinalStatus.PAID;
            // const year = new Date(this.finalMonthlySalaries[i].date).getFullYear();
            // const month = new Date(this.finalMonthlySalaries[i].date).getMonth() + 1;
            // const noti:Notifying ={
            //   receverKey:this.finalMonthlySalaries[i].empKey ,
            //   receverName:this.finalMonthlySalaries[i].empName,
            //   senderKey:this.currentUser.key || '',
            //   senderName:this.currentUser.username,
            //   title: 'Salary Transfaied',
            //   body : `Your Salary Has Been Transfared`,
            //   redirection:`/`,
            //   senderImg : ""
            // } 
            // this._message.createnotification(noti);
          // }
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
    
  }
  // getApprovalCycle(status:number){
  //   switch (status) {
  //     case 0:
  //       return 'Pending On HR'
  //     case 1:
  //       return 'Pending On Manager'
  //     case 2:
  //       return 'Pending On Developer'
  //     case 3:
  //       return 'Pending On PM'
  //     default:
  //       return 'Finished'
  //   }
  // }
}
