import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { AnnualLeave,leaveFinalStatus, LeaveType, PermissionAndLeavesConfig } from 'src/app/interfaces/annualLeave';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationService } from 'src/app/services/notification.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Days } from 'src/app/components/dev/components/time-sheet/time-sheet.component';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { ResStatus } from 'src/app/interfaces/res-status';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pending-vacation-requests',
  templateUrl: './pending-vacation-requests.component.html',
  styleUrls: ['./pending-vacation-requests.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('openClose', [
      state('void', style({ height: 0, opacity: 0 })),
      transition('void <=> *', [
        animate('300ms ease-in-out')
      ])
    ])
  ],
})
export class PendingVacationRequestsComponent implements OnInit {
  leaveTypeEnum = LeaveType;

  currenUser:User;
  leavesToApprove:AnnualLeave[]= [];
  admins:User[] = [];
  closeResult: string;
  leaveToReview:AnnualLeave | undefined;
  dissision:boolean;

  userLeaveBalance:number;
  userAnnualLeaveBalance:number;

  userPermissionBalance:number;
  userAnnualPermissionBalance:number;

  empData:User;
  math = Math;
  isResetPanelOpened:boolean;

  newPerBalance:number = 0;
  bereavement:number = 0;
  marriage:number = 0;
  birth:number = 0;
  birth_f:number = 0;

  DepartmentEnum = Department;
  accPosistionEnum = AccountPositions;
  leaveStatusEnum = leaveFinalStatus;

  newServerApi = environment.newServerApi;


