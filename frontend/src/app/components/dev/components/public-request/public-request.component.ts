import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Project } from 'src/app/interfaces/project';
import { PublicRequests, publicRequestsDepartment, publicRequestsFinalStatus, publicRequestsApprovalCycle } from 'src/app/interfaces/public-requests';
import { ResStatus } from 'src/app/interfaces/res-status';
import { SUB_TASk } from 'src/app/interfaces/task';
import {Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-public-request',
  templateUrl: './public-request.component.html',
  styleUrls: ['./public-request.component.scss']
})
export class PublicRequestComponent implements OnInit {
  myRequests:PublicRequests[] = [];
  myApprovedRequests:PublicRequests[] = [];
  currentUser:User;
  displayModal:boolean = false;
  newReqForm:FormGroup;
  managers:User[] = [];
  myProjects:Project[] = [];
  myProcesses:SUB_TASk[] = [];
  publicRequestsDepartmentEnum = publicRequestsDepartment;
  // publicRequestsTypesEnum = publicRequestsTypes;
  publicRequestsFinalStatusEnum = publicRequestsFinalStatus;
  departmentEnum = Department;
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this.newReqForm = new FormGroup({
      'dept' : new FormControl(null , Validators.required),
      'type' : new FormControl(null , Validators.required),
      'details' : new FormControl(null , Validators.required),
      'amount' : new FormControl(null , Validators.required),
      'projectKey' : new FormControl(null),
      'processKey' : new FormControl(null),
      'managerToApproveKey' : new FormControl(null , Validators.required)
    })


    

    this._auth.user.subscribe(user=>{
      this.currentUser = user ;
      this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(mans=>{      
        if(mans['status'] == ResStatus.CRUD){
          this.managers = mans['data']
        }
      })
      this._db.getDevProjects(this.currentUser.key || '').subscribe(projects=>{
        if(projects['status'] == ResStatus.CRUD){
          this.myProjects = projects['data'];
        }
      })

      // this._auth.getMymanagers().subscribe(managers=>{
      //   this.managers = managers;
      // })

      // this.db.getDevProjects(this.currentUser.key || '' , this.currentUser.username).subscribe(projects=>{
      //   this.myProjects = projects;
      // })
      this.getMyrequestes();
    })
  }


  openForm(){
    this.displayModal = true;
  }


  createNewReq(){
    const managerKey = this.newReqForm.get(['managerToApproveKey'])?.value
    const managerName = this.managers.find(manager => manager.key == managerKey)?.username

    const projectKey = this.newReqForm.get(['projectKey'])?.value;
    let projectName;
    if(!!projectKey){
      projectName = this.myProjects.find(project => project.key == projectKey)?.title
    }



    const processKey = this.newReqForm.get(['processKey'])?.value;
    let processName;
    if(!!processKey){
      processName = this.myProcesses.find(process => process.key == processKey)?.title
    }

    const newReq:PublicRequests = {
      dept : this.newReqForm.get(['dept'])?.value,
      type : this.newReqForm.get(['type'])?.value,
      empKey : this.currentUser.key || '',
      empName : this.currentUser.username,
      empImgUrl:this.currentUser.photoURL ? this.currentUser.photoURL : '',
      amountByEGP : this.newReqForm.get(['amount'])?.value,
      details : this.newReqForm.get(['details'])?.value,
      managerToApproveKey : managerKey,
      managerToApproveName : managerName,
      approvalCycle : publicRequestsApprovalCycle.PendingOnManager,
      finalStatus : publicRequestsFinalStatus.Pending,
    }

    if(!!projectKey){    
      newReq.projectKey = projectKey;
      newReq.projectName = projectName;
    }

    if(!!processKey){
      newReq.processKey = processKey;
      newReq.processName = processName;
    }
    if(this.currentUser.department == Department.Business_Development){
      newReq.processKey = environment.staticFGSProjectKey;
      newReq.processName = environment.staticFGSProcessKey;
    }
        
    this._db.createPublicRequest(newReq).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.getMyrequestes();
        this.newReqForm.reset();
        this._notify.openSnackbar(`Request Created Successfully` , SnackBarState.Success)
      }else{
        this._notify.openSnackbar(`Something wrong, please contact Administrator` , SnackBarState.Error)
      }
    },err=>{
      console.log(err);
      this._notify.openSnackbar(`Something wrong, please contact Administrator` , SnackBarState.Error)
    })
    
    // .then(()=>{
    //   this.newReqForm.reset();
    //   this._notify.openSnackbar(`Request Created Successfully` , SnackBarState.Success)
    // })
    
  }

  getProcesses(){
    this._db.getProjectProcess(this.newReqForm.get(['projectKey'])?.value).subscribe(process=>{
      if(process['status'] == ResStatus.CRUD){
        this.myProcesses = process['data'];
      }
    })
  }


  getMyrequestes(){
    this.myRequests = [];
    this._db.getMyPublicRequests().subscribe((reqs)=>{
      if(reqs['status'] == ResStatus.CRUD){        
        this.myRequests = reqs['data'].reverse();
      }
    })

    // this._db.getMyApprovedPublicRequest(this.currentUser.key || '').subscribe(appreqs=>{
    //   if(appreqs['status'] == ResStatus.CRUD){
    //     this.myApprovedRequests= appreqs['data'].reverse();
    //   }
    // })


    
    // this.db.getMyPublicRequests(this.currentUser.key || '').subscribe((reqs)=>{
    //   this.myRequests = reqs.reverse();
    // })

    // this.db.getMyApprovedPublicRequest(this.currentUser.key || '').subscribe(appreqs=>{
    //   this.myApprovedRequests= appreqs.reverse();
    // })
  }


  deleteRequest(PR){
    this._notify.openDialog(
      'Delete Request?',
      `Are you sure you want to delete This Request?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deletePublicRequest(PR.key).subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.getMyrequestes()
              this._notify.openSnackbar(`Request Deleted Successfully` , SnackBarState.Success)
            }
          })          
          // this.db.deletePublicRequest(PR).then(()=>{
          //   this._notify.openSnackbar(`Request Deleted Successfully` , SnackBarState.Success)
          // })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

}
