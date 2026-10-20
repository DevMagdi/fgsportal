import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Transportations } from 'src/app/interfaces/transportations';
import { AccountRoles,  Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-pending-transportations',
  templateUrl: './pending-transportations.component.html',
  styleUrls: ['./pending-transportations.component.scss']
})
export class PendingTransportationsComponent implements OnInit {
  currentUser:User;
  myPendingRequests:Transportations[] = [];
  closeResult: string;
  requestToReview:Transportations;

  displayedColumns: string[] = ['Name', 'Date', 'From', 'To', 'Purpose', 'Project', 'Amount', 'Decision' ];

  admins:User[] = [];
  managers:User[] = [];
  DepartmentEnum = Department;
  AccountRolesEnum = AccountRoles;
  transportationModal=false;
  constructor(private _db:DatabaseService , 
              private modalService: NgbModal,
              private _auth:AuthApiService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(
      (user)=>{
        this.currentUser = user;
        this.getMyPendingTransRequest();
      }
    )

    this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.managers = res['data'];
      }
    })

    this._auth.getUserByFilter(Department.ADMINSTRATION , AccountRoles.FINANCE).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.admins = res['data'];
      }
    })
  }


  getMyPendingTransRequest(){
    if(this.currentUser.accRole == AccountRoles.SUPER_USER){
      this._db.getAllTransportationToApprove().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myPendingRequests = res['data'];
        }
      })
    }else if(this.currentUser.accRole == AccountRoles.FINANCE){
      this._db.transportationFinanceToPay().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myPendingRequests = res['data'];
        }else if(res['status'] == ResStatus.Success_But_Empty){
          this.myPendingRequests = []
        }
      })
    }else{
      this._db.getMyTransportationToApprove().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myPendingRequests = res['data'];
        }else if(res['status'] == ResStatus.Success_But_Empty){
          this.myPendingRequests = []
        }
      })
    }
  }

  flowDecision(approved:boolean){
    if(approved == true){
      if(this.currentUser.department == Department.MANAGEMENT){
        this._db.transportationManagerApprove(this.requestToReview).subscribe(res=>{                    
          if(res['status'] == ResStatus.CRUD){
            this.getMyPendingTransRequest();
          }
        })
      }else{
        this._db.transportationAssignToApprove(this.requestToReview).subscribe(res=>{
          if(res['status'] == ResStatus.CRUD){
            this.getMyPendingTransRequest();
          }
        })
      }
    }else{
      this.requestToReview.managerDissisionKey = this.currentUser.key;
      this._db.transportationManagerReject(this.requestToReview).subscribe(res=>{        
        if(res['status'] == ResStatus.CRUD){
          this.getMyPendingTransRequest();
        }
      })
    }
  }


  markAsDone(){
    this._db.transportationMarkAsDone(this.requestToReview).subscribe(res=>{      
      if(res['status'] == ResStatus.CRUD){
        this.getMyPendingTransRequest();
      }
    })
  }

  reviewRequest(req:Transportations){
    this.requestToReview = req;
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
  open(content) {    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  // getMyPendingTransRequestOld(){
  //   this.myPendingRequests = [];
  //   if(this.currentUser.key == 'jjuyajnYK6clqnD7PIMEuQesyiy2' || this.currentUser.key == 'eC325vPgT2SsY2QaAYhrCMFoUBH3'){
  //     this.db.getAllPendingTransportaionsToApprove().subscribe(manRequests=>{
  //       this.myPendingRequests = manRequests//.filter(req=>req.empKey == 't12YeeWagmNxh5YrVnT9pAfEFjG2')
  //       // console.log(this.myPendingRequests);
  //       // for (let i in this.myPendingRequests){
  //       //   if(this.myPendingRequests[i].financeDissision == true && this.myPendingRequests[i].approvalCycle == transportaionApprovalCycle.PendingOnFinance ){
  //       //     console.log(this.myPendingRequests[i]);
            
  //       //   }
  //       // }
        
  //     })
  //   }else {
  //     if(this.currentUser.department == Department.MANAGEMENT){
  //       this.db.getPmPendingTransportaionsToApprove(this.currentUser.key || '').subscribe(
  //         (pmRequests)=>{
  //           // this.myPendingRequests = [];
  //           this.myPendingRequests = pmRequests.filter(req=>req.approvalCycle == transportaionApprovalCycle.PendingOnPM);
  //         }
  //       )   
        
  //       this.db.getManagerPendingTransportaionsToApprove(this.currentUser.key || '').subscribe(

  //         (manRequests)=>{
  //           const filterData = manRequests.filter(req=>req.approvalCycle == transportaionApprovalCycle.PendingOnManager);
  //           this.myPendingRequests = this.myPendingRequests.concat(filterData)
  //         }
  //       )
       
  //     }else if(this.currentUser.accPosition == AccountPositions.MANAGER){
  //       this.db.getPmPendingTransportaionsToApprove(this.currentUser.key || '').subscribe(
  //         (pmRequests)=>{
  //           this.myPendingRequests = pmRequests.filter(req => req.approvalCycle == transportaionApprovalCycle.PendingOnPM);
  //         }
  //       )
  //     }else if(this.currentUser.department == Department.ADMINSTRATION){
  //       this.db.getFinancePendingTransportaionsToApprove(this.currentUser.key || '').subscribe(
  //         (financeRequests)=>{
  //           this.myPendingRequests = financeRequests.filter(req=>req.approvalCycle == transportaionApprovalCycle.PendingOnFinance);
  //         }
  //       )
  //     }
  //   }
    
    
  // }


  // openForPm(content , requestToReview:Transportations , decision:boolean) {
  //   this.requestToReview = requestToReview;

  //   decision == true ? this.requestToReview.pmDissision = true : this.requestToReview.pmDissision = false;
    
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // openForFinance(content , requestToReview:Transportations , decision:boolean) {
  //   this.requestToReview = requestToReview;

  //   decision == true ? this.requestToReview.financeDissision = true : this.requestToReview.financeDissision = false;
    
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }


  // openForManager(content , requestToReview:Transportations , decision:boolean) {
  //   this.requestToReview = requestToReview;

  //   decision == true ? this.requestToReview.managerDissision = true : this.requestToReview.managerDissision = false;
    
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }





  // pmDecision(){
  //   this.requestToReview.pmDissisionKey = this.currentUser.key;
  //   this.requestToReview.pmDissisionName = this.currentUser.username;
  //   this.requestToReview.pmDissisionAt = new Date().toLocaleString();

  //   if(this.requestToReview.pmDissision == true){
  //     this.requestToReview.financeToApproveName = this.admins.find(admin=> admin.key == this.requestToReview.financeToApproveKey)?.username;
  //     this.requestToReview.approvalCycle = transportaionApprovalCycle.PendingOnFinance;
  //     this.db.updateTransportaion(this.requestToReview).then(()=>{
  //       this.getMyPendingTransRequest()
  //       const newMessage:Notifying = {
  //         receverKey: this.requestToReview.financeToApproveKey || '',
  //         receverName:this.requestToReview.financeToApproveName || '',
  //         senderKey:this.requestToReview.pmDissisionKey || '',
  //         senderName:this.requestToReview.pmDissisionName || '',
  //         title:'New Transportation Request',
  //         body : ` ${this.requestToReview.pmDissisionName} Approved Transportation Request from ${this.requestToReview.empName} And Assigned To You`,
  //         redirection:`/admin-panel/pendingtransportations`,
  //         senderImg : this.requestToReview.empImgUrl ? this.requestToReview.empImgUrl : ""
  //       }
  //       this._messaging.createnotification(newMessage)
  //     })
  //   }else{
  //     this.requestToReview.finalStatus = transportaionFinalStatus.Rejected;
  //     this.db.transportationsFinishCycle(this.requestToReview).then(()=>this.getMyPendingTransRequest())
  //   }
   

    
  // }

  // financeDecision(){
  //   this.requestToReview.financeDissisionKey = this.currentUser.key;
  //   this.requestToReview.financeDissisionName = this.currentUser.username;
  //   this.requestToReview.financeDissisionAt = new Date().toLocaleString();

  //   if(this.requestToReview.financeDissision == true){
  //     this.requestToReview.managerToApproveName = this.managers.find(manager=> manager.key == this.requestToReview.managerToApproveKey)?.username;
  //     this.requestToReview.approvalCycle = transportaionApprovalCycle.PendingOnManager;
  //     this.db.updateTransportaion(this.requestToReview).then(()=>{
  //      this.getMyPendingTransRequest()
  //       const newMessage:Notifying = {
  //         receverKey: this.requestToReview.managerToApproveKey || '',
  //         receverName:this.requestToReview.managerToApproveName || '',
  //         senderKey:this.requestToReview.financeDissisionKey || '',
  //         senderName:this.requestToReview.financeDissisionName || '',
  //         title:'New Transportation Request',
  //         body : ` ${this.requestToReview.financeDissisionName} Approved Transportation Request from ${this.requestToReview.empName} And Assigned To You`,
  //         redirection:`/admin-panel/pendingtransportations`,
  //         senderImg : this.requestToReview.empImgUrl ? this.requestToReview.empImgUrl : ""
  //       }
  //       this._messaging.createnotification(newMessage)
  //     })
  //   }else{
  //     this.requestToReview.finalStatus = transportaionFinalStatus.Rejected;
  //     this.db.transportationsFinishCycle(this.requestToReview).then(()=>this.getMyPendingTransRequest())
  //   }
  // }



  // managerDecision(){
  //   this.requestToReview.managerDissisionKey = this.currentUser.key;
  //   this.requestToReview.managerDissisionName = this.currentUser.username;
  //   this.requestToReview.managerDissisionAt = new Date().toLocaleString();
  //   this.requestToReview.approvalCycle = transportaionApprovalCycle.Finished;
  //   this.requestToReview.finalStatus =this.requestToReview.managerDissision == true ? transportaionFinalStatus.Approved: transportaionFinalStatus.Rejected;
  //   this.db.transportationsFinishCycle(this.requestToReview).then(()=>this.getMyPendingTransRequest()).then(()=>{
  //     const newSinglePC:singleProjectCost = {
  //       empKey: this.requestToReview.empKey,
  //       empName: this.requestToReview.empName,

  //       projectKey:this.requestToReview.projectKey ,
  //       projectTitle:this.requestToReview.projectName ,
  //       processKey:this.requestToReview.processKey ,
  //       processTitle:this.requestToReview.processName ,

  //       costType: TypeOfCost.TRANSPORTATION,
  //       costComment: 'Transportation' ,
        
  //       costDate: this.requestToReview.date ,
  //       createdAt: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}` ,
  //       createdByKey: this.requestToReview.managerDissisionKey || '',
  //       createdByName: this.requestToReview.managerDissisionName || '' ,
        
  //       costAmount: this.requestToReview.amountByEGP,

  //       notes: `Transportation Approved By ${this.requestToReview.managerDissisionName} For Date ${this.requestToReview.date} To Dev ${this.requestToReview.empName}`
  //     }
  //     this._projectCost.createNewSingleCost(newSinglePC)
  //   })
  // }


}