  constructor(private modalService: NgbModal,
              private _notify:NotificationService,
              private _message:MessagingService,
              private _db:DatabaseService,
              private _auth:AuthApiService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(
      (user)=>{
        this.currenUser = user;
        this.getMyRequests();
        if(this.currenUser.department == Department.MANAGEMENT || (this.currenUser.department == Department.TECHNICAL_TEAM && this.currenUser.accPosition == AccountPositions.MANAGER)){
          this._auth.getUserByFilter(Department.ADMINSTRATION , AccountRoles.HUMAN_RESOURCE).subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.admins = res['data']
            }
          })
        }
      }
    )

    // const allUsers:Subscription = this.auth.getAllUsers().subscribe(users=>{
    //   allUsers.unsubscribe()
    //   const newusers = users.filter(u=>u.accType == AccountType.BUSINESS_ANALYSIS || u.accType == AccountType.DEVLOPER)
    //   console.log(newusers);
    //   newusers.map(user=>{
    //     const newLeave:AnnualLeave = {
    //       empKey:user.key||'',
    //       empName:user.username,
    //       empImgUrl:user.photoURL || '',
    //       from:'5/5/2022',
    //       to:'5/5/2022',
    //       leaveType:LeaveType.AnnualLeave,
    //       reason:'Eid El Fitr',
    //       approvalCycle:annualLeaveApprovalCycle.Finished,
    //       managerDissision:true,
    //       managerDissisionKey:'jjuyajnYK6clqnD7PIMEuQesyiy2',
    //       managerDissisionName:'FGS',
    //       managerDissisionAt:new Date().toLocaleString(),
    //       hrDissision:true,
    //       hrDissisionKey:this.currenUser.key,
    //       hrDissisionName:this.currenUser.username,
    //       hrDissisionAt:new Date().toLocaleString(),
    //       finalStatus:finalStatus.Approved,
    //       createdAt:`${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}, ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    //     }
    //     this.db.annualLeaveFinishCycle(newLeave)
        
    //   })

    // })
  }


  getMyRequests(){
    if(this.currenUser.department == Department.MANAGEMENT){
      this._db.getManagerPendingAnnualLeavesToApprove().subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          this.leavesToApprove = res['data'];
        }else{
          this.leavesToApprove = [];
        }
      },err=>{
        this.leavesToApprove = [];
        console.log(err);
      })
    }else if(this.currenUser.department == Department.TECHNICAL_TEAM && this.currenUser.accPosition == AccountPositions.MANAGER){
      this._db.getManagerPendingAnnualLeavesToApprove().subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          this.leavesToApprove = res['data'];
        }else{
          this.leavesToApprove = [];
        }
      },err=>{
        this.leavesToApprove = [];
        console.log(err);
      })
    }else{
      this._db.getHRPendingAnnualLeavesToApprove().subscribe(res=>{
        if(res['status']==ResStatus.CRUD){
          this.leavesToApprove = res['data'];
        }else{
          this.leavesToApprove = [];
        }
      },err=>{
        this.leavesToApprove = [];
        console.log(err);
      })
    }
  }


  // managerApprove(leave:AnnualLeave){
  //   leave.managerDissision = true;
  //   leave.managerDissisionKey = this.currenUser.key;
  //   leave.managerDissisionName = this.currenUser.username;
  //   leave.managerDissisionAt = new Date().toLocaleString();

  //   leave.hrToApproveName = this.admins.find(admin=> admin.key == leave.hrToApproveKey)?.username;
    
  //   leave.approvalCycle = annualLeaveApprovalCycle.PendingOnHR;
    
  //   this.db.annualLeaveUpdate(leave).then(()=>{
  //       const noti:Notifying ={
  //         receverKey: leave.hrToApproveKey || '',
  //         receverName:leave.hrToApproveName || '',
  //         senderKey: leave.managerDissisionKey || '',
  //         senderName:leave.managerDissisionName || '',
  //         title:'Vacation Request',
  //         body : `${leave.managerDissisionName} Has Approved Vacation Request From ${leave.empName} And Assigned To You`,
  //         redirection:`/admin-panel/pendingvacations`,
  //         senderImg : leave.empImgUrl || ""
  //       }
  //       this._message.createnotification(noti).then(()=>{
  //         this._notify.openSnackbar(`success` , SnackBarState.Success)
  //       })
  //     }
  //   )
  // }
  

  // managerReject(leave:AnnualLeave){
  //   leave.managerDissision = false;
  //   leave.managerDissisionKey = this.currenUser.key;
  //   leave.managerDissisionName = this.currenUser.username;
  //   leave.managerDissisionAt = new Date().toLocaleString();
  //   // leave.managerDissisionComment = '' ;
  //   leave.finalStatus = leaveFinalStatus.rejected;
    
  //   this.db.annualLeaveFinishCycle(leave).then(()=>{
  //       this._notify.openSnackbar(`success` , SnackBarState.Success)
  //     }
  //   )
  // }

  managerDissition(lastDissition:AnnualLeave){
    if(this.dissision == false){
      lastDissition.finalStatus = leaveFinalStatus.rejected;
    }else if(this.dissision == true){
      lastDissition.finalStatus = leaveFinalStatus.PendingOnHR;
    }

    // if(!lastDissition.managerDissisionComment){
    //   lastDissition.managerDissisionComment = '';
    // }

    this._db.managerActionAnnualLeave(lastDissition).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.getMyRequests();
      }else{
       
      }
    },err=>{
     
      if(err['status'] == ResStatus.ValidationError){
        this._notify.openSnackbar(`${err['error']['data']['message']}` , SnackBarState.Error)
      }else{
        this._notify.openSnackbar(`Error , Please Contact System Administrator` , SnackBarState.Error)
      }
    })
  }

  // managerDissitionOLD(lastDissition:AnnualLeave){
  //   if(this.dissision == false){
  //     this.managerReject(lastDissition)
  //   }else if(this.dissision == true){
  //     this.managerApprove(lastDissition)
  //   }
  // }


  // getUserLeavesBalance(){
    // const userSubscription:Subscription = this.auth.getUserByKey(this.leaveToReview?.empKey || '').subscribe(
    //   (user)=>{
    //     userSubscription.unsubscribe();
    //     this.empData = user ;
    //     this.userLeaveBalance = user.currentLeaveBalance?user.currentLeaveBalance : 0; 
    //     this.userAnnualLeaveBalance = user.annualLeaveBalance?user.annualLeaveBalance : 0; 

    //     this.userPermissionBalance = user.currentPermissionBalance?user.currentPermissionBalance : 0; 
    //     this.userAnnualPermissionBalance = user.annualPermissionBalance?user.annualPermissionBalance : 0; 
    //   }
    // )
  // }

  calculateLeaveDuration(leave?:AnnualLeave){
    if(!!leave){
      let duration = 0;
      let from = new Date(leave.from)
      let to = new Date(leave.to)

      while( from <= to){
        if(from.getDay() != Days.Friday && from.getDay() != Days.Saturday){
          duration++;
        }
        from = new Date(from.setDate(from.getDate() + 1) ) 
      }
      return duration;
    }else if(!!this.leaveToReview){
      let duration = 0;
      let from = new Date(this.leaveToReview.from)
      let to = new Date(this.leaveToReview.to)

      while( from <= to){
        if(from.getDay() != Days.Friday && from.getDay() != Days.Saturday){
          duration++;
        }
        from = new Date(from.setDate(from.getDate() + 1) ) 
      }
      return duration;
    }else{
      return 0;
    }
  }

  calculatePermissionDuration(){
    if(!!this.leaveToReview){
      let duration = 0;
      let from = (new Date(this.leaveToReview.from).getHours() * 60) + new Date(this.leaveToReview.from).getMinutes();
      let to = (new Date(this.leaveToReview.to).getHours() * 60) + new Date(this.leaveToReview.to).getMinutes();    
      duration = to - from;
      return duration;
    }else{
      return 0;
    }
    
  }

  hrAction(leave:AnnualLeave , isApproved:boolean){
    if(isApproved == false){
      leave.finalStatus = leaveFinalStatus.rejected;
    }else if(isApproved == true){
      leave.finalStatus = leaveFinalStatus.Approved;
    }

    this._db.hrActionAnnualLeave(leave).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.getMyRequests();
      }else{
      }
    },err=>{
      
      if(err['status'] == ResStatus.ValidationError){
        this._notify.openSnackbar(`${err['error']['data']['message']}` , SnackBarState.Error)
      }else{
        this._notify.openSnackbar(`Error , Please Contact System Administrator` , SnackBarState.Error)
      }
    })
  }

  // hrApprove(leave:AnnualLeave){
  //   leave.hrDissision = true;
  //   leave.hrDissisionAt = new Date().toLocaleString();
  //   leave.hrDissisionKey = this.currenUser.key;
  //   leave.hrDissisionName = this.currenUser.username;

  //   leave.approvalCycle = annualLeaveApprovalCycle.Finished;
  //   leave.finalStatus = leaveFinalStatus.Approved;

  //   this.db.annualLeaveFinishCycle(leave).then(()=>{
  //     const getUserSub:Subscription = this.auth.getUserByKey(leave.empKey).subscribe(user=>{
  //       getUserSub.unsubscribe()
  //       console.log("User Balance => ",user.currentLeaveBalance);
  //       console.log("current Duration => ",this.calculateLeaveDuration(leave));
  //       if(!!user.currentLeaveBalance){
  //         user.currentLeaveBalance = user.currentLeaveBalance - this.calculateLeaveDuration(leave)
  //       }else{
  //         user.currentLeaveBalance = 0 - this.calculateLeaveDuration(leave)
  //       }
        
  //       console.log("User Balance After Calc => ",user.currentLeaveBalance);

  //       this.auth.editUser(user)
  //     })
  //     if(!!this.empData){
  //       if(this.empData.department === Department.TECHNICAL_TEAM){
  //         this.createDevDailytask(leave)
  //       }

        
  //     }
  //   })
  // }




  // createDevDailytask(leave:AnnualLeave){
  //   const dateArr:Date[] = [];    

  //   let start = new Date(leave.from)    
  //   let end = new Date(leave.to)

  //   while(start <= end){
  //     if(start.getDay() != Days.Friday && start.getDay() != Days.Saturday){
  //       dateArr.push(new Date(start))
  //     }
  //     start = new Date(start.setDate(start.getDate() + 1) ) 
  //   }

    
  //   for(let i in dateArr){

  //     const devDailyReport:DevDailyReport = {
  //       devID : leave.empKey,
  //       devName : leave.empName,
  //       durationByHours : leave.leaveType == LeaveType.PERMISSION ? this.calculatePermissionDuration() / 60 : 8,
  //       reportDate :`${dateArr[i].getMonth()+1}/${dateArr[i].getDate()}/${dateArr[i].getFullYear()}`,
  //       time_activity: leave.leaveType == LeaveType.UNPAID ? Activity.UNPAID_VACATION : Activity.OFFICIAL_VACATION ,
  //       approved : true,
  //       approvedByKey : leave.managerDissisionName ,
  //       approvedByName : leave.managerDissisionName ,
  //       details : leave.reason,
  //       createdAt : leave.hrDissisionAt,
  //       preApprovedDuration:0
  //     }      
  //     this.db.moveToDevDailyReport(devDailyReport)
  //   }
  // }

  // hrRejection(leave:AnnualLeave){
  //   leave.hrDissision = false;
  //   leave.hrDissisionAt = new Date().toLocaleString();
  //   leave.hrDissisionKey = this.currenUser.key;
  //   leave.hrDissisionName = this.currenUser.username;

  //   leave.approvalCycle = annualLeaveApprovalCycle.Finished;
  //   leave.finalStatus = leaveFinalStatus.rejected;

  //   this.db.annualLeaveFinishCycle(leave)
  // }



  open(content , annualLeave:AnnualLeave , approve:boolean) {
    this.leaveToReview = annualLeave;
    this.dissision = approve;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  openForAdmin(content , annualLeave:AnnualLeave) {
    this._db.getUserLeaveBalance(annualLeave.empKey).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.userLeaveBalance = res['data']['currentLeaveBalance'];
        this.userAnnualLeaveBalance = res['data']['annualLeaveBalance'] ;
        this.userPermissionBalance = res['data']['currentPermissionBalance'];
        this.userAnnualPermissionBalance = res['data']['annualPermissionBalance'];
      }else{
        this.userLeaveBalance = 0;
        this.userAnnualLeaveBalance = 0;
        this.userPermissionBalance = 0;
        this.userAnnualPermissionBalance = 0;
      }
    },err=>{
      this.userLeaveBalance = 0;
      this.userAnnualLeaveBalance = 0;
      this.userPermissionBalance = 0;
      this.userAnnualPermissionBalance = 0;
    })
    this.leaveToReview = annualLeave;
    // this.getUserLeavesBalance()
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    this.leaveToReview = undefined;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  openResetPermissionPanel(){
    if(!this.isResetPanelOpened){
      this._db.getPermissionAndLeavesConfig().subscribe(res=>{                
        if(res['status']==ResStatus.CRUD){
          this.newPerBalance = res['data']['monthly_balance'];
          this.bereavement = res['data']['bereavement'];
          this.marriage = res['data']['marriage'];
          this.birth = res['data']['birth'];
          this.birth_f = res['data']['birth_f'];
        }
      })
    }else{
      this.newPerBalance = 0;
      this.bereavement = 0;
      this.marriage = 0;
        
    }
    this.isResetPanelOpened = !this.isResetPanelOpened
  }


  resetUserspermissons(){
    const newPer:PermissionAndLeavesConfig = {
      permission_balance_id:'1',
      monthly_balance:this.newPerBalance,
      bereavement:this.bereavement,
      marriage:this.marriage,
      birth:this.birth,
      birth_f:this.birth_f
    }

    this._db.resetUserspermissons(newPer).subscribe(res=>{      
      if(res['status']==ResStatus.CRUD){
        this._notify.openSnackbar('Monthly Permission Updated Successfully' , SnackBarState.Success , 3000)
        this.newPerBalance = 0;
        this.bereavement = 0;
        this.marriage = 0;
        this.birth = 0;
        this.birth_f = 0;
        this.openResetPermissionPanel();
      }else{
        this._notify.openSnackbar('Error' , SnackBarState.Error , 3000)
      }
    },err=>{
      this._notify.openSnackbar('Error' , SnackBarState.Error , 3000)
    })
    // const usersSubscription:Subscription = this.auth.getAllUsers().subscribe(
    //   (users)=>{
    //     usersSubscription.unsubscribe();
    //     for (let i in users){
    //       if(users[i].department != Department.MANAGEMENT){
    //         users[i].annualPermissionBalance = this.newPerBalance;
    //         this.auth.editUser(users[i]);
    //       }
    //     }
    //     this._notify.openSnackbar('Monthly Permission Updated Successfully' , SnackBarState.Success , 3000)
    //     this.newPerBalance = 0;
    //     this.openResetPermissionPanel();
    //   }
    // )
  }
}
