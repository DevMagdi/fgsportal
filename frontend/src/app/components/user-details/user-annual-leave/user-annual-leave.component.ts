import { Component, Input, OnInit } from '@angular/core';
import { AnnualLeave, leaveFinalStatus, LeaveType, PermissionAndLeavesConfig } from 'src/app/interfaces/annualLeave';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from '../../snackbar/snackbar.component';
import { Days } from '../../dev/components/time-sheet/time-sheet.component';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ResStatus } from 'src/app/interfaces/res-status';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-user-annual-leave',
  templateUrl: './user-annual-leave.component.html',
  styleUrls: ['./user-annual-leave.component.scss']
})
export class UserAnnualLeaveComponent implements OnInit {


  @Input() currentUser:User;
  @Input() loggedInUser:User;


  balanceEditMode:boolean = false;
  permissionBalanceEditMode:boolean = false;
  currentBalanceBeforeEdit:number = 0; 
  currentPermissionBalanceBeforeEdit:number = 0;
  
  myLeaves:AnnualLeave[] = [];
  myPendingLeaves:AnnualLeave[] = [];
  closeResult: string;

  newLeaveForm:FormGroup;
  formInvalidMessage ; 
  
  leaveTypeEnum = LeaveType;
  shouldAttach:boolean = false;
  url:string = ''
  newImg: File | undefined;


  managers:User[] = [];
  leaveOnEditMode:boolean = false;
  math= Math;
  today:Date;
  DepartmentEnum = Department;
  leaveStatusEnum = leaveFinalStatus;


  pendingBalance:number =  0;
  annualLeaveBalance:number =  0;
  currentLeaveBalance:number =  0;
  annualPermissionBalance:number =  0;
  currentPermissionBalance:number =  0;
  leavesBalace:PermissionAndLeavesConfig;

  modalOpen=false;
  constructor(private modalService: NgbModal,
              private _notify:NotificationService,
              private _auth:AuthApiService,
              private _db:DatabaseService,
            private loadingService:LoadingService) { }

