import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Notifying } from 'src/app/interfaces/notification';
import { ResStatus } from 'src/app/interfaces/res-status';
import { EmpMonthlySalary, MonthSalaryApprovalCycle, MonthSalaryFinalStatus } from 'src/app/interfaces/salary';
import { SalaryIssue } from 'src/app/interfaces/salary-issue';
import { AccountRoles, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { FinanceService } from 'src/app/services/finance.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-monthly-salaries',
  templateUrl: './monthly-salaries.component.html',
  styleUrls: ['./monthly-salaries.component.scss']
})
export class MonthlySalariesComponent implements OnInit {
  closeResult: string;
  displayModal: boolean = false;

  currentUser:User;
  usersToCalculateSalaries:User[]=[];
  loadingSpinnerMode:boolean = false;

  finalMonthlySalaries:EmpMonthlySalary[] = [];
  date:Date;
  salaryForReview:EmpMonthlySalary;
  sendToManager:boolean = false;
  sendToManagerDialog:boolean = false;

  myManagers:User[]=[];
  managerToApprove:User;
  selectManagerToSendForm:FormGroup;
  AccountRolesEnum = AccountRoles;
  SalaryFinalStatusEnum = MonthSalaryFinalStatus;
  DepartmentEnum = Department;
  constructor(private _auth:AuthApiService,
              private _finance:FinanceService,
              private _notify:NotificationService,
              private excelServ:ExportExcelService) { }

  ngOnInit(): void {
    this.selectManagerToSendForm = new FormGroup({
      'managerKey' : new FormControl(null , Validators.required)
    })

    this._auth.user.subscribe(user=>{
      if(!!user){
        this.currentUser = user;
      }
    })

    // this.date = new Date('2/1/2022')
    // this.getMonthSalaries()
    
  }

  showModalDialog(salary:EmpMonthlySalary) {
    this.salaryForReview = salary;
    this.displayModal = true;
  }

  adminAction(salary:EmpMonthlySalary){
    this.salaryForReview = salary;
    this.displayModal = true;
  }

  managerAction(salary:EmpMonthlySalary){
    this.salaryForReview = salary;
    this.displayModal = true;
  }

  getMonthSalaries(){
    this.finalMonthlySalaries = [];
    this.loadingSpinnerMode = true;
    // const year = new Date(this.date).getFullYear();
    // const month = new Date(this.date).getMonth() + 1;
    const getAllMonthlySalary:Subscription =  this._finance.getMonthlySalaryReport(this.date).subscribe(salaries=>{
      
      if(salaries['status'] == ResStatus.CRUD){
        getAllMonthlySalary.unsubscribe();
        this.finalMonthlySalaries = salaries['data'];
        this.loadingSpinnerMode = false;
        console.log(this.finalMonthlySalaries);
        // if(salaries.length == 0){
        //   const getApprovedMonthlySalary:Subscription =  this._salary.getApprovedMonthSalary(year,month).subscribe(approvedSalaries=>{
        //     getApprovedMonthlySalary.unsubscribe();
        //     this.finalMonthlySalaries = approvedSalaries;
        //     this.loadingSpinnerMode = false;
        //   })
        // }else{
         
        // }
      }else{
        this.loadingSpinnerMode = false;
        console.log(salaries);
      }
      
    },err => {
      console.log(err);
      this.loadingSpinnerMode = false;
      this._notify.openSnackbar('Error , Please Contact System Adminstrator!', SnackBarState.Error , 10000);
    })
    // const getAllMonthlySalary:Subscription =  this._salary.getAllMonthSalary(year,month).subscribe(salaries=>{
    //   getAllMonthlySalary.unsubscribe();
    //   if(salaries.length == 0){
    //     const getApprovedMonthlySalary:Subscription =  this._salary.getApprovedMonthSalary(year,month).subscribe(approvedSalaries=>{
    //       getApprovedMonthlySalary.unsubscribe();
    //       this.finalMonthlySalaries = approvedSalaries;
    //       this.loadingSpinnerMode = false;
    //     })
    //   }else{
    //     this.finalMonthlySalaries = salaries;
    //     this.loadingSpinnerMode = false;
    //   }
      
    // })
  }


