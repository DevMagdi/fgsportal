import { Component, OnInit } from '@angular/core';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Notifying } from 'src/app/interfaces/notification';
import { PublicRequests, publicRequestsApprovalCycle, publicRequestsDepartment, publicRequestsFinalStatus } from 'src/app/interfaces/public-requests';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountRoles, AccountType, Department, User } from 'src/app/interfaces/user';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-public-requests-approval',
  templateUrl: './public-requests-approval.component.html',
  styleUrls: ['./public-requests-approval.component.scss']
})
export class PublicRequestsApprovalComponent implements OnInit {
  myRequests:PublicRequests[] = [];
  publicRequestsDepartmentEnum = publicRequestsDepartment;
  // publicRequestsTypesEnum = publicRequestsTypes;
  publicRequestsFinalStatusEnum = publicRequestsFinalStatus;
  currentUser:User;
  reqToApprove:PublicRequests;
  reqToReview:PublicRequests;
  displayModal:boolean = false;
  approvedModal:boolean = false;
  admins:User[] = [];
  approvedRequests:PublicRequests[] = [];
  DepartmentEnum = Department;
  myPerms:UserPermissions[] = [];
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;      
      if(this.currentUser.department == Department.MANAGEMENT){
        this.getMyRequests();
        this.getAllUnDoneRequests();
        this._auth.getUserByFilter(Department.ADMINSTRATION).subscribe(admins=>{
          if(admins['status'] == ResStatus.CRUD){
            this.admins = admins['data'];
          }
          this._auth.getUserByPermissionID('11').subscribe(res=>{
            console.log(res);
            
            if(res['status'] == ResStatus.CRUD){
              const usersss = res['data'];
              usersss.map(u=>this.admins.push(u))
            }
          })

        })
      }else { // if(this.currentUser.department == Department.ADMINSTRATION){
        this.getAdminPendingPublicRequest();
        this.checkIfHasPermission();
      }
    })
  }


  checkIfHasPermission(){
    this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.myPerms = res['data']
      }
    })
  }

  checkIfHasPerm(){    
    const checking = this.myPerms.find(p=>p.permission_id == '11')
    if(!!checking){
      return true;
    }else{
      return false;
    }
  }



  getMyRequests(){
    this._db.getManagerToApprovePublicRequest().subscribe(reqs=>{
      console.log(reqs);
      if(reqs['status'] == ResStatus.CRUD){
        this.myRequests = reqs['data'];
      }
    })
  }

  getAdminPendingPublicRequest(){
    this._db.getAdminPendingPublicRequest().subscribe(reqs=>{
      if(reqs['status'] == ResStatus.CRUD){
        this.myRequests = reqs['data'];
      }
    })
  }

  getAllUnDoneRequests(){
    this._db.getAllUnDoneApprovedPublicRequest().subscribe(reqs=>{
      console.log(reqs);
      if(reqs['status'] == ResStatus.CRUD){
        this.approvedRequests = reqs['data'];
      }
    })
  }
  managerApproverequest(managerDissision:boolean){
    this.reqToApprove.managerDissision = managerDissision;
    this.reqToApprove.managerDissisionAt = new Date().toLocaleString();
    this.reqToApprove.managerDissisionKey = this.currentUser.key;
    this.reqToApprove.managerDissisionName = this.currentUser.username;
    if(managerDissision == true){
      if(!!this.reqToApprove.empToApplyKey){
        const empToApplyName = this.admins.find(admin=>admin.key == this.reqToApprove.empToApplyKey)?.username;
        this.reqToApprove.empToApplyName = empToApplyName;
        this.reqToApprove.finalStatus = publicRequestsFinalStatus.Approved;
        this._db.publicRequestManagerFinished(this.reqToApprove).subscribe(res=>{
          if(res['status'] == ResStatus.CRUD){
            this.displayModal = false;
            const i = this.myRequests.findIndex(pr => pr.key == this.reqToApprove.key)
            this.myRequests.splice(i,1)
            this.getAllUnDoneRequests();
          }else{
            this._notify.openSnackbar('Error , Please Contact System Adminstrator' , SnackBarState.Error)
            this._db.createSystemLogs(
              `${this.currentUser.username} Has Error ${JSON.stringify(res['data'])} while approving public request '${this.reqToApprove.key} - ${this.reqToApprove.type} - ${this.reqToApprove.empName}'`,
              `${this.currentUser.key} Has Error while approving public request '${this.reqToApprove.key}`,
              this.currentUser.key || '',
              this.currentUser.username,
              'Faild'
            ).subscribe()
          }
        },err=>{
          console.log(err);
          this._notify.openSnackbar('Error , Please Contact System Adminstrator' , SnackBarState.Error)    
          this._db.createSystemLogs(
            `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while approving public request '${this.reqToApprove.key} - ${this.reqToApprove.type} - ${this.reqToApprove.empName}'`,
            `${this.currentUser.key} Has Error while approving public request '${this.reqToApprove.key}`,
            this.currentUser.key || '',
            this.currentUser.username,
            'Faild'
          ).subscribe()      
        })
      }else{
        this._notify.openSnackbar('Invalid' , SnackBarState.Error)
        this._db.createSystemLogs(
          `${this.currentUser.username} approval stopped from validation ${JSON.stringify(this.reqToApprove)}`,
          `${this.currentUser.key} approval stopped from validation ${this.reqToApprove.key}`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Faild'
        ).subscribe()      
      }
    }else{
      if(!!this.reqToApprove.managerDissisionComment){
        this.reqToApprove.finalStatus = publicRequestsFinalStatus.Rejected;
        this._db.publicRequestManagerReject(this.reqToApprove).subscribe(res=>{
          if(res['status'] == ResStatus.CRUD){
            this.displayModal = false;
            const i = this.myRequests.findIndex(pr => pr.key == this.reqToApprove.key)
            this.myRequests.splice(i,1)
            this.getAllUnDoneRequests();
          }else{
            this._notify.openSnackbar('Error , Please Contact System Adminstrator' , SnackBarState.Error)
            this._db.createSystemLogs(
              `${this.currentUser.username} Has Error ${JSON.stringify(res['data'])} while approving public request '${this.reqToApprove.key} - ${this.reqToApprove.type} - ${this.reqToApprove.empName}'`,
              `${this.currentUser.key} Has Error while Rejecting public request '${this.reqToApprove.key}`,
              this.currentUser.key || '',
              this.currentUser.username,
              'Faild'
            ).subscribe()
          }
        },err=>{
          console.log(err);
          this._notify.openSnackbar('Error , Please Contact System Adminstrator' , SnackBarState.Error)          
          this._db.createSystemLogs(
            `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while approving public request '${this.reqToApprove.key} - ${this.reqToApprove.type} - ${this.reqToApprove.empName}'`,
            `${this.currentUser.key} Has Error while Rejecting public request '${this.reqToApprove.key}`,
            this.currentUser.key || '',
            this.currentUser.username,
            'Faild'
          ).subscribe()  
        })
      }else{
        this._notify.openSnackbar('Invalid' , SnackBarState.Error)
        this._db.createSystemLogs(
          `${this.currentUser.username} Rejection stopped from validation ${JSON.stringify(this.reqToApprove)}`,
          `${this.currentUser.key} Rejection stopped from validation ${this.reqToApprove.key}`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Faild'
        ).subscribe()  
      }
      
    }
  }

  pay(){
    this.reqToApprove.empAppliedAt = new Date().toLocaleString();
    this.reqToApprove.finalStatus = publicRequestsFinalStatus.Done;

    this._db.publicRequestMarkAsDone(this.reqToApprove).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.displayModal = false;
        const i = this.myRequests.findIndex(pr => pr.key == this.reqToApprove.key)
        this.myRequests.splice(i,1)
      }
    })
    // this.db.updateApprovedPublicReq(this.reqToApprove).then(()=>{
      // const noti:Notifying ={
      //   receverKey:this.reqToApprove.empKey,
      //   receverName:this.reqToApprove.empName,
      //   senderKey:this.currentUser.key || '',
      //   senderName:this.currentUser.username,
      //   title:'Public Request Finished',
      //   body :`${this.currentUser.username} Finished Public Request`,
      //   redirection:'/dev/requests',
      //   senderImg : this.currentUser.photoURL || ''
      // } 
      // this._message.createnotification(noti);
    // })
  }


  openModalToReview(req:PublicRequests){
    this.reqToApprove = req;
    this.displayModal = true;    
  }

  openApprvedModal(req:PublicRequests){
    this.reqToReview = req;
    this.approvedModal = true;
  }
}
