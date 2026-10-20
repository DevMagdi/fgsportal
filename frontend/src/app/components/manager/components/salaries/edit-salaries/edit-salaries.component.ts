import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Salary } from 'src/app/interfaces/salary';
import { AccountRoles, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FinanceService } from 'src/app/services/finance.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-edit-salaries',
  templateUrl: './edit-salaries.component.html',
  styleUrls: ['./edit-salaries.component.scss']
})
export class EditSalariesComponent implements OnInit {
  displayedColumns: string[] = ['Salary', 'ApplyFrom', 'IsCurrent', 'EndedAt', 'CreatedAt', 'CreatedBy','edit'];
  reportDisplayedColumns: string[] = ['Name','Salary', 'ApplyFrom','EndedAt', 'CreatedAt', 'CreatedBy'];
  empSalaries:Salary[]=[];

  getEmpSalaryForm:FormGroup;
  createNewSalaryForm:FormGroup;

  allUsers:User[] = [];

  userToDisplay:User;
  currentUser:User;
  closeResult: string;

  salaryToEdit:Salary;
  salaryToEditTemp:Salary;

  salaryOnEditMode:boolean = false;
  salaryToEditIndex:number;
  startDate = new Date(2021, 0, 1);
  editSalaryLoading:boolean = false;
  allMode:boolean = false;

  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private _finance:FinanceService,
              private modalService: NgbModal,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this.salaryToEditTemp = {
      applyfrom : new Date(),
      createdByKey : '',
      createdByName : '',
      empKey : '',
      empName: '',
      salary : 0
    }
    this._auth.user.subscribe(user=>{
      if(!!user){
        this.currentUser = user;
      }
    })

    this.getAllUsers();

    this.getEmpSalaryForm = new FormGroup({
      'empKey' : new FormControl(null , Validators.required)
    })
    
    this.createNewSalaryForm = new FormGroup({
      'salary' : new FormControl(null , Validators.required),
      'applyfrom' : new FormControl(null , Validators.required)
    })
  }


  getAllUsers(){
    const getAllUsers:Subscription = this._auth.getAllUsers().subscribe(res=>{
      getAllUsers.unsubscribe();      
      if(res['status'] == ResStatus.CRUD){
        const users = res['data'] as User[];
        this.allUsers = users.filter(u=>u.accRole != AccountRoles.SUPER_USER)
        this.allUsers = this.allUsers.sort((a,b)=>{
          return compare(a.username, b.username, true);
        })
      }
    })
  }

  getEmpSalaries(){
    if(this.getEmpSalaryForm.get('empKey')?.value == 'all'){
      this.getEmpsSalaryReport()
    }else{
      this.allMode = false;
      const userKey = this.getEmpSalaryForm.get('empKey')?.value;
      if(!!userKey){
        const userFound = this.allUsers.find(user=>user.key == userKey)
        if(!!userFound){
          this.userToDisplay = userFound;
          this.getEmpSalaryHistory()
        }
      }
    }
  }

  getEmpsSalaryReport(){
    this.allMode = true;
    this.salaryOnEditMode = false;
    this._finance.getEmpsSalaryReport().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.empSalaries = res['data'];
        this.empSalaries = this.empSalaries.sort((a,b)=>{
          return compare(a.empName, b.empName, true);
        })        
      }
    })
  }


  getEmpSalaryHistory(){
    this.empSalaries = [];
    const salariesSubsc:Subscription =  this._finance.getEmpSalaryHistory(this.userToDisplay.key || '').subscribe((history)=>{
      salariesSubsc.unsubscribe();
      if(history['status'] == ResStatus.CRUD){
        this.empSalaries = history['data'];
      }
    })
  }

  createNewSalary(){
    this.editSalaryLoading = true;
    const newSalary:Salary = {
      empKey : this.userToDisplay.key || '',
      empName : this.userToDisplay.username,
      salary :  this.createNewSalaryForm.get('salary')?.value,
      applyfrom : new Date(this.createNewSalaryForm.get('applyfrom')?.value).toLocaleDateString(),
      createdByKey : this.currentUser.key || '',
      createdByName : this.currentUser.username,
      isActive : true
    }
    this._finance.createNewSalary(newSalary).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this._db.createSystemLogs(
          `${this.currentUser.username} Updated ${newSalary.empName} Salary`,
          `${this.currentUser.key} Updated ${newSalary.empKey} Salary`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Success'
        ).subscribe()
        this.createNewSalaryForm.reset();
        this.getEmpSalaryHistory()
        this.editSalaryLoading = false;
        this._notify.openSnackbar('Salary Updated Successfuly', SnackBarState.Success)
      }else{
        this._db.createSystemLogs(
          `${this.currentUser.username} Try To Update ${newSalary.empName} Salary => Error => ${JSON.stringify(res['data'])}`,
          `${this.currentUser.key} Try To Update ${newSalary.empKey} Salary`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Fail'
        ).subscribe()
        this.editSalaryLoading = false;
        this._notify.openSnackbar(`error ${JSON.stringify(res['data'])}`, SnackBarState.Warning)
      }
    },err=>{
      this._db.createSystemLogs(
        `${this.currentUser.username} Try To Update ${newSalary.empName} Salary => Error => ${JSON.stringify(err['error']['data'])}`,
        `${this.currentUser.key} Try To Update ${newSalary.empKey} Salary`,
        this.currentUser.key || '',
        this.currentUser.username,
        'Fail'
      ).subscribe()
      this.editSalaryLoading = false;
      this._notify.openSnackbar(`error ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error)
    })
    
    
    // .then(()=>{
    //   for(let i in this.empSalaries){
    //     if(this.empSalaries[i].isActive == true){
    //       this.empSalaries[i].isActive = false;
    //       const newSalaryApplyFromDate = new Date(newSalary.applyfrom)
    //       this.empSalaries[i].endedAt = new Date(newSalaryApplyFromDate.setDate(newSalaryApplyFromDate.getDate()-1)).toLocaleDateString();
    //       this._salary.editSalary(this.empSalaries[i])
    //     }
    //   }
    //   this.createNewSalaryForm.reset();
    //   this.getEmpSalaryHistory()
    //   this._notify.openSnackbar('Salary Updated Successfuly', SnackBarState.Success)
    // })
  }


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


  editSalary(salary:Salary , index){
    this.salaryToEdit  = salary;
    this.salaryOnEditMode = true;
    this.salaryToEditIndex = index;
  }

  cancelEditSalary(){
    this.salaryToEdit = this.salaryToEditTemp;
    this.salaryToEditIndex = 0;
    this.salaryOnEditMode = false;
    this.getEmpSalaryHistory();

  }

  saveSalary(){
    this._finance.editSalary(this.salaryToEdit).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.cancelEditSalary();
        this.editSalaryLoading = true;
        this._notify.openSnackbar('Salary Updated Successfuly', SnackBarState.Success);
      }else{
        this.editSalaryLoading = false;
        this._notify.openSnackbar('Error , Please Contact System Adminstrator', SnackBarState.Error);
      }
    },err=>{
      console.log(err);
      this.editSalaryLoading = false;
      this._notify.openSnackbar('Error , Please Contact System Adminstrator', SnackBarState.Error);
    })
  }
  openDatePicker(picker) {
    picker.open();
  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}