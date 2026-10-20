import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Incentive,incentiveFinalStatus } from 'src/app/interfaces/Incentive';
import { Project } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { SUB_TASk } from 'src/app/interfaces/task';
import { AccountPositions,  Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FinanceService } from 'src/app/services/finance.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-incentive-requests',
  templateUrl: './incentive-requests.component.html',
  styleUrls: ['./incentive-requests.component.scss']
})
export class IncentiveRequestsComponent implements OnInit {
  closeResult: string;
  createNewIncentiveForm:FormGroup;
  
  currentUser:User;
  myProjects:Project[] = [];
  myProcess:SUB_TASk[] = [];
  
  emps:any = [];

  managers:User[] = [];
  admins:User[] = [];

  pendingIncentive:Incentive[] = [];
  managerPendingIncentive:Incentive[] = [];

  openForReview:boolean = false;
  incentiveForReview:Incentive;

  incentiveEmptyTemp:Incentive;
  accPosistionEnum = AccountPositions;
  DepartmentEnum = Department;
  incentiveOnEditMode:boolean = false;
  incentiveToEdit:Incentive | null;
  incentiveFinalStatusEnum = incentiveFinalStatus;
  openForAdd=false;
  constructor(private _db:DatabaseService,
              private _auth:AuthApiService,
              private _finance:FinanceService,
              private modalService: NgbModal,
              private _notify: NotificationService) { }