  validateSalaryIfExists(){
    // const year = new Date(this.date).getFullYear();
    // const month = new Date(this.date).getMonth() + 1;

    this._finance.getMonthlySalaryReport(this.date).subscribe(res=>{
      if(res['status'] ==ResStatus.CRUD){
        if(res['data'].length > 0){
          this._notify.openDialog(
            'Salary For This Date Already Exists',
            `Are you sure you want to rewite it?`,
            false,
            '*IF You click yes maybe can not get old salary again',
            true,
            false).subscribe(response => {
              if (response) {
                this.generateMonthSalary();
              } else {
                this.getMonthSalaries();
                this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
              }
          });
        }
      }else{
        this.generateMonthSalary();
      }
    })
    // const getAllMonthlySalary:Subscription = this._salary.getAllMonthSalary(year,month).subscribe(salaries=>{
    //   getAllMonthlySalary.unsubscribe();
    //   if(salaries.length > 0){
    //     this._notify.openDialog(
    //       'Salary For This Date Already Exists',
    //       `Are you sure you want to rewite it?`,
    //       false,
    //       '*IF You click yes maybe can not get old salary again',
    //       true,
    //       false).subscribe(response => {
    //         if (response) {
    //           this.generateMonthSalary();
    //         } else {
    //           this.getMonthSalaries();
    //           this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
    //         }
    //     });
    //   }else{
    //     this.generateMonthSalary();
    //   }
    // })
  }

  

