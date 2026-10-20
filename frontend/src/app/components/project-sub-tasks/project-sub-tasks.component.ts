import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, ProjectFullTeam, ProjectStructure, Status } from 'src/app/interfaces/project';
import { ProcessFullTeam, ProcessStatus, ProcessTeam, SUB_TASk, Task, TaskStatus, TaskTeam, TaskTypeFromDB } from 'src/app/interfaces/task';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { DurationCalculationService } from 'src/app/services/duration-calculation.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { SnackBarState } from '../snackbar/snackbar.component';
import { ProcessComments } from 'src/app/interfaces/comments';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseService } from 'src/app/services/database.service';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { environment } from 'src/environments/environment';
import { Question, RateAnswers } from 'src/app/interfaces/rating';

@Component({
  selector: 'app-project-sub-tasks',
  templateUrl: './project-sub-tasks.component.html',
  styleUrls: ['./project-sub-tasks.component.scss']
})
export class ProjectSubTasksComponent implements OnInit {
  @ViewChild('f') newTaskForm: NgForm;
  @ViewChild('supportModal') modal; 

  isManager:boolean;
  isProjectManager:boolean;
  loggedInID:string;
  projectDetails:Project;

  newProcessForm:FormGroup;

  newProcess:SUB_TASk;

  mySubTasks:SUB_TASk[] = [];


  devs:User[] = [] ;
  support_team:User[] = [] ;
  PMs:User[] = [] ;
  BAs:User[] = [] ;
  TLeads:User[] = [] ;
  admins:User[] = [] ;


  processEditMode:boolean = false;


  processDetails:SUB_TASk;
  DevOnEditMode:boolean = false;

  projectTasks:Task[] = []
  onlyProjectTasks:Task[] = []
  filterdTasks:Task[] = []
  editMode:boolean[] = []
  newTask:Task;
  devTasksList:Task[] = []
  taskEditMode:boolean = false ;
  totalTasksHours:number = 0;
  remaining:number;
  projectHours:number; 



  // upload Files
  pddUrl:string ; 
  pddFile: File;
  uploadProgress:number;


  // pagination
  totalTasksRecords:number = 0 ;
  taskspage:number=1 ;

  mode: ProgressSpinnerMode = 'determinate';
  // value = 50;

  remainingInPercentage:number = 0 ;


  totalTaskRemaning:number[] = []

  searchKey:string;
  tableWithSupportMode:boolean = false;

  process_team_mempers:string[] = []
  process_business_analysis:string[] = []
  process_support_team:string[] = [];

  tech_lead:string; 
  processStatus:ProcessStatus[] = [];

  newProcessComment:ProcessComments;
  processComments:ProcessComments[] = [] ;
  currentUser:User;
  closeResult: string;

  client:User;
  newProcessSupportForm:FormGroup = new FormGroup({
    'title':new FormControl(null , Validators.required),
    'start_date':new FormControl(null , Validators.required),
    'end_date':new FormControl(null , Validators.required),
  })

  projectTeam:ProjectFullTeam[] = [];
  processTeam:ProcessFullTeam[] = [];
  ProjectStructureEnum = ProjectStructure;
  projectTeamLoading:boolean = false;
  taskTypes:TaskTypeFromDB[] = [];
  taskStatus:TaskStatus[] = [];
  taskStatusLoading:boolean = false;
  taskTypesLoading:boolean = false;
  processTeamLoading:boolean = false;
  isChecked:boolean = false;

  seniors:User[] = [];
  newServerApi = environment.newServerApi;
  uploading:boolean = false;

  displayRateForm:boolean = false;