  ngOnInit(): void {
    this.incentiveEmptyTemp = {
      key : "" , 
      empKey : "" , 
      empName: "" ,
      incentiveAmount: 0 ,
      projectKey: "" ,
      projectName: "" ,
      processKey: "" ,
      processName: "" ,
      date: "" ,
      createdByKey: "" ,
      createdByName: "" 
    }

    this.createNewIncentiveForm = new FormGroup({
      'projectKey' : new FormControl(null , Validators.required),
      'projectName' : new FormControl(null),
      'processKey' : new FormControl(null , Validators.required),
      'empKey' : new FormControl(null , Validators.required),
      'empName' : new FormControl(null),
      'incentiveAmount' : new FormControl(null , Validators.required),
      'date' : new FormControl(null , Validators.required),
      'comment' : new FormControl(null),
      'managerToApproveKey' : new FormControl(null),
      'managerToApproveName' : new FormControl(null),
      'financeToApproveKey' : new FormControl(null),
      'financeToApproveName' : new FormControl(null),
    })



    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      this.getMyRequests();
    })


    // this.auth.user.subscribe(user=>{
    //   this.currentUser = user;
    //   if(user.accPosition == AccountPositions.MANAGER){
    //     this.db.getPMProjects(user.key).subscribe(projects=>{
    //       this.myProjects = projects;
    //     })
    //     this.auth.getMymanagers().subscribe(managers=>{
    //       this.managers = managers;
    //     })

    //     this._salary.getMyIntensiveRequests(user.key).subscribe(inces=>{
    //       this.pendingIncentive = inces
    //     })

    //   }else if(user.department == Department.MANAGEMENT){
    //     this.db.getAllProjects().subscribe(projects=>{
    //       this.myProjects = projects;          
    //     })

    //     this.auth.getAdmins().subscribe(admins=>{
    //       this.admins = admins;
    //     })


    //     if(user.key  == 'jjuyajnYK6clqnD7PIMEuQesyiy2' || user.key  == 'eC325vPgT2SsY2QaAYhrCMFoUBH3'){
    //       this._salary.getIncentiveToApproveForSuperUser().subscribe(inces=>{
    //         this.pendingIncentive = inces.filter(inces=>inces.approvalCycle == incentiveApprovalCycle.PendingOnManager);
    //       })
    //     }else{
    //       this._salary.getIncentiveToApprove(user.key , Department.MANAGEMENT).subscribe(inces=>{
    //         this.pendingIncentive = inces.filter(inces=>inces.approvalCycle == incentiveApprovalCycle.PendingOnManager);
    //       })
    //     }

        

    //     this._salary.getAllPendingIntensive().subscribe(inces=>{
    //      this.managerPendingIncentive  = inces.filter(inces=>inces.approvalCycle != incentiveApprovalCycle.PendingOnManager); ;
    //     })
        


    //   }else if (user.department == Department.ADMINSTRATION){
    //     this._salary.getIncentiveToApprove(user.key , Department.ADMINSTRATION).subscribe(inces=>{
    //       this.pendingIncentive = inces.filter(inces=>inces.approvalCycle == incentiveApprovalCycle.PendingOnFinance);
    //     })
    //   }

    // })
  }


  getMyRequests(){
    if(this.currentUser.department == Department.MANAGEMENT){
      this._finance.getMyIntensiveRequestsToApprove().subscribe(inces=>{
        console.log(inces);
        
        if(inces['status'] == ResStatus.CRUD){
          this.pendingIncentive = inces['data']
        }
      })

      this._finance.getMyPendingIntensiveRequests().subscribe(inces=>{
        console.log(inces);

        if(inces['status'] == ResStatus.CRUD){
          this.managerPendingIncentive = inces['data']
        }
      })

    }else if(this.currentUser.department == Department.TECHNICAL_TEAM && this.currentUser.accPosition == AccountPositions.MANAGER){
      this._finance.getMyPendingIntensiveRequests().subscribe(inces=>{
        console.log(inces);

        if(inces['status'] == ResStatus.CRUD){
          this.pendingIncentive = inces['data']
        }
      })

    }   

  }


  openCreateModal(){
    if(this.currentUser.department == Department.MANAGEMENT){
      this._db.getAllProjects().subscribe(projects=>{        
        if(projects['status'] == ResStatus.CRUD){
          this.myProjects = projects['data'];
        }
      })
    }else if(this.currentUser.department == Department.TECHNICAL_TEAM && this.currentUser.accPosition == AccountPositions.MANAGER){
      this._db.getPMMyProjects(this.currentUser.key || '').subscribe(projects=>{
        if(projects['status'] == ResStatus.CRUD){
          this.myProjects = projects['data'];
        }
      })
      this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(managers=>{
        if(managers['status'] == ResStatus.CRUD){
          this.managers = managers['data'];
        }
      })

      
    }
  }

  getProjectTeam(){
    const projectKey = this.createNewIncentiveForm.get(['projectKey'])?.value;
    this._db.getProjectTeam(projectKey).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        const data = res['data']
        this.emps = Array.from(data.reduce((m, t) => m.set(t.user_team_id, t), new Map()).values());
        this.emps = this.emps.sort((a,b)=>{
          return compare(a.user_team_name, b.user_team_name, true);
        })
      }
    })
    // interface Emps {
    //   key:string; 
    //   name:string; 
    // }

    // const myEmps:Emps[] = [];

    // const project =this.myProjects.find(project=>project.key == this.createNewIncentiveForm.get(['projectKey'])?.value)
    
    // if(!!project){

    //   this.createNewIncentiveForm.patchValue({
    //     'projectName' : project.title
    //   })

    //   for (let i in project.Devs_mempers){
    //     myEmps.push({key:i , name : project.Devs_mempers[i]})
    //   }
      
    //   for (let ba in project.BAsTeam){
    //     myEmps.push({key:ba , name : project.BAsTeam[ba]})
    //   }

    //   myEmps.push({key:project.PMID || '', name:project.PMName || ''})
    //   myEmps.push({key:project.Tech_leadID || '', name:project.Tech_leadName || ''})
    //   // myEmps.push({key:project.Tech_leadID || '', name:project.Tech_leadName || ''})
    // }
    
    // this.emps = myEmps;
  }



  getEmpName(){
    const empName = this.emps.find(emp=>emp.key == this.createNewIncentiveForm.get(['empKey'])?.value)
    if(!!empName){
      this.createNewIncentiveForm.patchValue({
        'empName':empName.name
      })
    }
  }

  getProcesses(){
    this.myProcess = [];
    const projectKey = this.createNewIncentiveForm.get(['projectKey'])?.value;
    this._db.getProjectProcess(projectKey).subscribe(processes=>{
      if(processes['status'] == ResStatus.CRUD){
        this.myProcess = processes['data'];
      }
    })
    // this.db.getProjectSubTasks(projectKey).subscribe(processes=>{
    //   this.myProcess = processes;
    // })
  }
  createNewIncentive(){
    const myDate = `${new Date(this.createNewIncentiveForm.get(['date'])?.value).getMonth() + 1 }/${new Date(this.createNewIncentiveForm.get(['date'])?.value).getDate()}/${new Date(this.createNewIncentiveForm.get(['date'])?.value).getFullYear()}`
    const projectName = this.myProcess.find(pro=>pro.key == this.createNewIncentiveForm.value['projectKey'])?.title;
    const processName = this.myProcess.find(pro=>pro.key == this.createNewIncentiveForm.value['processKey'])?.title;
    const empName = this.myProcess.find(pro=>pro.key == this.createNewIncentiveForm.value['empName'])?.title;

    const newIncentiveRequest:Incentive = {
      empKey: this.createNewIncentiveForm.get(['empKey'])?.value,
      empName: empName || '',
      incentiveAmount: this.createNewIncentiveForm.get(['incentiveAmount'])?.value, 
      projectKey: this.createNewIncentiveForm.get(['projectKey'])?.value,
      projectName: projectName || '',
      processKey: this.createNewIncentiveForm.get(['processKey'])?.value,
      processName: processName || '',
      date: myDate ,
      createdByKey:this.currentUser.key || '' ,
      createdByName:this.currentUser.username,
      comment:this.createNewIncentiveForm.get(['comment'])?.value,
    }

    if(this.currentUser.department == Department.TECHNICAL_TEAM && this.currentUser.accPosition == AccountPositions.MANAGER){
      newIncentiveRequest.managerToApproveKey = this.createNewIncentiveForm.get(['managerToApproveKey'])?.value;
      newIncentiveRequest.managerToApproveName = this.managers.find(man=>man.key == newIncentiveRequest.managerToApproveKey)?.username
      newIncentiveRequest.finalStatus = incentiveFinalStatus.Pending
      this._finance.createPendingIncentive(newIncentiveRequest).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this._notify.openSnackbar("Incentive Created" , SnackBarState.Success)
          this.getMyRequests();
          this.createNewIncentiveForm.reset()
        }
      })
    }else if(this.currentUser.department == Department.MANAGEMENT){
      newIncentiveRequest.finalStatus = incentiveFinalStatus.Approved
      this._finance.createPendingIncentive(newIncentiveRequest).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this._notify.openSnackbar("Incentive Created" , SnackBarState.Success)
          this.getMyRequests();
          this.createNewIncentiveForm.reset()
        }
      })
    }else{
      this._notify.openSnackbar("You Don't Have Permission To Add Incentive" , SnackBarState.Error , 5000)
    }    
  }
  // createNewIncentiveOld(){
  //   const myDate = `${new Date(this.createNewIncentiveForm.get(['date'])?.value).getMonth() + 1 }/${new Date(this.createNewIncentiveForm.get(['date'])?.value).getDate()}/${new Date(this.createNewIncentiveForm.get(['date'])?.value).getFullYear()}`
  //   const processName = this.myProcess.find(pro=>pro.key == this.createNewIncentiveForm.value['processKey'])?.title;
  //   const newIncentiveRequest:Incentive = {
  //     empKey: this.createNewIncentiveForm.get(['empKey'])?.value,
  //     empName: this.createNewIncentiveForm.get(['empName'])?.value,
  //     incentiveAmount: this.createNewIncentiveForm.get(['incentiveAmount'])?.value, 
  //     projectKey: this.createNewIncentiveForm.get(['projectKey'])?.value,
  //     projectName: this.createNewIncentiveForm.get(['projectName'])?.value,
  //     processKey: this.createNewIncentiveForm.get(['processKey'])?.value,
  //     processName: processName || '',
  //     date: myDate ,
  //     createdByKey:this.currentUser.key || '' ,
  //     createdByName:this.currentUser.username,
  //     comment:this.createNewIncentiveForm.get(['comment'])?.value,
  //   }

  //   if(this.currentUser.accPosition == AccountPositions.MANAGER){
  //     newIncentiveRequest.managerToApproveKey = this.createNewIncentiveForm.get(['managerToApproveKey'])?.value;
  //     newIncentiveRequest.managerToApproveName = this.managers.find(man=>man.key == newIncentiveRequest.managerToApproveKey)?.username
  //     this._salary.createPendingIncentive(newIncentiveRequest , true).then(()=>{
  //       this._notify.openSnackbar("Incentive Created" , SnackBarState.Success)
  //     })
  //   }else if(this.currentUser.department == Department.MANAGEMENT){
  //     newIncentiveRequest.financeToApproveKey = this.createNewIncentiveForm.get(['financeToApproveKey'])?.value;
  //     newIncentiveRequest.financeToApproveName = this.admins.find(admins=>admins.key == newIncentiveRequest.financeToApproveKey)?.username
  //     newIncentiveRequest.managerDissision = true;
  //     newIncentiveRequest.managerDissisionKey = this.currentUser.key;
  //     newIncentiveRequest.managerDissisionName = this.currentUser.username;
  //     newIncentiveRequest.managerDissisionAt = new Date().toLocaleString();

  //     this._salary.createPendingIncentive(newIncentiveRequest , false).then(()=>{
  //       const newSinglePC:singleProjectCost = {
  //         empKey: newIncentiveRequest.empKey,
  //         empName: newIncentiveRequest.empName,
  
  //         projectKey:newIncentiveRequest.projectKey ,
  //         projectTitle:newIncentiveRequest.projectName ,
  //         processKey:newIncentiveRequest.processKey ,
  //         processTitle:newIncentiveRequest.processName ,
  
  //         costType: TypeOfCost.INCENTIVE,
  //         costComment: 'Incentive' ,
          
  //         costDate: newIncentiveRequest.date ,
  //         createdAt: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}` ,
  //         createdByKey: newIncentiveRequest.managerDissisionKey || '',
  //         createdByName: newIncentiveRequest.managerDissisionName || '' ,
          
  //         costAmount: newIncentiveRequest.incentiveAmount,
  
  //         notes: `Incentive Approved By ${newIncentiveRequest.managerDissisionName} =>  ${newIncentiveRequest.date} To Dev ${newIncentiveRequest.empName}`
  //       }
  //       this._projectCost.createNewSingleCost(newSinglePC)
  //       this._notify.openSnackbar("Incentive Created" , SnackBarState.Success)
  //     })
  //   }else{
  //     this._notify.openSnackbar("You Don't Have Permission To Add Incentive" , SnackBarState.Error , 5000)
  //   }    
  // }

  open(content) {
    this.openForReview = false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDialogForReview(content , incentive:Incentive) {
    this.openForReview = true;
    this.incentiveForReview = incentive;

    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }
  
  validateIncentive(){
    if(this.incentiveOnEditMode == true){
      this.submitEditIncentive();
    }else{
      this.createNewIncentive()
    }
  }

  dismissEditIncentive(){
    this.incentiveOnEditMode = false;
    this.incentiveToEdit = null;
    this.createNewIncentiveForm.reset();
  }
  
  editIncentive(inc:Incentive){
    this.incentiveOnEditMode = true;
    this.incentiveToEdit = inc;
    this.createNewIncentiveForm.patchValue({
      'projectKey':inc.projectKey,
      'projectName':inc.projectName,
      'processKey':inc.processKey,
    })
    this.getProcesses()
    this.getProjectTeam()
    this.createNewIncentiveForm.patchValue({
      'empKey':inc.empKey,
      'empName':inc.empName,
      'incentiveAmount':inc.incentiveAmount,
      'date':new Date(inc.date),
      'comment':inc.comment,
      'managerToApproveKey':inc.managerToApproveKey,
      'managerToApproveName':inc.managerToApproveName,
    })
  }

  submitEditIncentive(){
    const myDate = `${new Date(this.createNewIncentiveForm.get(['date'])?.value).getMonth() + 1 }/${new Date(this.createNewIncentiveForm.get(['date'])?.value).getDate()}/${new Date(this.createNewIncentiveForm.get(['date'])?.value).getFullYear()}`
    const processName = this.myProcess.find(pro=>pro.key == this.createNewIncentiveForm.value['processKey'])?.title;
    if(!!this.incentiveToEdit){
      this.incentiveToEdit.empKey = this.createNewIncentiveForm.get(['empKey'])?.value;
      this.incentiveToEdit.empName = this.createNewIncentiveForm.get(['empName'])?.value;
      this.incentiveToEdit.incentiveAmount = this.createNewIncentiveForm.get(['incentiveAmount'])?.value;
      this.incentiveToEdit.projectKey = this.createNewIncentiveForm.get(['projectKey'])?.value;
      this.incentiveToEdit.projectName = this.createNewIncentiveForm.get(['projectName'])?.value;
      this.incentiveToEdit.processKey = this.createNewIncentiveForm.get(['processKey'])?.value;
      this.incentiveToEdit.processName = processName || '';
      this.incentiveToEdit.date = myDate;
      this.incentiveToEdit.comment = this.createNewIncentiveForm.get(['comment'])?.value;

      if(this.currentUser.department == Department.TECHNICAL_TEAM && this.currentUser.accPosition == AccountPositions.MANAGER){
        this.incentiveToEdit.managerToApproveKey = this.createNewIncentiveForm.get(['managerToApproveKey'])?.value;
        this.incentiveToEdit.managerToApproveName = this.managers.find(man=>man.key == this.incentiveToEdit?.managerToApproveKey)?.username
        this._finance.updatePendingIncentive(this.incentiveToEdit).subscribe(res=>{
          if(res['status'] == ResStatus.CRUD){
            this._notify.openSnackbar("Incentive Updated" , SnackBarState.Success)
            this.dismissEditIncentive();
            this.getMyRequests();
          }
        })
      } 
    }      
  }

  deleteIncentive(inc:Incentive){
    this._notify.openDialog(
      'Delete Incentive?',
      `Are you sure you want to Delete this Incentive?`,
      false,
      '*By clicking yes this incentive will be deleted forever',
      true,
      false).subscribe(response => {
        if (response) {
          this._finance.deletePendingIncentive(inc.key || '').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this._notify.openSnackbar('Incentive deleted Successfully' , SnackBarState.Success , 3000)
              this.getMyRequests();
            }
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
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

  openDatePicker(picker) {
    picker.open();
  }

  closeDatePicker(eventData: any, picker?:any) {
    this.createNewIncentiveForm.patchValue({
      'date' : eventData
    })
    picker.close();    
  }
  
  
  managerDissision(dissision:boolean){
    if(dissision == true){
      this._finance.incentiveManagerApprove(this.incentiveForReview.key || '').subscribe(res=>{
        console.log(res);
        
        if(res['status'] == ResStatus.CRUD){
          this.incentiveForReview = this.incentiveEmptyTemp;
          const i = this.pendingIncentive.findIndex(pr => pr.key == this.incentiveForReview.key)
          this.pendingIncentive.splice(i,1)
        }
      })
    }else{
      this._finance.incentiveManagerReject(this.incentiveForReview.key || '' , this.incentiveForReview.managerDissisionComment || '').subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.incentiveForReview = this.incentiveEmptyTemp;
          const i = this.pendingIncentive.findIndex(pr => pr.key == this.incentiveForReview.key)
          this.pendingIncentive.splice(i,1)
        }
      })
    }


  }



  // managerDissisionOld(dissision:boolean){
  //   this.incentiveForReview.managerDissision = dissision;
  //   this.incentiveForReview.managerDissisionAt = new Date().toDateString();
  //   this.incentiveForReview.managerDissisionKey = this.currentUser.key;
  //   this.incentiveForReview.managerDissisionName = this.currentUser.username;
  //   if(dissision == true){
  //     this.incentiveForReview.approvalCycle = incentiveApprovalCycle.PendingOnFinance;
  //     this.incentiveForReview.financeToApproveName = this.admins.find(admin=>admin.key == this.incentiveForReview.financeToApproveKey)?.username;
  //     this._salary.updatePendingIncentive(this.incentiveForReview).then(()=>{
  //       const newSinglePC:singleProjectCost = {
  //         empKey: this.incentiveForReview.empKey,
  //         empName: this.incentiveForReview.empName,
  
  //         projectKey:this.incentiveForReview.projectKey ,
  //         projectTitle:this.incentiveForReview.projectName ,
  //         processKey:this.incentiveForReview.processKey ,
  //         processTitle:this.incentiveForReview.processName ,
  
  //         costType: TypeOfCost.INCENTIVE,
  //         costComment: 'Incentive' ,
          
  //         costDate: this.incentiveForReview.date ,
  //         createdAt: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}` ,
  //         createdByKey: this.incentiveForReview.managerDissisionKey || '',
  //         createdByName: this.incentiveForReview.managerDissisionName || '' ,
          
  //         costAmount: this.incentiveForReview.incentiveAmount,
  
  //         notes: `Incentive Approved By ${this.incentiveForReview.managerDissisionName} =>  ${this.incentiveForReview.date} To Dev ${this.incentiveForReview.empName}`
  //       }
  //       this._projectCost.createNewSingleCost(newSinglePC);
  //       const noti:Notifying ={
  //         receverKey: this.incentiveForReview.financeToApproveKey || '',
  //         receverName: this.incentiveForReview.financeToApproveName || '',
  //         senderKey: this.incentiveForReview.managerDissisionKey || '',
  //         senderName: this.incentiveForReview.managerDissisionName || '',
  //         title: 'New Incentive Request',
  //         body : `You Have A New Incentive Request from ${this.incentiveForReview.managerDissisionKey}`,
  //         redirection:`/manager/incentive`,
  //         senderImg : ""
  //       } 
  //       this._message.createnotification(noti);
  //       this.incentiveForReview = this.incentiveEmptyTemp;
  //     })
  //   }else{
  //     this.incentiveForReview.approvalCycle = incentiveApprovalCycle.Finished;
  //     this.incentiveForReview.finalStatus = incentiveFinalStatus.rejected;
  //     this._salary.moveIncentiveToFinished(this.incentiveForReview).then(()=>{
  //       this.incentiveForReview = this.incentiveEmptyTemp;
  //       const noti:Notifying ={
  //         receverKey: this.incentiveForReview.createdByKey,
  //         receverName: this.incentiveForReview.createdByName,
  //         senderKey: this.incentiveForReview.managerDissisionKey || '',
  //         senderName: this.incentiveForReview.managerDissisionName || '',
  //         title: 'Incentive Rejected',
  //         body : `The Incentive For ${this.incentiveForReview.empName} On Project ${this.incentiveForReview.projectName} Rejected`,
  //         redirection:`/manager/incentive`,
  //         senderImg : ""
  //       } 
  //       this._message.createnotification(noti);
  //     })
  //   }
   
   
  // }


  // financeDissision(dissision:boolean){
  //   this.incentiveForReview.financeDissision = dissision;
  //   this.incentiveForReview.financeDissisionAt = new Date().toDateString();
  //   this.incentiveForReview.financeDissisionKey = this.currentUser.key;
  //   this.incentiveForReview.financeDissisionName = this.currentUser.username;
  //   if(dissision == true){
  //     this.incentiveForReview.approvalCycle = incentiveApprovalCycle.Finished;
  //     this.incentiveForReview.finalStatus = incentiveFinalStatus.Approved;
  //     this._salary.updatePendingIncentive(this.incentiveForReview).then(()=>{
  //       this._salary.moveIncentiveToFinished(this.incentiveForReview).then(()=>{
  //         this.incentiveForReview = this.incentiveEmptyTemp;
  //         const noti:Notifying ={
  //           receverKey: this.incentiveForReview.createdByKey || '',
  //           receverName: this.incentiveForReview.createdByName || '',
  //           senderKey: this.incentiveForReview.financeDissisionKey || '',
  //           senderName: this.incentiveForReview.financeDissisionName || '',
  //           title: 'Incentive Approved',
  //           body : `Incentive You created For ${this.incentiveForReview.empName} For Project ${this.incentiveForReview.projectName} Has Approved`,
  //           redirection:`/manager/incentive`,
  //           senderImg : ""
  //         } 
  //         this._message.createnotification(noti);
  //       })
  //     })
  //   }else{
  //     this.incentiveForReview.approvalCycle = incentiveApprovalCycle.PendingOnManager;
  //     this._salary.updatePendingIncentive(this.incentiveForReview).then(()=>{
  //       this.incentiveForReview = this.incentiveEmptyTemp;
  //       const noti:Notifying ={
  //         receverKey: this.incentiveForReview.managerDissisionKey || '',
  //         receverName: this.incentiveForReview.managerDissisionName || '',
  //         senderKey: this.incentiveForReview.financeDissisionKey || '',
  //         senderName: this.incentiveForReview.financeDissisionName || '',
  //         title: 'Incentive Rejected',
  //         body : `The Incenctive For ${this.incentiveForReview.empName} On Project ${this.incentiveForReview.projectName} Rejected`,
  //         redirection:`/manager/incentive`,
  //         senderImg : ""
  //       } 
  //       this._message.createnotification(noti);
  //     })
  //   }
    
  // }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}