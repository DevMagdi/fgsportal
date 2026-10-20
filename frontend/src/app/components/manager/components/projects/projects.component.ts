import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import {Project, ProjectStatus, ProjectStructure, ProjectTeam, Status } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Department, Partner, User } from 'src/app/interfaces/user';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { DurationCalculationService } from 'src/app/services/duration-calculation.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  @ViewChild('mymodal') modal;
  // After Edit
  newProjectForm:FormGroup = new FormGroup({
    'title' : new FormControl(null , Validators.required),
    'desc' : new FormControl(null),
    'duration' : new FormControl(1 , Validators.required),
    'start_date' : new FormControl(null , Validators.required),
    'end_date' : new FormControl({value: null, disabled: true} , Validators.required),
    'budget' : new FormControl(null),
    'type' : new FormControl(null, Validators.required),
    'partner' : new FormControl(null, Validators.required),
    'pm' : new FormControl(null),
    'ba' : new FormControl(null),
    'tl' : new FormControl(null),
    'devs' : new FormControl(null),
    'support' : new FormControl(null),
  })

  myProjects:Project[] = []
  filteredProjectrs:Project[] = [];
  
  allPartners:Partner[] = [];
  allUsers:User[] = [];
  projectTypes:any[] = [];

  devs:User[] = [] ;
  support_team:User[] = [] ;
  PMs:User[] = [] ;
  BAs:User[] = [] ;
  TLeads:User[] = [] ;
  
  projectStatus:ProjectStatus[] = [];
  
  // before Edit
  // @ViewChild('f') newProjectForm: NgForm;
  submitted = false;

  newProject:Project;


  project_team_mempers:string[] = []
  project_business_analysis:string[] = []

  tech_leads:string;
  business_analysis:string;
  project_manager:string ;

  
  
  managerId:string = ''
  managerName:string = ''
  
  currentUser:User ;
  
  
  PMID: string;
  
  searchKey:string;
  // endDate:any;
  filtersList:Status[] = [];
  StatusEnum = Status;

  closeResult: string;
  DepartmentEnum = Department;
  accPositionEnum = AccountPositions;

  errors:any;
  
  sidebarVisible1=false;
  userPerms:UserPermissions[]=[];
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private dCalc:DurationCalculationService,
              private modalService: NgbModal,
              private notify:NotificationService,
              private mes:MessagingService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(
      (user)=>{
        if(!!user){
          this.currentUser = user ; 
          if(user.department == Department.MANAGEMENT){
            this.managerId = user.key;
            this.managerName = user.username;
            this.getProjects();
            this.getUserPermissions();
          }else if(user.department == Department.TECHNICAL_TEAM && user.accPosition == AccountPositions.MANAGER){
            this.getPmProjects();
            this.getUserPermissions();
          }else{
            // this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
            //   if(perms['status'] == ResStatus.CRUD){
            //     this.userPerms = perms['data'];               
            //     const checking = this.userPerms.find(p=>p.permission_id == 13)
            //     if(!!checking){
            //       this.getProjects();
            //     }
            //   }
            // },err=>{
            //   console.log(err); 
            // })
            this.getUserPermissions();
          }
        }
      }
    )

  }


  getUserPermissions(){
    this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms=>{
      if(perms['status'] == ResStatus.CRUD){
        this.userPerms = perms['data'];               
        const checking = this.userPerms.find(p=>p.permission_id == 13)
        if(!!checking){
          this.getProjects();
        }
      }
    },err=>{
      console.log(err); 
    })
  }

  getPmProjects(){
    this._db.getPMMyProjects(this.currentUser.key || '').subscribe(projects=>{  
      if(projects['status'] == ResStatus.CRUD){
        console.log(projects['data']);
        
        this.myProjects = projects['data'];
        this.filteredProjectrs = this.myProjects;
      }
    },console.log)
  }

  getProjects(){
    this._db.getAllProjects().subscribe(projects=>{              
      if(projects['status'] == ResStatus.CRUD){
        const data = projects['data']
        this.myProjects = data.filter(p=>p.status != Status.CLOSED)
        console.log(this.myProjects);
        
        this.filteredProjectrs = this.myProjects;
        // console.log(this.filteredProjectrs);            

      }
      },console.log)
  }


  // getProjectStatus(){
  //   this._db.getAllProjectStatus().subscribe(res=>{
  //     if(res['status'] == ResStatus.CRUD){
  //       this.projectStatus = res['data']
  //     }
  //   })
  // }

  addProject(){
    console.log(this.newProjectForm.value);
    
    const newProject:Project = {
      title : this.newProjectForm.get(['title'])?.value,
      desc: this.newProjectForm.get(['desc'])?.value,
      duration: this.newProjectForm.get(['duration'])?.value,
      start_date: this.newProjectForm.get(['start_date'])?.value,
      end_date: this.newProjectForm.get(['end_date'])?.value,
      budget: this.newProjectForm.get(['budget'])?.value,
      type: this.newProjectForm.get(['type'])?.value,
      status:Status.SCHEDULED,
      partner_id :this.newProjectForm.get(['partner'])?.value
    }

    let projectTeam:ProjectTeam[] = [];


    if(!!this.newProjectForm.get(['pm'])?.value){
      const pmStructure:ProjectTeam = {
        user_team_id : this.newProjectForm.get(['pm'])?.value,
        project_structure_id : ProjectStructure.Project_Manager
      }
      projectTeam.push(pmStructure)
    }
    
    if(!!this.newProjectForm.get(['tl'])?.value){
      const pmStructure:ProjectTeam = {
        user_team_id : this.newProjectForm.get(['tl'])?.value,
        project_structure_id : ProjectStructure.Tech_Lead
      }
      projectTeam.push(pmStructure)
    }
    
    if(!!this.newProjectForm.get(['ba'])?.value){
      const bas = this.newProjectForm.get(['ba'])?.value;
      for(let i in bas){
        const pmStructure:ProjectTeam = {
          user_team_id : bas[i],
          project_structure_id : ProjectStructure.Analysis
        }
        projectTeam.push(pmStructure)
      }
    }


    if(!!this.newProjectForm.get(['devs'])?.value){
      const devs = this.newProjectForm.get(['devs'])?.value;
      for(let i in devs){
        const pmStructure:ProjectTeam = {
          user_team_id : devs[i],
          project_structure_id : ProjectStructure.Developer
        }
        projectTeam.push(pmStructure)
      } 
    }

    if(!!this.newProjectForm.get(['support'])?.value){
      const supps = this.newProjectForm.get(['support'])?.value;
      for(let i in supps){
        const supStructure:ProjectTeam = {
          user_team_id : supps[i],
          project_structure_id : ProjectStructure.SUPPORT
        }
        projectTeam.push(supStructure)
      } 
    }

    if(!!projectTeam && projectTeam.length > 0){
      newProject.project_team = projectTeam;
    }
    console.log(newProject);
    

    this._db.createNewProject(newProject).subscribe(newP=>{
      if(newP['status'] == ResStatus.CRUD){
        this.notify.openSnackbar(`project ${newProject.title} Created Successfully`, SnackBarState.Success)
        this.newProjectForm.reset();
        this.modalService.dismissAll(this.modal)
        this.getProjects();
        this._db.createSystemLogs(`${this.currentUser.username} Created New Project ${newProject.title}` , `${this.currentUser.key} Created New Project ${newProject.key}`, this.currentUser.key || '', this.currentUser.username , 'Success').subscribe(res=>{
        },console.log)
      }else{
        this._db.createSystemLogs(`${this.currentUser.username} Created New Project ${newProject.title} ${JSON.stringify(newP)}` , `${this.currentUser.key} Created New Project ${newProject.key}`, this.currentUser.key || '', this.currentUser.username , 'Fail').subscribe(res=>{
        },console.log)
      }
    },err=>{
      this.notify.openSnackbar(`Error`,SnackBarState.Warning)
      console.log(err['error']['data'])
      this.errors = err['error']['data']
      this._db.createSystemLogs(`${this.currentUser.username} Faild To Created New Project ${newProject.title} => ${JSON.stringify(err['error']['data'])}` , `${this.currentUser.key} Created New Project ${newProject.key}`, this.currentUser.key || '', this.currentUser.username , 'Fail').subscribe(res=>{
      },console.log)
    })






  }


  getPartners(){
    this._db.getAllPartners(false).subscribe(partners=>{
      if(partners['status'] == ResStatus.CRUD){
        this.allPartners = partners['data'];
      }
    })
  }

  getAllUsers(){
    this._auth.getAllUsers().subscribe(users=>{
      if(users['status'] == ResStatus.CRUD){
        this.allUsers = users['data']
        this.getPms();
        this.getDevs();
        this.gettechLeads();
      }
    })
  }


  getTypes(){
    this._db.getAllProjectTypes().subscribe(types=>{
      if(types['status'] == ResStatus.CRUD){
        this.projectTypes = types['data']
      }
    })
  }
  
  getPms(){
    this.PMs = this.allUsers.filter(u=>u.accPosition == AccountPositions.MANAGER)
    this.PMs = this.PMs.sort((a,b)=>{
      return compare(a.username, b.username, true);
    })
  }
  getDevs(){
    this.devs = this.allUsers.filter(u=>u.department == Department.TECHNICAL_TEAM)
    this.devs = this.devs.sort((a,b)=>{
      return compare(a.username, b.username, true);
    })
    this.BAs = this.allUsers.filter(u=>u.department == Department.TECHNICAL_TEAM)
    this.BAs = this.BAs.sort((a,b)=>{
      return compare(a.username, b.username, true);
    })


    this.support_team = this.allUsers.filter(u=>u.department == Department.TECHNICAL_TEAM && u.accRole == AccountRoles.SUPPORT)
    this.support_team = this.support_team.sort((a,b)=>{
      return compare(a.username, b.username, true);
    })
  }

  gettechLeads(){
    this.TLeads = this.allUsers.filter(u=>u.department == Department.TECHNICAL_TEAM && u.accPosition == AccountPositions.Team_Leader)
    this.TLeads = this.TLeads.sort((a,b)=>{
      return compare(a.username, b.username, true);
    })
  }


  searchProject(){
    this.myProjects = this.filteredProjectrs ; 
    if(!!this.searchKey && this.searchKey.length > 0){
      this.myProjects =  this.myProjects.filter(project=> project.title.toLowerCase().includes(this.searchKey.toLowerCase()))
    }else{
      this.myProjects = this.filteredProjectrs
    }
  }


  filterProjects(){    
    this.myProjects = this.filteredProjectrs ; 
    if(this.filtersList.length > 0){
      // for (let i in this.filtersList){
      //   this.myProjects = this.myProjects.filter(project => project.status == this.filtersList[i])
      // }
      this.myProjects = [];
      for (let i in this.filteredProjectrs){
        const found = this.filtersList.find(status=>this.filteredProjectrs[i].status == status)
        if(!!found){
          this.myProjects.push(this.filteredProjectrs[i])
        }
      }


    }else{
      this.myProjects = this.filteredProjectrs; 
    }
    
  }

  // deleteproject(project:Project){
  //   this.db.deleteProject(project).then(()=>{console.log("Done");}).catch((err)=>{console.log(err);
  //   })
  // }

  endDateCalculation(){
    const startDate = this.newProjectForm.get(['start_date'])?.value
    const duration = this.newProjectForm.get(['duration'])?.value || 0
    this.newProjectForm.patchValue({
      'end_date':this.dCalc.projectEndDateCalculation(startDate , duration)
    })
  }


  open(content) {
    // this.sidebarVisible1=true;
    this.modalService.open(content, {size: 'xl', ariaLabelledBy: 'modal-basic-title',scrollable:true}).result.then((result) => {
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

  checkIfHasPerm(perm_id){
    const checking = this.userPerms.find(p=>p.permission_id == perm_id)    
    if(!!checking){
      return true;
    }else{
      return false;
    }
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}