  ngOnInit(): void {
    // this.assignEndDate();
    this.getMyBalance();
    this.getMyrequests();
    this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.managers = res['data']
        this._auth.getUserByFilter(Department.TECHNICAL_TEAM , undefined, AccountPositions.MANAGER).subscribe(res=>{
          if(res['status'] == ResStatus.CRUD){
            res['data'].map(manager=>{
              if(manager.key != '36'){
                this.managers.push(manager)
              }
            })
          }
        })
      }
    })

    this.newLeaveForm = new FormGroup({
      "from":new FormControl(null, Validators.required),
      "to":new FormControl(null , Validators.required),
      "leaveType":new FormControl(null , Validators.required),
      "reason":new FormControl(null ,[Validators.required , Validators.minLength(5)]),
      "managerToApproveKey":new FormControl(null, Validators.required),
    })
  }


  getLeaveTypesBalance(){
    this._db.getPermissionAndLeavesConfig().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.leavesBalace = res['data']       
      }
    })
  }

  getMyBalance(){
    this._db.getUserLeaveBalance(this.currentUser.key || '').subscribe(res=>{    
     
       
      if(res['status']==ResStatus.CRUD){
        this.pendingBalance =  res['data']['pendingBalance'];
        this.annualLeaveBalance =  res['data']['annualLeaveBalance'];
        this.currentLeaveBalance = res['data']['currentLeaveBalance'];
        this.annualPermissionBalance =  res['data']['annualPermissionBalance'];
        this.currentPermissionBalance =  res['data']['currentPermissionBalance'];
      }else{
        this.pendingBalance =  0;
        this.annualLeaveBalance =  0;
        this.currentLeaveBalance =  0;
        this.annualPermissionBalance =  0;
        this.currentPermissionBalance =  0;
      }
    },err=>{
      console.log(err);
      this.pendingBalance =  0;
      this.annualLeaveBalance =  0;
      this.currentLeaveBalance =  0;
      this.annualPermissionBalance =  0;
      this.currentPermissionBalance =  0;
    })
  }


  getMyrequests(){
    this._db.getAnnualLeavesByUSerID(this.currentUser.key || '').subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.myLeaves = res['data'];
      }else{
        this.myLeaves = [];
      }
    },err=>{
      this.myLeaves = [];
      console.log(err);
    })
  }




  // editBalance(){
  //   this.balanceEditMode = true;
  //   this.currentBalanceBeforeEdit = this.currentUser.annualLeaveBalance ? this.currentUser.annualLeaveBalance : 0;
  // }

  // saveBalance(){
  //   if(!!this.currentUser.pendingBalance){
  //     this.currentUser.monthlyBalance = this.currentUser.pendingBalance / 12;
  //   }
  //   this.auth.editUser(this.currentUser).then(
  //     ()=>{
  //       this.balanceEditMode = false;
  //       this.currentBalanceBeforeEdit = this.currentUser.annualLeaveBalance ? this.currentUser.annualLeaveBalance : 0 ;
  //       this.calculateAllAnnualLeavesDuration();
  //     }
  //   )
  // }
  // cancelBalance(){
  //   this.balanceEditMode = false;
  //   this.currentUser.annualLeaveBalance = this.currentBalanceBeforeEdit ;
  // }


  // editPermissionBalance(){
  //   this.permissionBalanceEditMode = true;
  //   this.currentPermissionBalanceBeforeEdit = this.currentUser.annualPermissionBalance ? this.currentUser.annualPermissionBalance : 0;
  // }

  // savePermissionBalance(){
  //   this.auth.editUser(this.currentUser).then(
  //     ()=>{
  //       this.permissionBalanceEditMode = false;
  //       this.currentPermissionBalanceBeforeEdit = this.currentUser.annualPermissionBalance ? this.currentUser.annualPermissionBalance : 0 ;
  //       this.calculateAllpermisstionsDuration();
  //     }
  //   )
  // }
  // cancelPermissionBalance(){
  //   this.permissionBalanceEditMode = false;
  //   this.currentUser.annualPermissionBalance = this.currentPermissionBalanceBeforeEdit ;
  // }



  leaveDurationCalculation(leave_from:string|Date,leave_to:string|Date){
    let duration = 0;
    let from = new Date(leave_from)
    let to = new Date(leave_to)

    while( from <= to){
      if(from.getDay() != Days.Friday && from.getDay() != Days.Saturday){
        duration++;
      }
      from = new Date(from.setDate(from.getDate() + 1))
    }
    return duration;
  }


  permissionDurationCalculation(leave_from:string|Date,leave_to:string|Date){
    let duration = 0;
    let from = (new Date(leave_from).getHours() * 60) + new Date(leave_from).getMinutes();
    let to = (new Date(leave_to).getHours() * 60) + new Date(leave_to).getMinutes();    
    duration = to - from;
    return duration;
  }

  getCurrentYearDuration(annualLeave:AnnualLeave){
    let duration = 0;
    let from = new Date(annualLeave.from)
    let to = new Date(annualLeave.to)
    while( from <= to){
      if((from.getDay() != Days.Friday && from.getDay() != Days.Saturday) && (from.getFullYear() == new Date(this.today).getFullYear())){
        duration++;
      }
      from = new Date(from.setDate(from.getDate() + 1))
    }
    return duration;
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


  checkEmpPermisstionBalance(){
    const managerName = this.managers.find(man=>man.key == this.newLeaveForm.get(['managerToApproveKey'])?.value)?.username
    const newLeaveRequst:AnnualLeave = {
      empKey:this.currentUser.key || '',
      empName : this.currentUser.username , 
      empImgUrl : this.currentUser.photoURL ? this.currentUser.photoURL : '',
      from : this.newLeaveForm.get(['from'])?.value,
      to : this.newLeaveForm.get(['to'])?.value,
      leaveType : this.newLeaveForm.get(['leaveType'])?.value,
      managerToApproveKey : this.newLeaveForm.get(['managerToApproveKey'])?.value,
      managerToApproveName : managerName,
      reason : this.newLeaveForm.get(['reason'])?.value
    }
  }

  validateNewLeaveRequest(){
    let leaveBalanceValid:boolean = false;

    // to check if Duration > 0 
    
    if(this.newLeaveForm.get(['leaveType'])?.value == LeaveType.PERMISSION){
      if(this.permissionDurationCalculation(this.newLeaveForm.get(['from'])?.value , this.newLeaveForm.get(['to'])?.value) <= 0){
        return this._notify.openSnackbar('you tried to Permission with 0 Hours !!!!!!!!!!' , SnackBarState.Error , 5000)
      }
    }else{
      if(this.leaveDurationCalculation(this.newLeaveForm.get(['from'])?.value , this.newLeaveForm.get(['to'])?.value) <= 0){
        return this._notify.openSnackbar('you tried to take vacation on weekend !!!!!!!!!!' , SnackBarState.Error , 5000)
      }
    }
    


    // to check if Attach Mandatory Or NO 
    if(this.newLeaveForm.get(['leaveType'])?.value == LeaveType.EXAMLEAVE || this.newLeaveForm.get(['leaveType'])?.value == LeaveType.SICK){
      if(!!this.newImg){
        leaveBalanceValid = true;
      }else{
        leaveBalanceValid = false;
        return this._notify.openSnackbar('Attach Is Mandatory' , SnackBarState.Info , 5000)
      }
    }else{
      leaveBalanceValid = true;
    }
    
    // to check if user has balance or not
    if(leaveBalanceValid == true){      
      if(this.newLeaveForm.get(['leaveType'])?.value == LeaveType.AnnualLeave){
        if(this.currentLeaveBalance >= this.leaveDurationCalculation(this.newLeaveForm.get(['from'])?.value , this.newLeaveForm.get(['to'])?.value)){        
          leaveBalanceValid = true;
        }else{
          leaveBalanceValid = false;
        }
      }else if(this.newLeaveForm.get(['leaveType'])?.value == LeaveType.PERMISSION){
        if(this.currentPermissionBalance >= this.permissionDurationCalculation(this.newLeaveForm.get(['from'])?.value , this.newLeaveForm.get(['to'])?.value)){
          leaveBalanceValid = true;
        }else{
          leaveBalanceValid = false;
        }
      }else{
        leaveBalanceValid = true;
      }
    }


    // To Check If the User has any vacations during current request
    if(leaveBalanceValid == true){
      let allLeaves:AnnualLeave[] = [];
      let allLeavesDates:string[]= [];
      let currentLeaveDates:string[] = [];

      let start = new Date(this.newLeaveForm.get(['from'])?.value)    
      let end = new Date(this.newLeaveForm.get(['to'])?.value)

      while(start <= end){
        currentLeaveDates.push(`${new Date(start).getMonth()+1}/${new Date(start).getDate()}/${new Date(start).getFullYear()}`)
        start = new Date(start.setDate(start.getDate() + 1) ) 
      }

      if(this.newLeaveForm.get('to')?.value >=  this.newLeaveForm.get('from')?.value){
        // this.createNewLeaverequest();

        this._db.getAnnualLeavesByUSerID(this.currentUser.key || '').subscribe(res=>{
          if(res['status'] == ResStatus.CRUD){
            const myLeaves = res['data'] as AnnualLeave[];
            allLeaves = myLeaves.filter(l=>l.finalStatus != leaveFinalStatus.rejected);
            allLeaves.map(leave=>{
              let start = new Date(leave.from)    
              let end = new Date(leave.to)
              while(start <= end){
                allLeavesDates.push(`${new Date(start).getMonth()+1}/${new Date(start).getDate()}/${new Date(start).getFullYear()}`)
                start = new Date(start.setDate(start.getDate() + 1))
              }
            })

            let isFounded = currentLeaveDates.some( leaveDate => allLeavesDates.indexOf(leaveDate) !== -1);

            if(!!isFounded){                    
              this._notify.openSnackbar(`You Have Already Leave / Premission Request In The Same Date` , SnackBarState.Error , 5000)
            }else{
            
              
              this.createNewLeaverequest();
            }
          }else if(res['status'] == ResStatus.Success_But_Empty){
            this.createNewLeaverequest();
          }else{       
            this.createNewLeaverequest();
          }

            
        });
      }else{
        this._notify.openSnackbar(`You Have Entered Invalid Date` , SnackBarState.Error , 5000)
      }

    }else{
      this._notify.openSnackbar('Your Balance Is Less Than Your Request' , SnackBarState.Info , 5000)
    }
    

  }

  permissionDateFormatted(date , ifFrom:boolean){
    const day = `${new Date(date).getDate()}`;
    const month = `${new Date(date).getMonth() + 1}`;
    const year = `${new Date(date).getFullYear()}`;
    if(!!ifFrom){
      return `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year} 00:00:00`
    }else{
      return `${month.length == 1 ? `0${month}` : month}/${day.length == 1 ? `0${day}` : day}/${year} 23:59:59`
    }
  }

  createNewLeaverequest(){

    this.loadingService.setLoading(true);
    
    const fd : FormData = new FormData()
    fd.append('reason' , this.newLeaveForm.get(['reason'])?.value)
    
    fd.append('annual_type_id' , this.newLeaveForm.get(['leaveType'])?.value)     
    fd.append('annual_status_id' , leaveFinalStatus.PendingOnManager)     
    fd.append('manager_approve_id' , this.newLeaveForm.get(['managerToApproveKey'])?.value)    
    fd.append('user_id' , this.currentUser.key||'')    

    if(this.newLeaveForm.get(['leaveType'])?.value == LeaveType.PERMISSION){
      const duration =  this.permissionDurationCalculation(this.newLeaveForm.get(['from'])?.value , this.newLeaveForm.get(['to'])?.value)
      fd.append('duration' , `${duration}`)
      fd.append('from' , this.newLeaveForm.get(['from'])?.value)
      fd.append('to' , this.newLeaveForm.get(['to'])?.value)
    }else{
      const duration =  this.leaveDurationCalculation(this.newLeaveForm.get(['from'])?.value , this.newLeaveForm.get(['to'])?.value)
      fd.append('duration' , `${duration}`)
      fd.append('from' , this.permissionDateFormatted(this.newLeaveForm.get(['from'])?.value , true))
      fd.append('to' , this.permissionDateFormatted(this.newLeaveForm.get(['to'])?.value , false))
    }

    if(this.shouldAttach && !!this.newImg){
      fd.append('attach_file' , this.newImg , this.newImg.name)
      this._db.createVacationRequest(fd).subscribe(res=>{
       


        if(res['status'] == ResStatus.CRUD){
          this.newLeaveForm.reset();
          this.newImg = undefined;
          this.url = '';
          this.getMyBalance();
          this.getMyrequests();
          this._notify.openSnackbar(`Created Successfully` , SnackBarState.Success)
        }else{
          
          this._notify.openSnackbar(`Something Wrong , Please Contact System Adminstrator` , SnackBarState.Warning , 5000)

        }
        this.modalOpen=false;
        this.loadingService.setLoading(false);

      },err=>{
        if(err['status'] == ResStatus.ValidationError){
          console.log(err);
          this._notify.openSnackbar(`Something Wrong , ${err['error']['data']['message']}` , SnackBarState.Warning , 5000)
        }else{
          console.log(err);
          this._notify.openSnackbar(`Error , Please Contact System Adminstrator` , SnackBarState.Error , 5000)
          this._db.createSystemLogs(
            `${this.currentUser.username} Error, ${JSON.stringify(err['error']['data'])} Faild to create vacation type ${fd.get('annual_type_id')} {${fd.get('from')} => ${fd.get('to')} =>${fd.get('duration')}=>${fd.get('manager_approve_id')}=>${fd.get('reason')}} At ${new Date().toLocaleString()}`,
            `${this.currentUser.key} Faild to create vacation type ${fd.get('annual_type_id')} {${fd.get('from')} => ${fd.get('to')} =>${fd.get('duration')}=>${fd.get('manager_approve_id')}=>${fd.get('reason')}} At ${new Date().toLocaleString()}`,
            this.currentUser.key || '',
            this.currentUser.username,
            'Faild'
          ).subscribe()
        }
       
        this.modalOpen=false;
        this.loadingService.setLoading(false);

      })
    }else{
      this._db.createVacationRequest(fd).subscribe(res=>{       
        if(res['status'] == ResStatus.CRUD){
          this.newLeaveForm.reset();
          this.newImg = undefined;
          this.url = '';
          this.getMyBalance();
          this.getMyrequests();
        }else{
       
          this._notify.openSnackbar(`Something Wrong , Please Contact System Adminstrator` , SnackBarState.Warning , 5000)
          
        }
        this.modalOpen=false;
        this.loadingService.setLoading(false);
      },err=>{

        this.modalOpen=false;
        this.loadingService.setLoading(false);

        if(err['status'] == ResStatus.ValidationError){
          console.log(err);
          this._notify.openSnackbar(`Something Wrong , ${err['error']['data']['message']}` , SnackBarState.Warning, 5000)
        }else{
          console.log(err);
          this._notify.openSnackbar(`Error , Please Contact System Adminstrator` , SnackBarState.Error, 5000)
          this._db.createSystemLogs(
            `${this.currentUser.username} Error, ${err['error']['data']} Faild to create vacation type ${fd.get('annual_type_id')} {${fd.get('from')} => ${fd.get('to')} =>${fd.get('duration')}=>${fd.get('manager_approve_id')}=>${fd.get('reason')}} At ${new Date().toLocaleString()}`,
            `${this.currentUser.key} Faild to create vacation type ${fd.get('annual_type_id')} {${fd.get('from')} => ${fd.get('to')} =>${fd.get('duration')}=>${fd.get('manager_approve_id')}=>${fd.get('reason')}} At ${new Date().toLocaleString()}`,
            this.currentUser.key || '',
            this.currentUser.username,
            'Faild'
          ).subscribe()
        }
      })
    }
  }

  assignEndDate(){
    let duration = 0;
    let endDate = new Date(this.newLeaveForm.get('from')?.value);
    endDate = new Date(endDate.setDate(endDate.getDate() - 1))

    if(this.newLeaveForm.get('leaveType')?.value == LeaveType.Bereavement_Leave){
      duration = this.leavesBalace.bereavement || 0
    }else if(this.newLeaveForm.get('leaveType')?.value == LeaveType.Marriage_Leave){
      duration = this.leavesBalace.marriage || 0
    }else if(this.newLeaveForm.get('leaveType')?.value == LeaveType.Birth_Leave){      
      duration = this.leavesBalace.birth || 0
    }else if(this.newLeaveForm.get('leaveType')?.value == LeaveType.Birth_Leave_F){      
      duration = this.leavesBalace.birth_f || 0
    }
    

    while( duration > 0){
      endDate = new Date(endDate.setDate(endDate.getDate() + 1))
      if(endDate.getDay() != Days.Friday && endDate.getDay() != Days.Saturday){
        duration--;
      }
    }
    
    this.newLeaveForm.patchValue({
      'to' : this._db.getDateFormattedYearMonthDay(endDate)
    })
  }

  checkType(){    
    if(this.newLeaveForm.get('leaveType')?.value == LeaveType.EXAMLEAVE || this.newLeaveForm.get('leaveType')?.value == LeaveType.SICK){
      this.shouldAttach = true;
    }else{
      this.shouldAttach = false;
    }

    if(this.newLeaveForm.get('leaveType')?.value == LeaveType.Bereavement_Leave || this.newLeaveForm.get('leaveType')?.value == LeaveType.Marriage_Leave || this.newLeaveForm.get('leaveType')?.value == LeaveType.Birth_Leave|| this.newLeaveForm.get('leaveType')?.value == LeaveType.Birth_Leave_F){
      this.newLeaveForm.get('to')?.disable();
      if(!!this.newLeaveForm.get('from')?.value){
        this.assignEndDate();
      }
    }else{
      this.newLeaveForm.get('to')?.enable();
    }

  }



  imageupload(event:any){
    this.newImg = event.target.files[0]
     if (event.target.files){
       var reader = new FileReader()
       reader.readAsDataURL(event.target.files[0])
       reader.onload = (event:any) =>{
         this.url = event.target.result
         this.newLeaveForm.patchValue({
          'attachedURL' : this.url
        })
       }
     }
  }



  editLeaveRequest(penleave:AnnualLeave){
    this.leaveOnEditMode = true ;
    this.newLeaveForm.patchValue({
      "from":penleave.from,
      "to":penleave.to,
      "leaveType":penleave.leaveType,
      "reason":penleave.reason,
      "managerToApproveKey":penleave.managerToApproveKey,
    })
    if(!!penleave.attach){
      this.shouldAttach = true;
      this.url = penleave.attach;
    }
  }



  submitEditLeaveRequest(){
    // const managerName = this.managers.find(man=>man.key == this.newLeaveForm.get(['managerToApproveKey'])?.value)?.username
    // const updateLeaveRequst:AnnualLeave = {
    //   empKey:this.currentUser.key || '',
    //   empName : this.currentUser.username , 
    //   empImgUrl : this.currentUser.photoURL ? this.currentUser.photoURL : '',
    //   from : this.newLeaveForm.get(['from'])?.value,
    //   to : this.newLeaveForm.get(['to'])?.value,
    //   leaveType : this.newLeaveForm.get(['leaveType'])?.value,
    //   managerToApproveKey : this.newLeaveForm.get(['managerToApproveKey'])?.value,
    //   managerToApproveName : managerName,
    //   reason : this.newLeaveForm.get(['reason'])?.value
    // }

    // if(this.shouldAttach){
    //   this.db.annualLeaveUpdate(updateLeaveRequst).then(()=>{
    //     this._notify.openSnackbar(`${this.newLeaveForm.get(['leaveType'])?.value} Updated Successfully!` , SnackBarState.Success)
    //     this.newLeaveForm.reset();
    //     this.newImg = undefined;
    //     this.url = '';
    //   })
    // }
  }


  deleteLeaveRequest(leave:AnnualLeave){
    this._notify.openDialog(
      'Delete Request ?!',
      `Are you sure you want to delete this request?!`,
      false,
      "",
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deleteAnnualLeave(leave.key || '').subscribe(res=>{
           
            if(res['status'] == ResStatus.CRUD){
              this.getMyrequests();
              this.getMyBalance();
            }else if(res['status'] == ResStatus.ValidationError){
              this._notify.openSnackbar(`${res['data']['message']}` , SnackBarState.Warning)
            }else{
             
              this._notify.openSnackbar(`Error , Please Contact System Adminstrator` , SnackBarState.Error)
            }
          },err=>{
            console.log(err);
            this._notify.openSnackbar(`Error , Please Contact System Adminstrator` , SnackBarState.Error)
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }
    
}
