import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, ProjectFullTeam, ProjectStatus, ProjectStructure, ProjectTeam, ProjectTypes, Status } from 'src/app/interfaces/project';
import { ProcessTeam, SUB_TASk, Task } from 'src/app/interfaces/task';
import { AccountPositions, AccountRoles, Client, Department, Partner, User } from 'src/app/interfaces/user';
import { DurationCalculationService } from 'src/app/services/duration-calculation.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from '../snackbar/snackbar.component';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ProjectComments } from 'src/app/interfaces/comments';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SupportPeriority } from 'src/app/interfaces/client-ticket';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  @ViewChild('f') newTaskForm: NgForm;
  @ViewChild('supportModal') modal;

  projectDetails: Project;

  currentUser: User;
  selectedStatus: string;
  // totalTaskRemaning:number[] = []

  isManager: boolean;
  isProjectManager: boolean;

  projectEditMode: boolean = false;
  DevOnEditMode: boolean = false;
  customerInfoEditMode: boolean = false;

  loggedInID: string;
  devs: User[] = [];
  admins: User[] = [];
  project_team_mempers: string[] = [];
  project_business_analysis: string[] = [];
  project_support_team: string[] = [];


  PMs: User[] = [];
  BAs: User[] = [];
  support_team: User[] = [];
  TLeads: User[] = [];


  project_manager: string;
  tech_leads: string;
  business_analysis: string;

  searchKey: string;
  filterdTasks: Task[] = []
  taskEditMode: boolean = false;

  devTasksList: Task[] = []

  newProcessForm: FormGroup;

  newProcess: SUB_TASk;

  mySubTasks: SUB_TASk[] = [];
  filterdSub_Tasks: SUB_TASk[] = []

  // newProjectComment:ProjectComments;
  // projectComments:ProjectComments[] = [] ;

  closeResult: string;

  AllClients: Partner[] = [];
  client: Client;

  projectStatus: ProjectStatus[] = [];
  projectTypes: ProjectTypes[] = [];
  projectFullTeam: ProjectFullTeam[] = []
  ProjectStructureEnum = ProjectStructure;
  departmentEnum = Department;
  accPositionEnum = AccountPositions;
  userPerms: UserPermissions[] = [];
  DepartmentEnum = Department;
  AccountRolesEnum = AccountRoles;
  newProjectSupportForm: FormGroup = new FormGroup({
    'title': new FormControl(null, Validators.required),
    'start_date': new FormControl(null, Validators.required),
    'end_date': new FormControl(null, Validators.required),
    'proceses': new FormControl(null, Validators.required),
    'periority': new FormControl(null, Validators.required),
    'notes': new FormControl(null)
  })

  supportPeriorityEnum = SupportPeriority;

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    ['clean']                                         // remove formatting button
  ];

  sidebarVisible1 = false;

  quillOPT = {
    toolbar: this.toolbarOptions
  }
  items = [
    {
      label: 'New',
      icon: 'pi pi-fw pi-plus',
    },
    {
      label: 'Delete',
      icon: 'pi pi-fw pi-trash'
    }
  ]
  newServerApi = environment.newServerApi


  constructor(private _db: DatabaseService,
    private _auth: AuthApiService,
    private route: ActivatedRoute,
    private dCalc: DurationCalculationService,
    private router: Router,
    private notify: NotificationService,
    private modalService: NgbModal) { }

  ngOnInit(): void {

    // this.newProjectComment= {
    //   comment:'',
    //   commenterKey:'',
    //   commenterName:'',
    //   projectKey:'',
    //   projectName:'',
    // }

    this.newProcess = {
      title: '',
      desc: '',
      start_date: this._db.getDateFormatted(new Date()),
      end_date: this._db.getDateFormatted(new Date()),
      ex_duration: 1,
      project_key: "",
      project_title: "",
      status: Status.SCHEDULED,
    }




    this._auth.user.subscribe(
      (user) => {
        if (!!user) {
          this.currentUser = user;
          if (user.department == Department.MANAGEMENT) {
            this.isManager = true;
            this.isProjectManager = false;


          } else if (user.department == Department.TECHNICAL_TEAM && user.accPosition != AccountPositions.MANAGER) {
            this.isManager = false;
            this.isProjectManager = false;
            this.loggedInID = user.key
          } else if (user.department == Department.TECHNICAL_TEAM && user.accPosition == AccountPositions.MANAGER) {
            this.isProjectManager = true;
            this.isManager = false;
            this.getUserPermissions();
          } else if (user.department == Department.ADMINSTRATION && user.accRole == AccountRoles.ADMIN) {
            this.getUserPermissions();
            this.isManager = false;
            this.isProjectManager = false;
            this.loggedInID = user.key
          }
        } else {
          console.log("You Are Not Logged In User");
        }
      }
    )

    this.getprojectDetails();



    this.newProcessForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'desc': new FormControl(null, Validators.required),
      'start_date': new FormControl(null, Validators.required),
      'end_date': new FormControl(null, Validators.required),
      'ex_duration': new FormControl(null, Validators.required),
      'project_business_analysis': new FormControl(null),
      'tech_leads': new FormControl({ value: null, disabled: true }, Validators.required),
      'project_team_mempers': new FormControl(null),
      'support_team_mempers': new FormControl(null)
    })

    this.newProcessForm.controls.ex_duration.valueChanges.subscribe(val => {
      this.newProcess.ex_duration = val;
      this.endDateCalculation()
    });

    this.newProcessForm.controls.start_date.valueChanges.subscribe(val => {
      this.newProcess.start_date = this._db.getDateFormatted(val);
      this.endDateCalculation()
    });

  }


  onEditPartner() {
    this._db.getAllPartners(false).subscribe(clients => {
      if (clients['status'] == ResStatus.CRUD) {
        this.AllClients = clients['data'];
      }
    })
  }

  getprojectDetails() {
    const projectID = this.route.snapshot.params.id
    this._db.getProjectByID(projectID).subscribe(
      (data) => {
        this.projectDetails = data['data'];
        console.log(this.projectDetails);
        if (this.currentUser.department == Department.TECHNICAL_TEAM && this.currentUser.accPosition == AccountPositions.MANAGER) {
          if (this.projectDetails.PMID != this.currentUser.key) {
            console.log('Access Denied');
            this._db.createSystemLogs(
              `${this.currentUser.username} Tried To Access Project ${this.projectDetails.title} At ${new Date().toLocaleString()}`,
              `${this.currentUser.key} Tried To Access Project ${this.projectDetails.key} At ${new Date().toLocaleString()}`,
              this.currentUser.key || '',
              this.currentUser.username,
              'Faild'
            ).subscribe(res => {
              this.notify.openSnackbar(`You Don't Have Permission To Access This Project , If you already assigned to this project please contact system Administration`, SnackBarState.Warning, 10000)
              this.router.navigate(['/'])
            })
          }
        } else if (this.currentUser.department == Department.TECHNICAL_TEAM && this.currentUser.accPosition != AccountPositions.MANAGER) {
          const dev = this.projectDetails.Devs_mempers?.find(dev => dev.key == this.currentUser.key)
          const ba = this.projectDetails.BAsTeam?.find(ba => ba.key == this.currentUser.key)
          if (!dev && !ba) {
            console.log('Access Denied');
            this._db.createSystemLogs(
              `${this.currentUser.username} Tried To Access Project ${this.projectDetails.title} At ${new Date().toLocaleString()}`,
              `${this.currentUser.key} Tried To Access Project ${this.projectDetails.key} At ${new Date().toLocaleString()}`,
              this.currentUser.key || '',
              this.currentUser.username,
              'Faild'
            ).subscribe(res => {
              this.notify.openSnackbar(`You Don't Have Permission To Access This Project , If you already assigned to this project please contact system Administration`, SnackBarState.Warning, 10000)
              this.router.navigate(['/'])
            })
          }
        }


        if (this.projectDetails.customerPhone) {
          const newphone: any = this.projectDetails.customerPhone
          this.projectDetails.customerPhone = JSON.parse(newphone)
        }
        this.getProjectProcesses();
      },
      (err) => console.log(err)
    )
  }


  getProjectProcesses() {
    this._db.getProjectProcess(this.projectDetails.key || '').subscribe(
      (data) => {
        if (data['status'] == ResStatus.CRUD) {
          this.mySubTasks = data['data'];
          this.filterdSub_Tasks = this.mySubTasks
        }
      }
    )
  }



  editProject() {
    this.projectEditMode = true;
    this.customerInfoEditMode = false;
    this.DevOnEditMode = false;
    this._db.getAllProjectStatus().subscribe(s => {
      if (s['status'] == ResStatus.CRUD) {
        this.projectStatus = s['data'];
        this.projectStatus = this._db.projectStatusRearrange(this.projectStatus);
      }
    })

    this._db.getAllProjectTypes().subscribe(t => {
      if (t['status'] == ResStatus.CRUD) {
        this.projectTypes = t['data'];
      }
    })


  }

  saveEditedProject() {
    this._db.updateProject(this.projectDetails).subscribe(p => {
      if (p['status'] == ResStatus.CRUD) {
        this.notify.openSnackbar('Project Edited Successfully', SnackBarState.Success)
        this.projectEditMode = false;
        this.customerInfoEditMode = false;
        this.getprojectDetails();
      }
    }, err => {
      console.log(err);
      this.notify.openSnackbar('Somthing Wrong While Editing Project', SnackBarState.Error)
    })
  }


  deletProject() {
    this.notify.openDialog(
      'Delete Project?',
      `Are you sure you want to delete This Project?`,
      false,
      '*Deleteing this project will delete also all related tasks and will not be restored',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deleteProject(this.projectDetails.key).subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this._db.createSystemLogs(`${this.currentUser.username} Deleted ${this.projectDetails.title}`, `${this.currentUser.key} Deleted ${this.projectDetails.key}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe(res => {
              }, console.log)
              this.notify.openSnackbar('Project Deleted Successfully', SnackBarState.Success)
              this.router.navigate(['/manager/projects'])
            } else {
              this._db.createSystemLogs(`${this.currentUser.username} Deleted ${this.projectDetails.title}`, `${this.currentUser.key} Deleted ${this.projectDetails.key}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
              }, console.log)
              console.log(res['data']);
              this.notify.openSnackbar('Somthing Wrong While Deleting Project', SnackBarState.Error)
            }
          }, err => {
            console.log(err)
            this._db.createSystemLogs(`${this.currentUser.username} Deleted ${this.projectDetails.title}`, `${this.currentUser.key} Deleted ${this.projectDetails.key}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
            }, console.log)
          })
        } else {
          this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });



  }


  onEditModeProjectDateCalculation() {
    const start = `${new Date(this.projectDetails.start_date).getMonth() + 1}/${new Date(this.projectDetails.start_date).getDate()}/${new Date(this.projectDetails.start_date).getFullYear()}`
    this.projectDetails.end_date = this.dCalc.projectEndDateCalculation(start, this.projectDetails.duration)
  }

  editDevs() {
    this.DevOnEditMode = true;
    this.projectEditMode = false;
    this.customerInfoEditMode = false;
    this._auth.getUserByFilter(Department.TECHNICAL_TEAM).subscribe(devs => {
      if (devs['status'] == ResStatus.CRUD) {
        this.devs = devs['data'].filter(u => u.accPosition != AccountPositions.MANAGER &&
          u.accPosition != AccountPositions.Team_Leader)
        this.BAs = devs['data'].filter(u => u.accPosition != AccountPositions.MANAGER)
        this.support_team = devs['data'].filter(u => u.accRole == AccountRoles.SUPPORT)
        this.BAs = this.BAs.sort((a, b) => {
          return compare(a.username, b.username, true);
        })
        this.devs = this.devs.sort((a, b) => {
          return compare(a.username, b.username, true);
        })
        this.support_team = this.support_team.sort((a, b) => {
          return compare(a.username, b.username, true);
        })
      }
    })


    this._auth.getUserByFilter(Department.TECHNICAL_TEAM, AccountRoles.Automation_Engineer, AccountPositions.Team_Leader).subscribe(tls => {
      if (tls['status'] == ResStatus.CRUD) {
        this.TLeads = tls['data']
        this.TLeads = this.TLeads.sort((a, b) => {
          return compare(a.username, b.username, true);
        })
      }
    })

    const getPMsSub: Subscription = this._auth.getUserByFilter(Department.TECHNICAL_TEAM, AccountRoles.Automation_Engineer, AccountPositions.MANAGER).subscribe(pms => {
      getPMsSub.unsubscribe();
      if (pms['status'] == ResStatus.CRUD) {
        this.PMs = pms['data']
        this.PMs = this.PMs.sort((a, b) => {
          return compare(a.username, b.username, true);
        })
      }

      const getMansSub: Subscription = this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(mans => {
        getMansSub.unsubscribe();
        if (mans['status'] == ResStatus.CRUD) {
          mans['data'].map(m => this.PMs.push(m))
        }
        this.PMs = this.PMs.sort((a, b) => {
          return compare(a.username, b.username, true);
        })
      })
    })


    if (!!this.projectDetails.Devs_mempers) {
      for (let i in this.projectDetails.Devs_mempers) {
        this.project_team_mempers.push(this.projectDetails.Devs_mempers[i].key)
      }
    }

    if (!!this.projectDetails.OtherTeam && this.projectDetails.OtherTeam.length > 0) {
      for (let i in this.projectDetails.OtherTeam) {
        this.project_support_team.push(this.projectDetails.OtherTeam[i].key)
      }
    }

    if (!!this.projectDetails.BAsTeam) {
      for (let ba in this.projectDetails.BAsTeam) {
        this.project_business_analysis.push(this.projectDetails.BAsTeam[ba].key)
      }
    }

    if (!!this.projectDetails.Tech_leadID) {
      this.tech_leads = this.projectDetails.Tech_leadID
    }
    if (!!this.projectDetails.PMID) {
      this.project_manager = this.projectDetails.PMID
    }

  }



  saveEditDevs() {
    let projectTeam: ProjectTeam[] = [];


    if (!!this.project_manager) {
      const pmStructure: ProjectTeam = {
        user_team_id: this.project_manager,
        project_structure_id: ProjectStructure.Project_Manager
      }
      projectTeam.push(pmStructure)
    }

    if (!!this.tech_leads) {
      const pmStructure: ProjectTeam = {
        user_team_id: this.tech_leads,
        project_structure_id: ProjectStructure.Tech_Lead
      }
      projectTeam.push(pmStructure)
    }

    if (!!this.project_business_analysis && this.project_business_analysis.length > 0) {
      const bas = this.project_business_analysis;
      for (let i in bas) {
        const pmStructure: ProjectTeam = {
          user_team_id: bas[i],
          project_structure_id: ProjectStructure.Analysis
        }
        projectTeam.push(pmStructure)
      }
    }


    if (!!this.project_team_mempers && this.project_team_mempers.length > 0) {
      const devs = this.project_team_mempers;
      for (let i in devs) {
        const pmStructure: ProjectTeam = {
          user_team_id: devs[i],
          project_structure_id: ProjectStructure.Developer
        }
        projectTeam.push(pmStructure)
      }
    }

    if (!!this.project_support_team && this.project_support_team.length > 0) {
      const devs = this.project_support_team;
      for (let i in devs) {
        const pmStructure: ProjectTeam = {
          user_team_id: devs[i],
          project_structure_id: ProjectStructure.SUPPORT
        }
        projectTeam.push(pmStructure)
      }
    }


    const projectID = this.route.snapshot.params.id

    this._db.editProjectTeam(projectTeam, projectID).subscribe(res => {
      console.log(res);
      this.notify.openSnackbar('Project Team Members Edited Successfully', SnackBarState.Success)
      this.DevOnEditMode = false;
      this.getprojectDetails();
    })
  }


  cancelEdit() {
    this.DevOnEditMode = false;
    this.projectEditMode = false;
    this.customerInfoEditMode = false;
    this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  }




  // projectTotalHoursRemainingCalc(){

  //   this.projectTotalHoursRemaining = this.totalTaskRemaning.reduce((a,b)=>a+b)
  //   return this.projectTotalHoursRemaining

  // }

  openAddProcessDialog() {
    this.newProcessForm.patchValue({
      'tech_leads': this.projectDetails.Tech_leadName
    })
    this.newProcess.Tech_leadName = this.projectDetails.Tech_leadName
    this.newProcess.Tech_leadID = this.projectDetails.Tech_leadID
    this._db.getProjectTeam(this.projectDetails.key).subscribe(team => {
      if (team['status'] == ResStatus.CRUD) {
        this.projectFullTeam = team['data']
      }
    })
  }


  createNewProcess() {

    const newProcess: SUB_TASk = {
      title: this.newProcessForm.value['title'],
      desc: this.newProcessForm.value['desc'],
      start_date: this._db.getDateFormatted(this.newProcessForm.value['start_date']),
      end_date: this._db.getDateFormatted(this.newProcessForm.value['end_date']),
      ex_duration: this.newProcessForm.value['ex_duration'],
      project_key: this.projectDetails.key || "",
      project_title: this.projectDetails.title,
      status: Status.SCHEDULED,
    }

    let processTeam: ProcessTeam[] = []
    if (!!this.newProcessForm.value['project_business_analysis']) {
      const Analysis = this.newProcessForm.value['project_business_analysis'];
      for (let i in Analysis) {
        const pTEam: ProcessTeam = {
          project_team_id: Analysis[i]
        }
        processTeam.push(pTEam)
      }
    }

    if (!!this.newProcessForm.value['project_team_mempers']) {
      const devs = this.newProcessForm.value['project_team_mempers'];
      for (let i in devs) {
        const pTEam: ProcessTeam = {
          project_team_id: devs[i]
        }
        processTeam.push(pTEam)
      }
    }


    if (!!this.newProcessForm.value['support_team_mempers']) {
      const devs = this.newProcessForm.value['support_team_mempers'];
      for (let i in devs) {
        const pTEam: ProcessTeam = {
          project_team_id: devs[i]
        }
        processTeam.push(pTEam)
      }
    }


    if (!!this.projectDetails.Tech_leadID) {
      this.newProcess.Tech_leadID = this.projectDetails.Tech_leadID;
      this.newProcess.Tech_leadName = this.projectDetails.Tech_leadName;
    }
    newProcess.OtherTeam = processTeam;
    this._db.createNewProcess(newProcess).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.notify.openSnackbar(`Process ${newProcess.title} Created Successfully`, SnackBarState.Success)
        this.newProcessForm.reset();
        this.modalService.dismissAll(this.modal)
        this.getProjectProcesses();
        this._db.createSystemLogs(`${this.currentUser.username} Created New Process ${newProcess.title} in project ${newProcess.project_title}`, `${this.currentUser.key} Created New Process ${res['data']['key']} in project ${newProcess.project_key}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe(res => {
        }, console.log)
      } else {
        this._db.createSystemLogs(`${this.currentUser.username} Created New Process ${newProcess.title} in project ${newProcess.project_title} => ${JSON.stringify(res['data'])} => ${JSON.stringify(newProcess)} `, `${this.currentUser.key} Created New Process ${newProcess.title} in project ${newProcess.project_key}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
        }, console.log)
        this.notify.openSnackbar(`Error, Please Contact System Adminstrator`, SnackBarState.Warning)
      }
    }, err => {
      this._db.createSystemLogs(`${this.currentUser.username} Created New Process ${newProcess.title} in project ${newProcess.project_title} => ${JSON.stringify(err['error']['data'])} => ${JSON.stringify(newProcess)}`, `${this.currentUser.key} Created New Process ${newProcess.title} in project ${newProcess.project_key}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
      }, console.log)
      this.notify.openSnackbar(`Error, Please Contact System Adminstrator`, SnackBarState.Warning)
    })

  }


  resetForm() {
    this.newProcessForm.reset()
  }

  endDateCalculation() {
    const start = `${new Date(this.newProcess.start_date).getMonth() + 1}/${new Date(this.newProcess.start_date).getDate()}/${new Date(this.newProcess.start_date).getFullYear()}`
    this.newProcess.end_date = this._db.getDateFormatted(this.dCalc.SubTaskEndDateCalculation(start, this.newProcess.ex_duration))
    this.newProcessForm.patchValue({
      'end_date': this._db.getDateFormatted(this.newProcess.end_date)
    })
    this.newProcessForm.value['end_date'] = this._db.getDateFormatted(this.newProcess.end_date)
  }
  searchProcess() {

    this.mySubTasks = this.filterdSub_Tasks

    if (!!this.searchKey && this.searchKey.length > 0) {
      this.mySubTasks = this.mySubTasks.filter(process => process.title.toLowerCase().includes(this.searchKey.toLowerCase()))
    } else {
      this.mySubTasks = this.filterdSub_Tasks
    }
  }

  deleteProcess(process: SUB_TASk) {

    this.notify.openDialog(
      `Delete ${process.title}?`,
      `Are you sure you want to delete This Process?`,
      false,
      '*Deleteing this Process will not be restored',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deleteProcess(process.key).subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this._db.createSystemLogs(`${this.currentUser.username} Deleted Process ${process.title} In Project ${this.projectDetails.title}`, `${this.currentUser.key} Deleted ${process.key} Process ${process.title} In Project ${this.projectDetails.key}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe(res => {
              }, console.log)
              this.notify.openSnackbar('Process Deleted Successfully', SnackBarState.Success)
            } else {
              this._db.createSystemLogs(`${this.currentUser.username} Deleted ${process.title} Process ${process.title} In Project ${this.projectDetails.title}`, `${this.currentUser.key} Deleted ${process.key} Process ${process.title} In Project ${this.projectDetails.key}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
              }, console.log)
              console.log(res['data']);
              this.notify.openSnackbar('Somthing Wrong While Deleting Project', SnackBarState.Error)
            }
          }, err => {
            console.log(err)
            this._db.createSystemLogs(`${this.currentUser.username} Deleted ${process.title} Process ${process.title} In Project ${this.projectDetails.title}`, `${this.currentUser.key} Deleted ${process.key} Process ${process.title} In Project ${this.projectDetails.key}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
            }, console.log)
          })
        } else {
          this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }


  editCustomerInfo() {
    this.DevOnEditMode = false;
    this.projectEditMode = false;
    this.customerInfoEditMode = true;
  }




  // createProjectComment(){
  //   if(!this.newProjectComment.comment || this.newProjectComment.comment.length <= 0){
  //     this.notify.openSnackbar('Please Write Somthing ' , SnackBarState.Error)
  //   }else{
  //     this.newProjectComment.projectKey = this.projectDetails.key || '';
  //     this.newProjectComment.projectName = this.projectDetails.title;
  //     this.newProjectComment.commenterKey = this.currentUser.key || '';
  //     this.newProjectComment.commenterName = this.currentUser.username;
  //     this.db.createProjectComment(this.newProjectComment).then(
  //       ()=>{
  //         this.sendNotificationToManager()
  //         this.newProjectComment= {
  //           comment:'',
  //           commenterKey:'',
  //           commenterName:'',
  //           projectKey:'',
  //           projectName:'',
  //         }
  //       }
  //     )
  //   }
  // }

  // sendNotificationToManager(){
  //   for (let i in this.projectDetails.Devs_mempers){
  //     if(i != this.newProjectComment.commenterKey){
  //       const newNotification:Notifying = {
  //         title : `Added New Comment`,
  //         body : `${this.newProjectComment.commenterName} Commented On ${this.newProjectComment.projectName} Project`,
  //         receverKey : i, 
  //         receverName : this.projectDetails.Devs_mempers[i] , 
  //         senderKey : this.newProjectComment.commenterKey,
  //         senderName: this.newProjectComment.commenterName,
  //         senderImg: this.currentUser.photoURL ? this.currentUser.photoURL :  this.currentUser.gender == Gender.MALE ? 'https://bootdey.com/img/Content/avatar/avatar7.png' : this.currentUser.gender == Gender.FEMALE ? 'https://i2.wp.com/nofiredrills.com/wp-content/uploads/2016/10/myavatar.png?fit=400%2C400&ssl=1' : 'https://bootdey.com/img/Content/avatar/avatar7.png',
  //         redirection:`/dev/myprojects/${this.newProjectComment.projectKey}`
  //       }
  //       this._message.createnotification(newNotification)
  //     }
  //   }

  //   for (let ba in this.projectDetails.BAsTeam){
  //     if(ba != this.newProjectComment.commenterKey){
  //       const newNotification:Notifying = {
  //         title : `Added New Comment`,
  //         body : `${this.newProjectComment.commenterName} Commented On ${this.newProjectComment.projectName} Project`,
  //         receverKey : ba, 
  //         receverName : this.projectDetails.BAsTeam[ba], 
  //         senderKey : this.newProjectComment.commenterKey,
  //         senderName: this.newProjectComment.commenterName,
  //         senderImg: this.currentUser.photoURL ? this.currentUser.photoURL :  this.currentUser.gender == Gender.MALE ? 'https://bootdey.com/img/Content/avatar/avatar7.png' : this.currentUser.gender == Gender.FEMALE ? 'https://i2.wp.com/nofiredrills.com/wp-content/uploads/2016/10/myavatar.png?fit=400%2C400&ssl=1' : 'https://bootdey.com/img/Content/avatar/avatar7.png',
  //         redirection:`/dev/myprojects/${this.newProjectComment.projectKey}`
  //       }
  //       this._message.createnotification(newNotification)
  //     }
  //   }

  //   if(this.projectDetails.Tech_leadID != this.newProjectComment.commenterKey){
  //     const TeckLeadNewNotification:Notifying = {
  //       title : `Added New Comment`,
  //       body : `${this.newProjectComment.commenterName} Commented On ${this.newProjectComment.projectName} Project`,
  //       receverKey : this.projectDetails.Tech_leadID || "", 
  //       receverName : this.projectDetails.Tech_leadName || "", 
  //       senderKey : this.newProjectComment.commenterKey,
  //       senderName: this.newProjectComment.commenterName,
  //       senderImg: this.currentUser.photoURL ? this.currentUser.photoURL :  this.currentUser.gender == Gender.MALE ? 'https://bootdey.com/img/Content/avatar/avatar7.png' : this.currentUser.gender == Gender.FEMALE ? 'https://i2.wp.com/nofiredrills.com/wp-content/uploads/2016/10/myavatar.png?fit=400%2C400&ssl=1' : 'https://bootdey.com/img/Content/avatar/avatar7.png',
  //       redirection:`/manager/projects/${this.newProjectComment.projectKey}`
  //     }
  //     this._message.createnotification(TeckLeadNewNotification)
  //   }

  //   if(this.projectDetails.PMID != this.newProjectComment.commenterKey){

  //     const PMNewNotification:Notifying = {
  //       title : `Added New Comment`,
  //       body : `${this.newProjectComment.commenterName} Commented On ${this.newProjectComment.projectName} Project`,
  //       receverKey : this.projectDetails.PMID || "", 
  //       receverName : this.projectDetails.PMName || "", 
  //       senderKey : this.newProjectComment.commenterKey,
  //       senderName: this.newProjectComment.commenterName,
  //       senderImg: this.currentUser.photoURL ? this.currentUser.photoURL :  this.currentUser.gender == Gender.MALE ? 'https://bootdey.com/img/Content/avatar/avatar7.png' : this.currentUser.gender == Gender.FEMALE ? 'https://i2.wp.com/nofiredrills.com/wp-content/uploads/2016/10/myavatar.png?fit=400%2C400&ssl=1' : 'https://bootdey.com/img/Content/avatar/avatar7.png',
  //       redirection:`/manager/projects/${this.newProjectComment.projectKey}`
  //     }
  //     this._message.createnotification(PMNewNotification)
  //   }

  //   if(this.projectDetails.managerID != this.newProjectComment.commenterKey){
  //     const managerNewNotification:Notifying = {
  //       title : `Added New Comment`,
  //       body : `${this.newProjectComment.commenterName} Commented On ${this.newProjectComment.projectName} Project`,
  //       receverKey : this.projectDetails.managerID || "", 
  //       receverName : this.projectDetails.managerName || "", 
  //       senderKey : this.newProjectComment.commenterKey,
  //       senderName: this.newProjectComment.commenterName,
  //       senderImg: this.currentUser.photoURL ? this.currentUser.photoURL :  this.currentUser.gender == Gender.MALE ? 'https://bootdey.com/img/Content/avatar/avatar7.png' : this.currentUser.gender == Gender.FEMALE ? 'https://i2.wp.com/nofiredrills.com/wp-content/uploads/2016/10/myavatar.png?fit=400%2C400&ssl=1' : 'https://bootdey.com/img/Content/avatar/avatar7.png',
  //       redirection:`/manager/projects/${this.newProjectComment.projectKey}`
  //     }
  //     this._message.createnotification(managerNewNotification)
  //   }
  // }


  // deleteComment(comment:ProjectComments){
  //   this.notify.openDialog(
  //     'Delete Comment?',
  //     `Are you sure you want to delete This comment?`,
  //     false,
  //     '',
  //     true,
  //     false).subscribe(response => {
  //       if (response) {
  //         this.db.deleteProjectComment(comment.key || '').then(
  //           ()=>{
  //             this.notify.openSnackbar('Comment Deleted Successfully', SnackBarState.Success)
  //           }
  //         ).catch(err=>console.log(err))
  //       } else {
  //         this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  //       }
  //     });
  // }




  open(content) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  Close(content) {
    this.modalService.dismissAll(content)
  }
  getUserPermissions() {

    this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms => {
      if (perms['status'] == ResStatus.CRUD) {
        this.userPerms = perms['data'];
      }
    })
  }
  checkIfHasPerm(perm_id) {
    const checking = this.userPerms.find(p => p.permission_id == perm_id)
    if (!!checking) {
      return true;
    } else {
      return false;
    }
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


/*
                  _  
   /\     /\/\   |_| 
__/--\__ /    \  |  \
  01141736576
*/

/*
 <*)
  ||______
   (______}
     |  |
     ^  ^
*/