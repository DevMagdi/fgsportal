import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ProjectSupport, SupportPeriority, SupportStatus } from 'src/app/interfaces/client-ticket';
import { Products } from 'src/app/interfaces/products';
import { Project } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { SUB_TASk } from 'src/app/interfaces/task';
import { AccountPositions, AccountRoles, Department, Partner, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  @ViewChild('supportModal') modal; 

  searchKey:string;
  closeResult: string;
  
  mySupport:ProjectSupport[]= [];
  filteredSupport:ProjectSupport[]= [];

  filtersList:SupportStatus[] = [];
  StatusEnum = SupportStatus;

  currentUser:User;
  
  myProjects:Project[] = [];
  mySubTasks:SUB_TASk[] = [];


  accRolesEnum = AccountRoles;
  supportPeriorityEnum = SupportPeriority;
  DepartmentEnum = Department;
  accPositionEmun = AccountPositions;
  allClients:Partner[] = [];
  allProducts:Products[] = [];

  managers:User[] = [];
  contractSupportLoading:boolean = false;
  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    ['clean']                                         // remove formatting button
  ];

  quillOPT ={
    toolbar: this.toolbarOptions
  }

  newProjectSupportForm:FormGroup = new FormGroup({
    'start_date':new FormControl(null , Validators.required),
    'end_date':new FormControl(null , Validators.required),
    'client_Key':new FormControl(null , Validators.required),
    'product_Key':new FormControl(null , Validators.required),
    'periority':new FormControl(null , Validators.required),
    'notes':new FormControl(null),
    'pmID':new FormControl(null),
    // 'contractName':new FormControl(null , Validators.required),
    // 'proceses':new FormControl(null), 
    // 'project_Key':new FormControl(null),
    // 'project_title':new FormControl(null),
    
  })
  newServerApi = environment.newServerApi;
  sidebarDisplay=false;
  
  constructor(private modalService: NgbModal,
              private _db:DatabaseService,
              private _auth:AuthApiService,
              private notify:NotificationService,) { }

  ngOnInit(): void {
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
        this.getAllContracts();
       
       
      }else if(this.currentUser.department == Department.TECHNICAL_TEAM && this.currentUser.accPosition == AccountPositions.MANAGER){
        this.getMySupportContract();
      }else{
        this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
          if(perms['status'] == ResStatus.CRUD){
            const userPerms = perms['data'];               
            const checking = userPerms.find(p=>p.permission_id == 6)
            if(!!checking){
              this.getAllContracts();
            }
          }
        },err=>{
          console.log(err); 
        })
      }      
    })
  }



  getAllContracts(){
    this._db.getAllSupportContract().subscribe(projects=>{
      if(projects['status'] == ResStatus.CRUD){
        this.mySupport = projects['data'];
        this.filteredSupport = projects['data'];
        // this.getClientLogo();
      }
    })
  }

  getMySupportContract(){
    this._db.getMySupportContract().subscribe(projects=>{
      if(projects['status'] == ResStatus.CRUD){
        this.mySupport = projects['data'];
        this.filteredSupport = projects['data'];
        // this.getClientLogo();
      }
    })
  }

  // getClientLogo(){
  //   // for (let i in this.mySupport){
  //   //   this._auth.getUserByKey(this.mySupport[i].customerKey).subscribe(user=>{
  //   //     if(!!user){
  //   //       this.mySupport[i].customerImgUrl = user.photoURL;
  //   //     }
  //   //   })
  //   // }
  // }


  getAllClient(){
    this._db.getAllPartners(false).subscribe(clients=>{
      if(clients['status'] == ResStatus.CRUD){
        this.allClients = clients['data'];
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

  // getProjects(){
  //   const clientKey = this.newProjectSupportForm.get(['client_Key'])?.value;
  //   if(!!clientKey){
  //     this._db.getProjectsByClientKey(clientKey).subscribe(projects=>{
  //       if(this.currentUser.department == Department.MANAGEMENT){
  //         this.myProjects = projects;
  //       }else if (this.currentUser.accPosition == AccountPositions.MANAGER){
  //         this.myProjects = projects.filter(p=>p.PMID == this.currentUser.key);      
  //         this.getClientLogo();    
  //       }
  //     })
  //   }

  //   // if(this.currentUser.department == Department.MANAGEMENT){
  //   //   if(this.currentUser.accRole == AccountRoles.MANAGER || this.currentUser.accRole == AccountRoles.SUPER_USER){
  //   //     this._db.getAllProjects().subscribe(projects=>{
  //   //       this.myProjects = projects;
  //   //     })
  //   //   }else if (this.currentUser.accRole == AccountRoles.PROJECT_MANAGER){
  //   //     this._db.getPMProjects(this.currentUser.key || '').subscribe(projects=>{
  //   //       this.myProjects = projects;
  //   //     })
  //   //   }
  //   // }
  // }
  

  // getProjectProcess(){
  //   const pKey = this.newProjectSupportForm.get(['project_Key'])?.value;
  //   this.newProjectSupportForm.patchValue({
  //     'start_date':`${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
  //     'end_date':`${new Date().getMonth() + 1}/${new Date().getDate() -1 }/${new Date().getFullYear() + 1}`,
  //   })
  //   if(!!pKey){
  //     this._db.getProjectSubTasks(pKey).subscribe(process=>{
  //       this.mySubTasks = process;
  //       console.log(this.mySubTasks);
        
  //     })
  //   }
  // }


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


  filterProjects(){    
    this.mySupport = this.filteredSupport ; 
    if(this.filtersList.length > 0){
      this.mySupport = [];
      for (let i in this.filteredSupport){
        const found = this.filtersList.find(status=>this.filteredSupport[i].status == status)
        if(!!found){
          this.mySupport.push(this.filteredSupport[i])
        }
      }


    }else{
      this.mySupport = this.filteredSupport; 
    }
    
  }

  searchProject(){
    
    this.mySupport = this.filteredSupport ; 
    if(!!this.searchKey && this.searchKey.length > 0){
      this.mySupport =  this.mySupport.filter(project=> project.product_name?.toLowerCase().includes(this.searchKey.toLowerCase()))
    }else{
      this.mySupport = this.filteredSupport
    }
  }


  validateNewSupport(){
    // || (!this.newProjectSupportForm.get(['project_Key'])?.value && !this.newProjectSupportForm.get(['project_title'])?.value )
    if(!this.newProjectSupportForm.get(['client_Key'])?.value ){      
      this.notify.openSnackbar('Invalid Inputs' , SnackBarState.Error , 5000)
    }else{    
      this.submitNewSupport();
    }
  }
  submitNewSupport(){
    this.contractSupportLoading = true;
    const newSupport:ProjectSupport={
      startDate:`${new Date(this.newProjectSupportForm.get(['start_date'])?.value).getMonth()+1}/${new Date(this.newProjectSupportForm.get(['start_date'])?.value).getDate()}/${new Date(this.newProjectSupportForm.get(['start_date'])?.value).getFullYear()}`,
      endDate:`${new Date(this.newProjectSupportForm.get(['end_date'])?.value).getMonth()+1}/${new Date(this.newProjectSupportForm.get(['end_date'])?.value).getDate()}/${new Date(this.newProjectSupportForm.get(['end_date'])?.value).getFullYear()}`,
      status:SupportStatus.RUNNING,
      managerID:this.currentUser.key,
      periority : this.newProjectSupportForm.get(['periority'])?.value,
      customerKey:this.newProjectSupportForm.get(['client_Key'])?.value,
      product_id:this.newProjectSupportForm.get(['product_Key'])?.value,
    }
    if(!!this.newProjectSupportForm.get(['notes'])?.value){
      newSupport.notes = this.newProjectSupportForm.get(['notes'])?.value;
    }

    if(!!this.newProjectSupportForm.get(['pmID'])?.value){
      newSupport.PMID = this.newProjectSupportForm.get(['pmID'])?.value;
    }


    this._db.createNewSupportContract(newSupport).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.getAllContracts();
        this.newProjectSupportForm.reset();
        const x = this.modal;    
        this.Close(x)
        this.notify.openSnackbar('support opened' , SnackBarState.Success)
        this.contractSupportLoading = false;
      }else{
        this.contractSupportLoading = false;
      }
    },err=>{
      this.contractSupportLoading = false;
    })
    // .then(()=>{
    //   this.newProjectSupportForm.reset();
    //   const x = this.modal;    
    //   this.Close(x)
    //   this.notify.openSnackbar('support opened' , SnackBarState.Success)
    // })
  }

  // submitNewSupport(){

  //   if(this.newProjectSupportForm.get('isnew')?.value == false){
  //     const pKey = this.newProjectSupportForm.get(['project_Key'])?.value;
  //     const projectDetails = this.myProjects.find(p=>p.key == pKey)
  
  //     const getSupport:Subscription = this._db.getProjectSupportByProjectKey(pKey).subscribe(sup=>{
  //       getSupport.unsubscribe();      
  //       if(!!sup.projectKey){
  //         this.notify.openSnackbar('Cannot Open Another Support For this Project' , SnackBarState.Warning , 5000)
  //       }else{
  //         if(!!projectDetails){
  //           const customer_Name = this.allClients.find(c=>c.key == this.newProjectSupportForm.get(['client_key'])?.value)?.username

  //           const newSupport:ProjectSupport={
  //             projectKey:projectDetails.key || '',
  //             projectTitle:projectDetails.title,
  //             startDate:`${new Date(this.newProjectSupportForm.get(['start_date'])?.value).getMonth()+1}/${new Date(this.newProjectSupportForm.get(['start_date'])?.value).getDate()}/${new Date(this.newProjectSupportForm.get(['start_date'])?.value).getFullYear()}`,
  //             endDate:`${new Date(this.newProjectSupportForm.get(['end_date'])?.value).getMonth()+1}/${new Date(this.newProjectSupportForm.get(['end_date'])?.value).getDate()}/${new Date(this.newProjectSupportForm.get(['end_date'])?.value).getFullYear()}`,
  //             status:SupportStatus.RUNNING,
  //             createdByKey:this.currentUser.key,
  //             createdByName:this.currentUser.username,
  //             managerID:projectDetails.managerID,
  //             managerName:projectDetails.managerName,
  //             periority : this.newProjectSupportForm.get(['periority'])?.value,
  //             customerKey:this.newProjectSupportForm.get(['client_Key'])?.value,
  //             customerName:!!customer_Name? customer_Name : ""
  //           }
  //           if(!!this.newProjectSupportForm.get(['notes'])?.value){
  //             newSupport.notes = this.newProjectSupportForm.get(['notes'])?.value;
  //           }
  //           if(!!projectDetails.PMID){
  //             newSupport.PMID = projectDetails.PMID;
  //             newSupport.PMName = projectDetails.PMName;
  //           }
        
           
            
  //           this._db.createNewProjectSupport(newSupport).then(()=>{
  //             const processes = this.newProjectSupportForm.get(['proceses'])?.value
  //             if(!!processes && processes.length > 0){
  //               for ( let i in processes){
  //                 const newProcessSupport:ProcessSupport = {
  //                   project_key:projectDetails.key || '',
  //                   project_title:projectDetails.title,
  //                   processKey:processes[i].key,
  //                   processTitle:processes[i].title,
  //                   status:SupportStatus.RUNNING,
  //                   start_date:this.newProjectSupportForm.get(['start_date'])?.value,
  //                   end_date:this.newProjectSupportForm.get(['end_date'])?.value,
  //                   managerID:projectDetails.managerID,
  //                   managerName:projectDetails.managerName,
  //                 }
        
  //                 if(!!projectDetails.PMID){
  //                   newProcessSupport.PMID = projectDetails.PMID;
  //                   newProcessSupport.PMName = projectDetails.PMName;
  //                 }
        
  //                 if(!!projectDetails.customerKey){
  //                   newProcessSupport.customerKey = projectDetails.customerKey;
  //                   newProcessSupport.customerName = projectDetails.customerName;
  //                 }
        
  //                 this._db.createNewProcessSupport(newProcessSupport)
                  
  //               }
  //             }
        
  //             this.newProjectSupportForm.reset();
  //             const x = this.modal;    
  //             this.Close(x)
  //             this.notify.openSnackbar('support opened' , SnackBarState.Success)
  //           })
  //         }
  //       }
  //     })
  //   }else{
  //     const customer_Name = this.allClients.find(c=>c.key == this.newProjectSupportForm.get(['client_key'])?.value)?.username
  //     const newSupport:ProjectSupport={
  //       projectKey:"",
  //       projectTitle:this.newProjectSupportForm.get(['project_title'])?.value,
  //       startDate:`${new Date(this.newProjectSupportForm.get(['start_date'])?.value).getMonth()+1}/${new Date(this.newProjectSupportForm.get(['start_date'])?.value).getDate()}/${new Date(this.newProjectSupportForm.get(['start_date'])?.value).getFullYear()}`,
  //       endDate:`${new Date(this.newProjectSupportForm.get(['end_date'])?.value).getMonth()+1}/${new Date(this.newProjectSupportForm.get(['end_date'])?.value).getDate()}/${new Date(this.newProjectSupportForm.get(['end_date'])?.value).getFullYear()}`,
  //       status:SupportStatus.RUNNING,
  //       createdByKey:this.currentUser.key,
  //       createdByName:this.currentUser.username,
  //       managerID:this.currentUser.key,
  //       managerName:this.currentUser.username,
  //       periority : this.newProjectSupportForm.get(['periority'])?.value,
  //       customerKey:this.newProjectSupportForm.get(['client_Key'])?.value,
  //       customerName:!!customer_Name? customer_Name : ""
  //     }

  //     if(!!this.newProjectSupportForm.get(['notes'])?.value){
  //       newSupport.notes = this.newProjectSupportForm.get(['notes'])?.value;
  //     }

      
  //     this._db.createNewProjectSupport(newSupport).then(()=>{  
  //       this.newProjectSupportForm.reset();
  //       const x = this.modal;    
  //       this.Close(x)
  //       this.notify.openSnackbar('support opened' , SnackBarState.Success)
  //     })
  //   }



    

  // }

  Close(content) {
    this.modalService.dismissAll(content)
  }

}
