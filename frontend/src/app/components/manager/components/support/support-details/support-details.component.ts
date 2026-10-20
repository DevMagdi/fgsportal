import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ClientTicket, ClientTicketPeriority, ClientTicketStatus, ProjectSupport, ProjectSupportHistory, SupportPeriority, SupportStatus } from 'src/app/interfaces/client-ticket';
import { Products } from 'src/app/interfaces/products';
import { ResStatus } from 'src/app/interfaces/res-status';
import { SUB_TASk } from 'src/app/interfaces/task';
import { AccountPositions, AccountRoles, Department, Partner, User } from 'src/app/interfaces/user';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-support-details',
  templateUrl: './support-details.component.html',
  styleUrls: ['./support-details.component.scss']
})
export class SupportDetailsComponent implements OnInit {
  @ViewChild('supportModal') modal; 
  @ViewChild('addTicketMOdal') ticketModal; 

  currentUser: User;
  projectDetails: ProjectSupport;
  projectTickets: ClientTicket[] = [];
  client: Partner;
  AccountRolesEnum = AccountRoles;
  closeResult: string;
  mySubTasks:SUB_TASk[]= [];
  supportPeriorityEnum = SupportPeriority;
  activeIndex=0;
  newTicketFormDisplay=false;
  editSupportForm:FormGroup = new FormGroup({
    // 'title':new FormControl(null , Validators.required),
    'start_date':new FormControl(null , Validators.required),
    'end_date':new FormControl(null , Validators.required),
    'client':new FormControl(null , Validators.required),
    'priority':new FormControl(null , Validators.required),
    'product_Key':new FormControl(null , Validators.required),
    'notes':new FormControl(null),
    'pmID':new FormControl(null),
  })

  newTicketForm:FormGroup = new FormGroup({
    'title' : new FormControl(null , Validators.required),
    'desc' : new FormControl(null , Validators.required),
    'processKey': new FormControl(null),
    'priority': new FormControl(null, Validators.required),
    'clientKey': new FormControl(null),
    'IssueType': new FormControl(null, Validators.required),
    'primaryContactName': new FormControl(null),
    'primaryContactPhone': new FormControl(null),
  })

