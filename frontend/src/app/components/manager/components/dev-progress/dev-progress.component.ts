import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Activity, DevProgressReport, ReportDetails, ReportDetailsProcess, ReportDetailsTasks } from 'src/app/interfaces/dev-daily-report';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-dev-progress',
  templateUrl: './dev-progress.component.html',
  styleUrls: ['./dev-progress.component.scss']
})
export class DevProgressComponent implements OnInit {
  devProgressLoader:boolean = false;
  currentUser:User;
  devs:User[]=[];
  myControl = new FormControl();
  visible: boolean = true;
  loaded=false;
  // devReportsList:DevDailyReport[]=[];
  devProgressReport:DevProgressReport | undefined;
  getDevProgressForm = new FormGroup({
    'user_id' : new FormControl(null , Validators.required),
    'from':new FormControl( this._db.getDateFormattedYearMonthDay(new Date(new Date().getFullYear(),0,1)), Validators.required),
    'to':new FormControl(this._db.getDateFormattedYearMonthDay(new Date(new Date().getFullYear(),11,31)) , Validators.required),
  })
  filteredOptions: Observable<User[]>;
  data: any;

  options: any;

  numberOfTasks:number = 0;
  newServerApi = environment.newServerApi
  @ViewChild('mymodal') mymodal:TemplateRef<any>;
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private modal:NgbModal) { }

  ngOnInit(): void {
    this._auth.user.subscribe(res=>{
      if(!!res){
        this.currentUser = res;
        this.getDevs();
        // this.getDevData();
      }
    })

    
  }