  questions:Question[] = [];
  selectedTaskToClose:Task | undefined;
  processLoader:boolean = false;
  viewTaskForm:boolean=false;
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private route: ActivatedRoute,
              private dCalc:DurationCalculationService,
              private modalService: NgbModal,
              private router:Router,
              private notify:NotificationService) { }

  ngOnInit(): void {
    // this.getTaskProgress()
    this.newProcessComment= {
      comment:'',
      commenterKey:'',
      commenterName:'',
      processKey:'',
      processName:'',
    }



    this.newTask ={
      title:"",
      desc:"",
      empID:"",
      empName:"",
      supportID:"",
      supportName:"",
      start_date:new Date(),
      end_date:new Date(),
      ex_duration:1,
      project_key:"",
      project_title:"",
      type:'1',
      seniorToApproveID:"",
      seniorToApproveName:"",
      seniorIsMandatory:false,
      status: Status.SCHEDULED
    }
    

    this._auth.user.subscribe(
      (user)=>{
        if(!!user){
          this.currentUser = user;

          if(user.department == Department.MANAGEMENT ){
            this.isManager = true ; 
            this.isProjectManager = false;
          }else if(user.department == Department.TECHNICAL_TEAM && user.accPosition != AccountPositions.MANAGER){
            this.isManager = false;
            this.isProjectManager = false;
            this.loggedInID = user.key
          }else if(user.accPosition == AccountPositions.MANAGER && user.accPosition == AccountPositions.MANAGER){
            this.isProjectManager = true;
            this.isManager = false ; 
          }
        }else{
          console.log("You Are Not Logged In User");
        }
      }
    )

    this._auth.getUserByFilter(Department.TECHNICAL_TEAM,AccountRoles.Automation_Engineer,AccountPositions.SENIOR).subscribe(seniors=>{
      if(seniors['status'] == ResStatus.CRUD){
        this.seniors = seniors['data'];
      }else{
        this.seniors = [];
      }
    })

    // this.getCurrentProcessDetails()
    this.getCurrentProject();

    


    this.newProcessForm = new FormGroup({
      'title':new FormControl(null , Validators.required),
      'desc':new FormControl(null, Validators.required),
      'start_date':new FormControl(null, Validators.required),
      'end_date':new FormControl({value: null, disabled: true}, Validators.required),
      'ex_duration':new FormControl(null, Validators.required),
      'project_business_analysis':new FormControl(null),
      'tech_leads':new FormControl(null),
      'project_team_mempers':new FormControl(null)
    })

    this.newProcessForm.controls.ex_duration.valueChanges.subscribe(val => {
       this.newProcess.ex_duration = val;
       this.endDateCalculation()
    });

    this.newProcessForm.controls.start_date.valueChanges.subscribe(val => {
       this.newProcess.start_date = val;
       this.endDateCalculation()
    });

    
    
  }


  getCurrentProject(){
    const projectID =  this.route.snapshot.params.id
    this._db.getProjectByID(projectID).subscribe(
      (data)=>{
        this.projectDetails = data['data'];
        if(this.projectDetails.customerPhone){
          const newphone:any = this.projectDetails.customerPhone
          this.projectDetails.customerPhone = JSON.parse(newphone)
        }
        this.getCurrentProcessDetails();
      },
      (err)=>console.log(err)
    )
  }

  getProcessStatus(){
    this._db.getAllProcessStatus().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){        
        this.processStatus = res['data']
        this.processStatus = this._db.processStatusRearrange(this.processStatus);
      }
    })
  }

  getCurrentProcessDetails(){
    const processID =  this.route.snapshot.params.subTasks
    this._db.getProcessByID(processID).subscribe(data=>{
      
      if(data['status'] == ResStatus.CRUD){
        this.processDetails = data['data'];
        // console.log(this.processDetails);
          if(this.currentUser.department == Department.TECHNICAL_TEAM && this.currentUser.accPosition == AccountPositions.MANAGER){
            if(this.projectDetails.PMID != this.currentUser.key){
              console.log('Access Denied');
              this._db.createSystemLogs(
                `${this.currentUser.username} Tried To Access Project ${this.projectDetails.title} At ${new Date().toLocaleString()}`,
                `${this.currentUser.key} Tried To Access Project ${this.projectDetails.key} At ${new Date().toLocaleString()}`,
                this.currentUser.key || '',
                this.currentUser.username,
                'Faild'
              ).subscribe(res=>{
                this.notify.openSnackbar(`You Don't Have Permission To Access This Project , If you already assigned to this project please contact system Administration` , SnackBarState.Warning , 10000)
                this.router.navigate(['/']) 
              })
            }
          }else if(this.currentUser.department == Department.TECHNICAL_TEAM && this.currentUser.accPosition != AccountPositions.MANAGER){
            const dev = this.processDetails.Devs_mempers?.find(dev=>dev.key == this.currentUser.key)
            const ba = this.processDetails.BAsTeam?.find(ba=>ba.key == this.currentUser.key)
            if(!dev && !ba){
              console.log('Access Denied');
              this._db.createSystemLogs(
                `${this.currentUser.username} Tried To Access Process ${this.processDetails.title} In Project ${this.processDetails.title} At ${new Date().toLocaleString()}`,
                `${this.currentUser.key} Tried To Access Process ${this.processDetails.key} In Project ${this.processDetails.key} At ${new Date().toLocaleString()}`,
                this.currentUser.key || '',
                this.currentUser.username,
                'Faild'
              ).subscribe(res=>{
                this.notify.openSnackbar(`You Don't Have Permission To Access This Process , If you already assigned to this Process please contact system Administration` , SnackBarState.Warning , 10000)
                this.router.navigate([`/dev/myprojects/${this.projectDetails.key}`]) 
              })
            }
          }
          this.getProcessTeam()
          this.getProcessTasks()
        }
      },(err)=>{
        console.log(err);
      }
    )
  }


  endDateCalculation(){
    const end = this.onEditModeProcessDateCalculation()
    this.newProcessForm.patchValue({
      'end_date' : this._db.getDateFormattedYearMonthDay(end)
    }) 
  }

  taskEndDateCalculation(){    
    this.newTask.end_date = this._db.getDateFormattedYearMonthDay(this.dCalc.taskEndDateCalculation(this.newTask)) 
  }


  resetForm(){
    this.newProcessForm.reset()
  }

  getProcessTasks(){
    const processID =  this.route.snapshot.params.subTasks
    this._db.getTasksByProcessID(processID).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.projectTasks = res['data']
        this.filterdTasks = res['data']
        this.getTaskStatus()
      }
    })
  }
  addTask(){
    let TaskTeam:TaskTeam[] = [];
    
    if(this.newTask.type == '2'){
      const singletaskteam:TaskTeam = {
        process_team_id:this.newTask.empID,
        task_structure_id:'3'
      }
      TaskTeam.push(singletaskteam)
    }else{
      const singletaskteam:TaskTeam = {
        process_team_id:this.newTask.empID,
        task_structure_id:'1'
      }
      TaskTeam.push(singletaskteam)
    }

    if(!!this.newTask.supportID){
      const singletaskteam:TaskTeam = {
        process_team_id:this.newTask.supportID,
        task_structure_id:'2'
      }
      TaskTeam.push(singletaskteam)
    }

    if(!!this.newTask.seniorToApproveID){
      this.newTask.seniorToApproveName = this.seniors.find(s=>s.key == this.newTask.seniorToApproveID)?.username
      const singletaskteam:TaskTeam = {
        process_team_id:this.newTask.seniorToApproveID,
        task_structure_id:'4'
      }
      TaskTeam.push(singletaskteam)
    }

    this.newTask.task_team = TaskTeam;
    
    // const processID =  this.route.snapshot.params.subTasks
    this.newTask.process_key = this.processDetails.key;
    this.newTask.process_title = this.processDetails.title;


    // const projectID =  this.route.snapshot.params.id
    this.newTask.project_key = this.projectDetails.key || '';
    this.newTask.project_title =  this.projectDetails.title;


    this._db.createNewTask(this.newTask).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this._db.createSystemLogs(`${this.currentUser.username} Created New Task  ${this.newTask.title} in process ${this.newTask.process_title} in project ${this.newTask.project_title}` , `${this.currentUser.key} Created New Task  ${this.newTask.title} in process ${this.newTask.process_key} in project ${this.newTask.project_key}`, this.currentUser.key || '', this.currentUser.username , 'Success').subscribe(res=>{
        },console.log)
        this.notify.openSnackbar('Task Added Successfully', SnackBarState.Success)
        this.newTask ={
          title:"",
          desc:"",
          empID:"",
          empName:"",
          start_date:new Date(),
          end_date:new Date(),
          ex_duration:1,
          project_key:"",
          project_title:"",
          type:'1',
          status: Status.SCHEDULED
        }
        this.devTasksList = []
        this.getProcessTasks();
        this.isChecked = false;
      }else{
        this._db.createSystemLogs(`${this.currentUser.username} Created New Task  ${this.newTask.title} in process ${this.newTask.process_title} in project ${this.newTask.project_title} => ${JSON.stringify(res['data'])} => ${JSON.stringify(this._db.getDateFormatted(this.newTask.start_date))} - => ${JSON.stringify(JSON.stringify(this.newTask))}` , `${this.currentUser.key} Created New Task  ${this.newTask.title} in process ${this.newTask.process_key} in project ${this.newTask.project_key}`, this.currentUser.key || '', this.currentUser.username , 'Fail').subscribe()
        this.notify.openSnackbar('Somthing Wrong While Adding Task', SnackBarState.Error)
        console.log(res);
      }
    },err=>{

      if(err['status'] == ResStatus.NeedExtend){
        // Rais Pop Up For Force Add
        this.notify.openDialog(
          'The Task end date is after the end date of the process?',
          `Do You want to add anyway?`,
          false,
          '',
          true,
          false).subscribe(response => {
            if (response) {
              this.newTask.force_add = 1;
              this._db.createNewTask(this.newTask).subscribe(res=>{
                if(res['status'] == ResStatus.CRUD){
                  this.notify.openSnackbar('Task Added Successfully', SnackBarState.Success)
                  this.newTask ={
                    title:"",
                    desc:"",
                    empID:"",
                    empName:"",
                    start_date:new Date(),
                    end_date:new Date(),
                    ex_duration:1,
                    project_key:"",
                    project_title:"",
                    type:'1',
                    status: Status.SCHEDULED
                  }
                  this.devTasksList = []
                  this.getProcessTasks();
                  this.isChecked = false;
                }else{
                  this.notify.openSnackbar('Somthing Wrong While Adding Task', SnackBarState.Error)
                  console.log(res);
                }
              },err=>{
                console.log(err);
                this.notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error)
              })
            } else {
              this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
            }
          });
      }else{
        console.log(err);
        this.notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error)
        this._db.createSystemLogs(`${this.currentUser.username} Created New Task  ${this.newTask.title} in process ${this.newTask.process_title} in project ${this.newTask.project_title} => ${JSON.stringify(err['error']['data'])} => ${JSON.stringify(this.newTask)}` , `${this.currentUser.key} Created New Task  ${this.newTask.title} in process ${this.newTask.process_key} in project ${this.newTask.project_key}`, this.currentUser.key || '', this.currentUser.username , 'Fail').subscribe(res=>{
        },console.log)
      }
    })
  }



  getProcessTeam(){
    this.processTeamLoading = true;
    const processID =  this.route.snapshot.params.subTasks
    this._db.getProcessTeam(processID).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.processTeam = res['data']
        this.processTeamLoading = false;
      }else{
        console.log(res);
        this.processTeamLoading = false;
      }
    },err=>{
      this.processTeamLoading = false;
      console.log(err);
      
    })
  }

  getTaskTypes(){
    this.taskTypesLoading = true;
    this._db.getTaskTypes().subscribe(types=>{
      if(types['status'] == ResStatus.CRUD){
        this.taskTypes = types['data']
        this.taskTypesLoading = false;
      }else{
        this.taskTypesLoading = false;
      }
    },err=>{
      console.log(err);
      this.taskTypesLoading = false;
    })
  }

  getTaskStatus(){
    this.taskStatusLoading = true;
    this._db.getTaskStatus().subscribe(status=>{
      if(status['status'] == ResStatus.CRUD){
        this.taskStatus = status['data']
        this.taskStatus = this._db.taskStatusRearrange(this.taskStatus)
        this.taskStatusLoading = false;
      }else{
        this.taskStatusLoading = false;
      }
    },err=>{
      console.log(err);
      this.taskStatusLoading = false;
    })
  }


  editTask(task:Task | 0){
    this.getTaskTypes();
    // this.getProcessTeam();
    // this.taskEditMode = true
    if (this.taskEditMode && task) {
      this.newTask = task;
   
      this.newTask.start_date = this._db.getDateFormattedYearMonthDay(this.newTask.start_date) 
  
      this.newTask.empID = `${this.processTeam.find(p=>p.user_team_id == task.empID)?.id}`    
      if(!!this.newTask.supportID){
        this.newTask.supportID = `${this.processTeam.find(p=>p.user_team_id == task.supportID)?.id}`
      }
      this.newTask.end_date = this._db.getDateFormattedYearMonthDay(this.newTask.end_date) 
    }else{
      this.newTask ={
        title:"",
        desc:"",
        empID:"",
        empName:"",
        supportID:"",
        supportName:"",
        start_date:new Date(),
        end_date:new Date(),
        ex_duration:1,
        project_key:"",
        project_title:"",
        type:'1',
        seniorToApproveID:"",
        seniorToApproveName:"",
        seniorIsMandatory:false,
        status: Status.SCHEDULED
      }
    }
   

    
  }

  onEditModeTaskDateCalculation(taskIndex:number){
    this.projectTasks[taskIndex].end_date = this.dCalc.taskEndDateCalculation(this.projectTasks[taskIndex])
  }

  save(){
    let TaskTeam:TaskTeam[] = [];
    
    if(this.newTask.type == '2'){
      const singletaskteam:TaskTeam = {
        process_team_id:this.newTask.empID,
        task_structure_id:'3'
      }
      TaskTeam.push(singletaskteam)
    }else{
      const singletaskteam:TaskTeam = {
        process_team_id:this.newTask.empID,
        task_structure_id:'1'
      }
      TaskTeam.push(singletaskteam)
    }

    if(!!this.newTask.supportID){
      const singletaskteam:TaskTeam = {
        process_team_id:this.newTask.supportID,
        task_structure_id:'2'
      }
      TaskTeam.push(singletaskteam)
    }
    this.newTask.task_team = TaskTeam;
    
    this._db.editTask(this.newTask).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.notify.openSnackbar('Task Added Successfully', SnackBarState.Success)
        this.newTask ={
          title:"",
          desc:"",
          empID:"",
          empName:"",
          start_date:new Date(),
          end_date:new Date(),
          ex_duration:1,
          project_key:"",
          project_title:"",
          type:'1',
          status: Status.SCHEDULED
        }
        this.devTasksList = []
        this.getProcessTasks();
        this.isChecked = false;
        this.taskEditMode = false;
      }else if (res['status'] == ResStatus.NeedExtend){
        // Rais Pop Up For Force Add
      }else{
        this.notify.openSnackbar('Somthing Wrong While Adding Task', SnackBarState.Error)
        console.log(res);
      }
    },err=>{
      console.log(err);
      this.notify.openSnackbar('Somthing Wrong While Adding Task', SnackBarState.Error)
    })
  }



  deleteTask(task:Task){

    this.notify.openDialog(
      'Delete Task?',
      `Are you sure you want to delete This task?`,
      false,
      '*Deleteing this task will not be restored',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deleteTask(task.key || '').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.notify.openSnackbar('Task Deleted Successfully', SnackBarState.Success)
              this.getProcessTasks();
            }else{
              this.notify.openSnackbar('Error', SnackBarState.Success)
            }
          },err=>{
            this.notify.openSnackbar('Error', SnackBarState.Success)
            console.log(err);
          })
        } else {
          this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }

  submitRate(rateAnswers:Question[]){
    this.processLoader = true;
    const finalRateObj:RateAnswers = {
      question_group_id:'1',
      user_to_rate_id : this.selectedTaskToClose?.empID,
      task_id:this.selectedTaskToClose?.key || '',
      questions:[]
    }

    rateAnswers.map(q=>{
      if(!!q.anss){
        if(!Array.isArray(q.anss.answer)){
          if(q.isMulti == '0' && q.question_type_id == '2'){
            const a:any = []
            a.push(q.anss.answer)
            q.anss.answer = a
          }
        }
        finalRateObj.questions.push(q.anss)
      }
    })

    if(this.selectedTaskToClose?.rated_before != '1'){
      this._db.createTaskRate(finalRateObj).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this._db.updateTaskStatus(this.selectedTaskToClose?.key || '', '5').subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.notify.openSnackbar('Task Edited Successfully', SnackBarState.Success)
              this.displayRateForm = false;
              this.processLoader = false;
            }else{
              this.notify.openSnackbar('Somthing Wrong While Editing Task', SnackBarState.Error)
              this.processLoader = false;
            }
          },err=>{
            console.log(err)
            this.notify.openSnackbar('Somthing Wrong While Editing Task', SnackBarState.Error)
            this.processLoader = false;
          })
        }else{
          this.processLoader = false;
        }
      },err=>{
        this.processLoader = false;
      }) 
    }
  }

  ramainingTaskCalc(task:Task){
    if(!!task.real_duration){
      return task.ex_duration - task.real_duration
    }else{
      return task.ex_duration
    }
  }


  GetRateForm(){
    this._db.getQuestionsByQuestionGroup('1').subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.questions = res['data']
        this.displayRateForm = true;
      }
    })
  }

  changeTaskStatus(task:Task){
    this.notify.openDialog(
      'Change Task Status?',
      `Are you sure you want to change this task status?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          if(task.status == '5'){
            if(task.rated_before == '1'){
              this.selectedTaskToClose = task;
              this.GetRateForm();
              this._db.updateTaskStatus(task.key || '', task.status).subscribe(res=>{
                if(res['status'] == ResStatus.CRUD){
                  this.notify.openSnackbar('Task Edited Successfully', SnackBarState.Success)
                }else{
                  this.notify.openSnackbar('Somthing Wrong While Editing Task', SnackBarState.Error)
                }
              },err=>{
                console.log(err)
                this.notify.openSnackbar('Somthing Wrong While Editing Task', SnackBarState.Error)
              })
            }else{
              this.selectedTaskToClose = task;
              this.GetRateForm();
            }
          }else{
            this._db.updateTaskStatus(task.key || '', task.status).subscribe(res=>{
              if(res['status'] == ResStatus.CRUD){
                this.notify.openSnackbar('Task Edited Successfully', SnackBarState.Success)
              }else{
                this.notify.openSnackbar('Somthing Wrong While Editing Task', SnackBarState.Error)
              }
            },err=>{
              console.log(err)
              this.notify.openSnackbar('Somthing Wrong While Editing Task', SnackBarState.Error)
            })
          }
        } else {
          this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
          this.getProcessTasks()
        }
      });

    
  }



  submitUploadTaskFile(task){
    this.uploading = true;
    const fd : FormData = new FormData()
    fd.append('task_id' , task.key)
    fd.append('process_attach' , this.pddFile)
    fd.append('process_id' , task.process_key)
    this._db.attachFileToTask(fd).subscribe(res=>{
      console.log(res);
      
      if(res['status'] == ResStatus.CRUD){
        this.getProcessTasks();
        this.pddUrl = '';
        this.uploading = false;
      }else{
        this.uploading = false;
      }
    },err=>{
      this.uploading = false;
      console.log(err);
    })

  }

  uploadFile(e , task){
    this.pddFile = e.target.files[0]
    this.pddUrl = this.pddFile.name
    // if (e.target.files){
    //   var reader = new FileReader()
    //   reader.readAsDataURL(e.target.files[0])
    //   reader.onload = (event:any) =>{
    //     console.log(this.pddFile);
        
    //     // this.db.pushFileToStorage(this.pddFile, task)
    //     // .then((res)=>{console.log(res);})
    //     // .catch((err)=>{console.log(err);}) 

    //   }
    // }
    
  }


  searchTasks(){
    this.projectTasks = this.filterdTasks

    if(this.searchKey.length > 0){
      this.projectTasks =  this.projectTasks.filter(task=> task.title.toLowerCase().includes(this.searchKey.toLowerCase()) || task.empName.toLowerCase().includes(this.searchKey.toLowerCase()))
    }else{
      this.projectTasks = this.filterdTasks
    }
  }


  showAllTasks(){
    this.projectTasks = this.filterdTasks;
    this.tableWithSupportMode = false;
  }

  showTasksWithSupport(){
    this.filterdTasks = this.projectTasks;
    this.projectTasks = this.projectTasks.filter(task => task.supportID != undefined)
    this.tableWithSupportMode = true;
  }

  onSubmit(form: NgForm) {
    this.newTaskForm.reset();
  }

  cancelEditTask(){  
    // this.editMode[i] = false;
    this.taskEditMode = false
    this.displayRateForm = false;
    this.getProcessTasks()
    this.newTask={
      title:"",
      desc:"",
      empID:"",
      empName:"",
      start_date:new Date(),
      end_date:new Date(),
      ex_duration:1,
      project_key:"",
      project_title:"",
      type:'1',
      status: Status.SCHEDULED
    }
    this.devTasksList = []
    this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);

  }

  checkDevavailability(){
    this.devTasksList = [];
    if(!!this.newTask.empID && !!this.newTask.start_date && !!this.newTask.end_date){
      const userTeam = this.processTeam.find(p=>p.id == this.newTask.empID)?.user_team_id
      this._db.getDevTasksOnSpecificDates(userTeam || '' ,this.newTask.start_date, this.newTask.end_date ).subscribe(
        (data)=>{
          if(data['status'] == ResStatus.CRUD){
            this.devTasksList = data['data']
            this.isChecked = true;
          }else{
            console.log(data);
            this.isChecked = true;
          }
      },console.log)
    }else{
      this.notify.openSnackbar('Please Fill All Fields' , SnackBarState.Warning)
    }
  }



  editProcess(){
    this.processEditMode = true;
    this.getProcessStatus()
  }

  onEditModeProcessDateCalculation(){
    const start = `${new Date(this.processDetails.start_date).getMonth() +1 }/${new Date(this.processDetails.start_date).getDate()}/${new Date(this.processDetails.start_date).getFullYear()}`
    this.processDetails.end_date = `${this._db.getDateFormatted(this.dCalc.SubTaskEndDateCalculation(start , this.processDetails.ex_duration))}`
  }

  saveEditedProcess(){
    this._db.editProcess(this.processDetails).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.notify.openSnackbar('Process Edited Successfully', SnackBarState.Success)
        this.processEditMode = false;
        this.getCurrentProcessDetails();
      }
    },err=>{
      console.log(err);
      this.notify.openSnackbar('Somthing Wrong While Editing Process', SnackBarState.Error)
    })
  }



  editDevs(){
    this.projectTeamLoading = true;
    this.DevOnEditMode = true ; 
    const processID =  this.route.snapshot.params.subTasks
    this._db.getProcessTeam(processID).subscribe(res=>{      
      if(res['status'] == ResStatus.CRUD){
        this.processTeam = res['data']
        for(let i in this.processTeam){
          if(this.processTeam[i].project_structure_id == ProjectStructure.Developer){
            this.process_team_mempers.push(this.processTeam[i].project_team_id)
          }else if(this.processTeam[i].project_structure_id == ProjectStructure.Analysis){
            this.process_business_analysis.push(this.processTeam[i].project_team_id)
          }else if(this.processTeam[i].project_structure_id == ProjectStructure.Tech_Lead){
            this.tech_lead = this.processTeam[i].project_team_id;
          }else if(this.processTeam[i].project_structure_id == ProjectStructure.SUPPORT){
            this.process_support_team.push(this.processTeam[i].project_team_id);
          }
        }
        const ProjectID =  this.route.snapshot.params.id
        this._db.getProjectTeam(ProjectID).subscribe(res=>{
          if(res['status'] == ResStatus.CRUD){
            this.projectTeam = res['data']
            this.projectTeamLoading = false;
          }else{
            this.projectTeamLoading = false;
          }
        })
      }else{
        // this.projectTeamLoading = false;
        const ProjectID =  this.route.snapshot.params.id
        this._db.getProjectTeam(ProjectID).subscribe(res=>{
          if(res['status'] == ResStatus.CRUD){
            this.projectTeam = res['data']
            this.projectTeamLoading = false;
          }else{
            this.projectTeamLoading = false;
          }
        },err=>{
          console.log(err);
        })
      }
    })
  }

  saveEditDevs(){
    let processTeam:ProcessTeam[] = [];

    if(!!this.process_business_analysis){
      const Analysis = this.process_business_analysis;
      for(let i in Analysis){
        const pTEam:ProcessTeam = {
          project_team_id : Analysis[i]
        }
        processTeam.push(pTEam)
      }
    }

    if(!!this.process_team_mempers){
      const devs = this.process_team_mempers;
      for(let i in devs){
        const pTEam:ProcessTeam = {
          project_team_id : devs[i]
        }
        processTeam.push(pTEam)
      }
    }

    if(!!this.process_support_team && this.process_support_team.length > 0){
      const devs = this.process_support_team;
      for(let i in devs){
        const pTEam:ProcessTeam = {
          project_team_id : devs[i]
        }
        processTeam.push(pTEam)
      }
    }

    if(!!this.tech_lead){
      const pTEam:ProcessTeam = {
        project_team_id : this.tech_lead
      }
      processTeam.push(pTEam)
    }

    const processID =  this.route.snapshot.params.subTasks

    this._db.editProcessTeam(processTeam,processID).subscribe(res=>{
      this.notify.openSnackbar('Process Team Members Edited Successfully', SnackBarState.Success)
      this.DevOnEditMode = false;
      this.getCurrentProcessDetails();
    })

  }

  saveEditDevsOld(){ 

    

    // check for if dev is exists on task 
    let devNotFound = false
    
    for (let i in this.projectTasks){
      if(this.projectTasks[i].type != '2'){
        let devFound = false
        for (let p in this.processDetails.Devs_mempers){
          if(this.projectTasks[i].empID == p){            
            devFound = true;
          }
        }
        if(devFound == false){
          devNotFound = true
        }
      } 
    }


    if (devNotFound == false){
      
    }else{
      this.notify.openSnackbar('Somthing Wrong you removed a developer while he is assigned to a task', SnackBarState.Error , 10000)      
    }

    
    
  }



  cancelEdit(){
    this.DevOnEditMode = false;
    this.processEditMode = false;
    this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  }


  open(content) {
    this.modalService.open(content, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    this.getProcessTasks()
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  } 
}