  generateMonthSalary(){
    this.loadingSpinnerMode = true;
    this._finance.generatMonthlySalaryReport(this.date , MonthSalaryFinalStatus.PendingOnHR).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.loadingSpinnerMode = false;
        this._notify.openSnackbar(`Salary For ${this.date.getMonth() + 1}/${this.date.getDate()}/${this.date.getFullYear()} Created Successfully` , SnackBarState.Success , 5000)
        this.getMonthSalaries()  
        console.log(res);
      }else{
        this.loadingSpinnerMode = false;
        console.log(res);
      }
    },err=>{
      console.log(err);
      this.loadingSpinnerMode = false;
      this._notify.openSnackbar('Error , Please Contact System Adminstrator!', SnackBarState.Error , 10000);
    })
    
    // .then(()=>{
    //   this.loadingSpinnerMode = false;
    //   this._notify.openSnackbar(`Salary For ${this.date.getMonth() + 1}/${this.date.getDate()}/${this.date.getFullYear()} Created Successfully` , SnackBarState.Success , 5000)
    //   this.getMonthSalaries()
    // })
    // this._salary.generateMonthSalary(this.date).then(()=>{
    //   this.loadingSpinnerMode = false;
    //   this._notify.openSnackbar(`Salary For ${this.date.getMonth() + 1}/${this.date.getDate()}/${this.date.getFullYear()} Created Successfully` , SnackBarState.Success , 5000)
    //   this.getMonthSalaries()
    // })
  }
 

  exportMonthlySalaries():void{
    let element = document.getElementById('monthlySalary'); 
    this.excelServ.exportexcel(element , `monthlySalary${this.date.getFullYear()}-${this.date.getMonth() + 1}.xlsx`)
  }


  openDatePicker(dp) {
    dp.open();
  }

  closeDatePicker(eventData: any, dp?:any) {
    // get month and year from eventData and close datepicker, thus not allowing user to select date    
    this.date = eventData;
    this.getMonthSalaries();
    dp.close();    
  }


  // openDialogForReview(content , salary:EmpMonthlySalary) {
  //   this.salaryForReview = salary;

  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  openDialogToSendToManager() {
    this.sendToManagerDialog = true;
    this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(managers=>{
      if(managers['status'] == ResStatus.CRUD){
        this.myManagers = managers['data'];
      }
    })
  }
  


  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return  `with: ${reason}`;
  //   }
  // }

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


  // hrSendAllToManager(){
  //   for(let i in this.finalMonthlySalaries){
  //     this.finalMonthlySalaries[i].managerToApproveKey
  //   }
  // }

  finalApprove(){
    const managerKey = this.selectManagerToSendForm.get(['managerKey'])?.value; 
    const reportDate = `${new Date(this.finalMonthlySalaries[0].date).getMonth() +1 }/${new Date(this.finalMonthlySalaries[0].date).getDate()}/${new Date(this.finalMonthlySalaries[0].date).getFullYear()}`;
    if(!!managerKey && !!reportDate){
      this._finance.hrApproveSalary(reportDate,managerKey).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.getMonthSalaries();
          this._notify.openSnackbar('Sucess', SnackBarState.Success);
        }else{
          console.log(res);
          this._notify.openSnackbar('Error , Please Contact System Adminstrator', SnackBarState.Error);
        }
      },err=>{
          this._notify.openSnackbar('Error , Please Contact System Adminstrator', SnackBarState.Error);
          console.log(err);
      })
    }else{
      this._notify.openSnackbar('Missing Manager or date', SnackBarState.Warning);
    }
  }



  managerApproveAll(){ 
    this._notify.openDialog(
      'Approve All',
      `Are you sure you want to Approve All?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          const reportDate = `${new Date(this.finalMonthlySalaries[0].date).getMonth() +1 }/${new Date(this.finalMonthlySalaries[0].date).getDate()}/${new Date(this.finalMonthlySalaries[0].date).getFullYear()}`;
          if( !!reportDate){
            this._finance.managerApproveSalary(reportDate).subscribe(res=>{
              if(res['status'] == ResStatus.CRUD){
                this.getMonthSalaries();
                this._notify.openSnackbar('Sucess', SnackBarState.Success);
              }else{
                console.log(res);
                this._notify.openSnackbar('Error , Please Contact System Adminstrator', SnackBarState.Error);
              }
            },err=>{
                this._notify.openSnackbar('Error , Please Contact System Adminstrator', SnackBarState.Error);
                console.log(err);
            })
          }else{
            this._notify.openSnackbar('Error , Please Contact System Adminstrator', SnackBarState.Warning);
          }
          // for(let i in this.finalMonthlySalaries){
          //   this.finalMonthlySalaries[i].monthSalaryApprovalCycle = MonthSalaryApprovalCycle.Finished;
          //   this.finalMonthlySalaries[i].MonthSalaryFinalStatus = MonthSalaryFinalStatus.Approved;
          //   this.finalMonthlySalaries[i].managerDissisionKey = this.currentUser.key;
          //   this.finalMonthlySalaries[i].managerDissisionName = this.currentUser.username;
          //   this.finalMonthlySalaries[i].managerDissisionAt = new Date().toLocaleString();
          //   this.finalMonthlySalaries[i].managerDissision = true;
          //   const year = new Date(this.finalMonthlySalaries[i].date).getFullYear();
          //   const month = new Date(this.finalMonthlySalaries[i].date).getMonth() + 1;
          //   this._salary.addApprovedDevMonthlySalary(year,month,this.finalMonthlySalaries[i].empKey,this.finalMonthlySalaries[i])
          // }
          // const noti:Notifying ={
          //   receverKey:'RYART21ZBRTC4GWxFVrqmjwdqKZ2', //'AYBjDkidDOgFiGfB585Fl4HZ2up1',//
          //   receverName:'Finance',
          //   senderKey:this.currentUser.key || '',
          //   senderName:this.currentUser.username,
          //   title: 'Salary Approved',
          //   body : `${this.currentUser.username} Approved Monthly Salary Please Pay It`,
          //   redirection:`/manager/salaries`,
          //   senderImg : this.currentUser.photoURL || ''
          // } 
          // this._message.createnotification(noti);
          // this.getMonthSalaries();
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
    
    
  }
}