ngAfterViewInit(): void {

  this.openModal()
}
openModal(){
  this.modal.open(this.mymodal,{centered:true,keyboard:false,size:'sm'})

}

  getDevs(){
    this.devProgressLoader = true;

    this._auth.getUserByFilter(Department.TECHNICAL_TEAM).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.devs = res['data'].filter(d=>d.accPosition != AccountPositions.MANAGER)
        this.devs = this.devs.sort((a,b)=>{
          return compare(a.username, b.username, true);
        })
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : this.devs.slice())
        );
        this.devProgressLoader = false;
      }
    })
  }

  getFromHTML(e){    
    this.getDevProgressForm.patchValue({
      'user_id':e.option.value.key
    })
  }

  getDevData(){
    // this.getDevProgressForm.patchValue({
    //   'user_id':14
    // })
    this.devProgressLoader = true;

    const user_id = this.getDevProgressForm.get(['user_id'])?.value;
    const from = this.getDevProgressForm.get(['from'])?.value;
    const to = this.getDevProgressForm.get(['to'])?.value;

    this._db.getDevelopersProgressReport(user_id , from , to).subscribe(
      (reports)=>{        
        this.devProgressLoader = false;
        // this.devReportsList = [];
        if(reports['status'] == ResStatus.CRUD){
          this.loaded=true;
          this.devProgressReport =  reports['data']
          this.getTasksData();
          this.getChartData();
          this.modal.dismissAll()

          let tasksArr:string[]=[];

          this.devProgressReport?.reports_arr.map(r=>{
            // Get num of tasks 
            if(!!r.taskID){
              if(tasksArr.length == 0){
                tasksArr.push(r.taskID)
              }else{
                const t = tasksArr.find(e=>e==r.taskID)
                if(!t){
                  tasksArr.push(r.taskID)
                }
              }
            }
          })         

          this.numberOfTasks = tasksArr.length;

        }else{
          this.devProgressReport = undefined;
        }
      }
    )
  }



  getTasksData(){
    if(!!this.devProgressReport && this.devProgressReport.reports_arr.length > 0){
      let projects:any = [];
      let processes:any = [];
      let tasks:any = [];
      
      for(let i in this.devProgressReport.reports_arr){

        // Get Uniqe Projects
        if(projects.length < 1){
          if(!!this.devProgressReport.reports_arr[i].projectID){
            projects.push(this.devProgressReport.reports_arr[i].projectID)
          }
        }else{
          const check = projects.find(p=>p == this.devProgressReport?.reports_arr[i].projectID)
          if(!check){
            projects.push(this.devProgressReport.reports_arr[i].projectID)
          }
        }

        // Get Uniqe Projects
        if(processes.length < 1){
          if(!!this.devProgressReport.reports_arr[i].processID){
            processes.push(this.devProgressReport.reports_arr[i].processID)
          }
        }else{
          const check = processes.find(p=>p == this.devProgressReport?.reports_arr[i].processID)
          if(!check){
            processes.push(this.devProgressReport.reports_arr[i].processID)
          }
        }

        // Get Uniqe Tasks
        if(!!this.devProgressReport.reports_arr[i].taskID){
          if(tasks.length < 1){
              tasks.push(this.devProgressReport.reports_arr[i].taskID)
            }else{
              const check = tasks.find(p=>p == this.devProgressReport?.reports_arr[i].taskID)
              if(!check){
                tasks.push(this.devProgressReport.reports_arr[i].taskID)
              }
          }
        }
          
      }
      // console.log(projects,processes,tasks);
      this.devProgressReport.tasks_data = [];
      
      
      // console.log(this.devProgressReport.reports_arr.find(r=>r.taskID == '41'));
      
      for (let i in projects){
        const filteredByProjects = this.devProgressReport.reports_arr.filter(p=>p.projectID == projects[i] && p.time_activity == Activity.DAILY_TASK)
        if(filteredByProjects.length == 0){
            continue;
        }
        let projectsSum = 0;
        filteredByProjects.map(p =>projectsSum = projectsSum+p.durationByHours);
        let pReport:ReportDetails = {
          'projectID':filteredByProjects[0].projectID || '',
          'projectName':filteredByProjects[0].projectName || '',
          'total_working_hours':projectsSum,
          'processes':[]
        }

        let processesReport:ReportDetailsProcess[] = []

        for(let e in processes){
          const filteredByProsses = this.devProgressReport.reports_arr.filter(p=>p.projectID == projects[i] && p.processID == processes[e] && p.time_activity == Activity.DAILY_TASK)
          if(filteredByProsses.length == 0){
            continue;
          }
          let processesSum = 0;
          filteredByProsses.map(p =>processesSum = processesSum+p.durationByHours);
          // console.log(filteredByProsses);
          let processReport:ReportDetailsProcess = {
            'processID':filteredByProsses[0].processID || '',
            'processName':filteredByProsses[0].processName || '',
            'process_working_hours':processesSum,
            'tasks':[]
          }

          let tasksReport:ReportDetailsTasks[] = []
          for(let t in tasks){
            const filteredByTasks = this.devProgressReport.reports_arr.filter(p=>p.processID == processes[e] && p.taskID == tasks[t] && p.time_activity == Activity.DAILY_TASK)
            if(filteredByTasks.length == 0){
              continue;
            }
            let tasksSum = 0;
            filteredByTasks.map(p =>tasksSum = tasksSum+p.durationByHours);
            let newtaskReport:ReportDetailsTasks = {
              'taskID':filteredByTasks[0].taskID || '',
              'taskName':filteredByTasks[0].taskTitle || '',
              'task_working_hours':tasksSum,
            }
            tasksReport.push(newtaskReport)
          }

          processReport.tasks = tasksReport;
          processesReport.push(processReport)
        }
        pReport.processes = processesReport;
        
        this.devProgressReport.tasks_data.push(pReport)
        // console.log(pReport);
        
      }
      console.log(this.devProgressReport.tasks_data);
      
      
    }
  }

  getChartData(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
        labels: ['Total Working Hours', 'Idle hours', 'Officials vacations','Unpaid vacation'],
        datasets: [
            {
                data: [this.devProgressReport?.total_working_hours, this.devProgressReport?.idle_hours, this.devProgressReport?.offical_vacation,this.devProgressReport?.unpaid_vacation],
                backgroundColor: ['#513982','#9747FF','#FFAB00','#EC2525'],
                hoverBackgroundColor: ['#74619B', '#9788B4', '#bda168','#EC2525']
            }
        ]
    };

    this.options = {
        plugins: {
            legend: {
              position:'right',
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
  }

  private _filter(title: string): User[] {
    const filterValue = title.toLowerCase();

    return this.devs.filter(option => option.username.toLowerCase().includes(filterValue));
  }

  displayFn(dev: User): string {
    return dev && dev.username ? dev.username : '';
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}