  // processSupport:ProcessSupport[] = [];
  allClients:Partner[] = [];
  SupportPeriorityEnum = SupportPeriority;
  DepartmentEnum = Department;
  accPositionEmun = AccountPositions;
  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    ['clean']                                         // remove formatting button
  ];
  quillOPT ={
    toolbar: this.toolbarOptions
  }
  clientTicketperiorityENUM = ClientTicketPeriority;
  managers:User[] = [];
  allProducts:Products[] = [];
  contractDetailsLoading:boolean = false;
  userPerms:UserPermissions[] = [];
  editSupportMode=false;
  supportID!:string;
  constructor(private _db: DatabaseService,
              private _auth: AuthApiService,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private router:Router,
              private _notify:NotificationService
            ) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user => {
      this.currentUser = user;
      if(this.currentUser.department != Department.MANAGEMENT && this.currentUser.department != Department.TECHNICAL_TEAM){
        this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
          if(perms['status'] == ResStatus.CRUD){
            this.userPerms = perms['data'];         
          }else{
            this.userPerms = []
          }
        },err=>{
          console.log(err);
          this.userPerms = []
        })
      }
      this.getCurrentSupport();
    })
  }
  // getProcessSupport(){
  //   const getProcSup:Subscription = this._db.getProcessSupportByProjectKey(this.projectDetails.key||'').subscribe(proc=>{
  //     getProcSup.unsubscribe();
  //     this.processSupport = proc;
  //   })
  // }

  // getProjectProcess(){
    
  // }


  getCurrentSupport() {
    this.supportID = this.route.snapshot.params.id
    this._db.getSupportContractByID(this.supportID).subscribe(res => {
      if(res['status'] == ResStatus.CRUD){
        this.projectDetails = res['data'];
        const phoneSTR:any = this.projectDetails.primary_contact_phone
        this.projectDetails.primary_contact_phone = JSON.parse(phoneSTR)
      }
      // if (!!this.projectDetails.customerKey) {
      //   this.getClient(this.projectDetails.customerKey);
      // }
      this.getSupportTickets();
      // this.getProcessSupport();
    })
  }

  getClient(clientKey: string) {
    this._auth.getUserByKey(clientKey).subscribe(client => {
      this.client = client;
    })
  }


  getSupportTickets() {
    // const supportID = this.route.snapshot.params.id
    this._db.getTicketsByContractID(this.projectDetails.key || '').subscribe(res => {      
      if(res['status'] == ResStatus.CRUD){
        this.projectTickets = res['data'];
      }
    })
  }

  getPeriority(ticektPeriority: ClientTicketPeriority) {
    switch (ticektPeriority) {
      case ClientTicketPeriority.Normal:
        return 'Normal';
      case ClientTicketPeriority.High:
        return 'High';
      case ClientTicketPeriority.Critical:
        return 'Critical'
    }

  }

  getStatus(status:ClientTicketStatus){
    switch (status) {
      case ClientTicketStatus.STARTED:
        return 'Started';
      case ClientTicketStatus.CLOSED:
        return 'Closed';
    }
  }

  getSupportStatue(status:SupportStatus){
    switch (status) {
      case SupportStatus.RUNNING:
        return 'Running';
      case SupportStatus.CLOSED:
        return 'Closed';
    }
  }



  deleteSupport(){
    this._notify.openDialog(
      'Delete Support?',
      `Are you sure you want to Delete this Support?`,
      false,
      '*By clicking yes this support will be deleted forever',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deleteProjectSupport(this.projectDetails.key || '').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this._notify.openSnackbar(`deleted` , SnackBarState.Success)
              this.router.navigate(['/manager/client-support'])
            }
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

  getAllClients(){
    // this._auth.getAllClients().subscribe(clients=>{
    //   this.allClients = clients;
    // })
    this._db.getAllPartners(false).subscribe(clients=>{
      if(clients['status'] == ResStatus.CRUD){
        this.allClients = clients['data'];
      }
    })
  }

  getAllPMS(){
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      if(this.currentUser.department == Department.MANAGEMENT){
        this._auth.getUserByFilter(Department.TECHNICAL_TEAM,AccountRoles.Automation_Engineer ,AccountPositions.MANAGER).subscribe(res=>{
          if(res['status'] == ResStatus.CRUD){
            this.managers = res['data'];
          }else{
            this.managers = [];
          }
        })
      }
    })
  }


  getAllProducts(){
    this._db.getAllProducts().subscribe(products=>{
      if(products['status'] == ResStatus.CRUD){
        this.allProducts = products['data'];
        this.allProducts.splice(0,1)
      }
    })
  }

  editSupport(){
    // this.getProjectProcess();
    this.getAllClients();
    this.getAllProducts();
    this.getAllPMS();

    this.editSupportForm.patchValue({
      'title':this.projectDetails.customerKey.toString(),
      'start_date':this.projectDetails.startDate,
      'end_date':this.projectDetails.endDate,
      'client':this.projectDetails.customerKey.toString(),
      'priority':this.projectDetails.periority.toString(),
      'notes':this.projectDetails.notes,
      'pmID':this.projectDetails.PMID?.toString(),
      'product_Key':this.projectDetails.product_id.toString(),
    })
    console.log(this.editSupportForm.value);
    
    // if(this.processSupport.length > 0){
    //   const getpoc:Subscription = this._db.getProjectSubTasks(this.projectDetails.key || '').subscribe(process=>{
    //     getpoc.unsubscribe();
    //     this.mySubTasks = process;
    //     let procSup:SUB_TASk[] = [];
    //     for(let i in this.processSupport){         
    //       const pro = this.mySubTasks.find(sub=>sub.key == this.processSupport[i].processKey);
    //       if(!!pro){
    //         procSup.push(pro)
    //       }
    //     }
    //     this.editSupportForm.patchValue({
    //         'proceses':procSup
    //     });
    //   })
      
    // }
  }

  validateNewSupport(){
    if(!this.editSupportForm.get(['client'])?.value ){      
      this._notify.openSnackbar('Invalid Inputs' , SnackBarState.Error , 5000)
    }else{    
      this.submitEditSupport();
    }
  }

  submitEditSupport(){
    this.contractDetailsLoading = true;
    this.projectDetails.startDate = `${new Date(this.editSupportForm.get(['start_date'])?.value).getMonth()+1}/${new Date(this.editSupportForm.get(['start_date'])?.value).getDate()}/${new Date(this.editSupportForm.get(['start_date'])?.value).getFullYear()}`
    this.projectDetails.endDate = `${new Date(this.editSupportForm.get(['end_date'])?.value).getMonth()+1}/${new Date(this.editSupportForm.get(['end_date'])?.value).getDate()}/${new Date(this.editSupportForm.get(['end_date'])?.value).getFullYear()}`
    this.projectDetails.periority = this.editSupportForm.get(['priority'])?.value;
    // this.projectDetails.name = this.editSupportForm.get(['title'])?.value;
    this.projectDetails.customerKey = this.editSupportForm.get(['client'])?.value;
    // this.projectDetails.product_id = this.editSupportForm.get(['product_Key'])?.value;
    // if(!!this.editSupportForm.get(['notes'])?.value){
    //   this.projectDetails.notes = this.editSupportForm.get(['notes'])?.value;
    // }

    // if(!!this.editSupportForm.get(['pmID'])?.value){
    //   this.projectDetails.PMID = this.editSupportForm.get(['pmID'])?.value;
    // }

    this.projectDetails.product_id = this.editSupportForm.get(['product_Key'])?.value;
    this.projectDetails.notes = this.editSupportForm.get(['notes'])?.value;
    this.projectDetails.PMID = this.editSupportForm.get(['pmID'])?.value;
    
    this._db.updateContractSupport(this.projectDetails).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.getCurrentSupport();
        this.editSupportForm.reset();
        const x = this.modal;    
        this.Close(x)
        this._notify.openSnackbar('support opened' , SnackBarState.Success)
        this.contractDetailsLoading = false;
      }else{
        this.contractDetailsLoading = false;
      }
    },err=>{
      this.contractDetailsLoading = false;
    })
  }


  open(content) {
    this.modalService.open(content, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
  Close(content) {
    this.modalService.dismissAll(content)
  }


  validateNewTicket(){    
    if(this.currentUser.department == Department.MANAGEMENT || this.checkIfHasPerm(20)){
      if(!this.projectDetails.customerKey && !this.newTicketForm.get(['clientKey'])?.value){
        this._notify.openSnackbar('Please Choose A Customer For This Support' , SnackBarState.Error , 5000)
      }else{
        this.submitNewTicket()
      }
    }
    
  }

  submitNewTicket(){
    this.contractDetailsLoading = true;
    const fd : FormData = new FormData()
    fd.append('title' , this.newTicketForm.get('title')?.value)      
    fd.append('ticket_type_id' , this.newTicketForm.get('IssueType')?.value)      
    fd.append('ticket_priority_id' , this.newTicketForm.get('priority')?.value)      
    fd.append('contract_support_id' , this.projectDetails.key || '')      
    fd.append('client' , 'false')
    fd.append('ticket_status_id' , ClientTicketStatus.STARTED)      
    fd.append('notes' , this.newTicketForm.get('desc')?.value)     
    this._db.createNewTicket(fd).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.getCurrentSupport();
        this.newTicketForm.reset();
        this.Close(this.ticketModal);
        this.contractDetailsLoading = false;
      }else{
        this.contractDetailsLoading = false;
      }
    },err=>{
      this.contractDetailsLoading = false;
    })
    
  }

  checkIfNoClient(){
    if(!this.projectDetails.customerKey){
      this.getAllClients();
    }
  }

  checkIfHasPerm(perm_id){
    const checking = this.userPerms.find(p=>p.permission_id == perm_id)
    if(!!checking){
      return true;
    }else{
      return false;
    }
  }

  renewContract(){
    this._notify.openDialog(
      'Renew Contract?',
      `Are you sure you want to Renew this Contract?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          if(!!this.projectDetails.endDate){
            const newStartDate = new Date(new Date(new Date(this.projectDetails.endDate).setDate(new Date(this.projectDetails.endDate).getDate() + 1)))
            const newEndDate = this.getDateAfterYear(newStartDate)
            const renewCon:ProjectSupportHistory = {
              contract_support_id:this.projectDetails.key || '',
              contract_start_date:this._db.getDateFormatted(newStartDate),
              contract_end_date:this._db.getDateFormatted(newEndDate)
            }
            this._db.renewContractSupport(renewCon).subscribe(res=>{
              if(res['status'] == ResStatus.CRUD){
                this.getCurrentSupport();
              }
            })
          }
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

  getDateAfterYear(date:Date){
    const currentDate = new Date(date)
    const yestrdayDate = new Date(new Date(currentDate).setDate(currentDate.getDate() - 1))
    const dateAfterYear = new Date(new Date(yestrdayDate).setFullYear(yestrdayDate.getFullYear() + 1))
    return dateAfterYear
  }

}
