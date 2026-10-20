import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, throwIfEmpty } from 'rxjs/operators';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Activity, DevDailyReport, projectReport, projectsReports } from 'src/app/interfaces/dev-daily-report';
import { Project } from 'src/app/interfaces/project';
import { SUB_TASk, Task } from 'src/app/interfaces/task';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { NotificationService } from 'src/app/services/notification.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DatabaseService } from 'src/app/services/database.service';
import { ResStatus } from 'src/app/interfaces/res-status';


@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectReportComponent implements OnInit {
  loadingSpinnerMode:boolean = false;
  runningProjects:Project[]=[];
  finalProjectReport:projectsReports |undefined;
  finalProcessReport:projectsReports |undefined;
  projectTasks:Task[] | undefined = [] ;
  tableWithSupportMode:boolean = false;

   // pagination
   totalTasksRecords:number = 0 ;
   taskspage:number=1 ;
  //  mode: ProgressSpinnerMode = 'determinate';
  filterdTasks:Task[] | undefined = []
  searchKey:string;


  myControl = new FormControl();
  filteredOptions: Observable<Project[]>;

  expandedElement: Task | null;
  columnsToDisplay= ['#' , 'title' , 'Process Name' , 'Start Date' , 'Duration' , 'End Date'  , 'Assigned To' , 'Task Status']
  
  projectProcesses:SUB_TASk[] = [] ;
  projectDetails:Project | undefined;

  allProjectTasks:Task[] | undefined = [];
  processDetails:SUB_TASk | undefined;

  projectReports:DevDailyReport[] = [];

  constructor(private _db:DatabaseService) { }

  ngOnInit(): void {

    // this.db.getRunningProjects().subscribe(
    //   (data)=>{
    //     this.runningProjects = data;
    //     this.db.getScheduledProjects().subscribe(
    //       (projects)=>{
    //         const schedProjects:Project[] = projects;
    //         this.runningProjects = this.runningProjects.concat(schedProjects)

            
    //         this.filteredOptions = this.myControl.valueChanges
    //         .pipe(
    //           startWith(''),
    //           map(value => typeof value === 'string' ? value : value.name),
    //           map(name => name ? this._filter(name) : this.runningProjects.slice())
    //         );
        
    //       }
    //     )
    //   },
    //   (err)=>{console.log(err);
    //   }
    // )

    this._db.getAllProjectsIncludeClosed().subscribe(
      (projects)=>{
        this.runningProjects = projects['data'];
        this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : this.runningProjects.slice())
        );
        // if(projects['status'] == ResStatus.CRUD){
        // }else{
        //   this.runningProjects = [];
        // }
      },err=>console.log(err)
    )

    
  }

  displayFn(project: Project): string {
    return project && project.title ? project.title : '';
  }

  private _filter(title: string): Project[] {
    const filterValue = title.toLowerCase();

    return this.runningProjects.filter(option => option.title.toLowerCase().includes(filterValue));
  }


  getProjcetProcesses(e){
    this.finalProjectReport = undefined;
    this.projectTasks = undefined;
    this.filterdTasks = undefined;
    this.finalProcessReport = undefined;
    this.processDetails = undefined;
    this.projectDetails = this.runningProjects.find(project=>project.key == e.option.value.key)


    this.getRunningProjectReport(e.option.value)

    // getProjectSubTasks
    this._db.getProjectProcess(e.option.value.key).subscribe(
      (processes)=>{
        this.projectProcesses = processes['data'];
        // if(processes['status'] == ResStatus.CRUD){
        // }else{
        //   this.projectProcesses = [];
        // }
      },err=>console.log(err)
    )
  }

  getProcessReport(e){
    this.processDetails =  this.projectProcesses.find(process=>process.key == e.value.key)
    this.getProcessTasks(e.value)

    this.getprocessFinalReport(e.value)

  }



  getProcessTasks(process:SUB_TASk){
    this.filterdTasks = this.allProjectTasks?.filter(task=>task.process_key == process.key);
    this.projectTasks = this.filterdTasks;
  }
  
  getprocessFinalReport(process:SUB_TASk){
    this.finalProcessReport = undefined;

    const processReports = this.projectReports.filter(report=>report.processID == process.key)
    // console.log(processReports);
    
    if(!!processReports && processReports.length > 0){
      let processDevsReports:projectReport [] = [];
      let processTotalRWorkingHours:Array<number> = []
      processReports.map(e => processTotalRWorkingHours.push(e.durationByHours))
      // get devs keys 
      let devs:Array<any> = []
      for (let i in processReports){
        if(devs.length > 0 ){
          let d = devs.find(k => k == processReports[i].devID)            
          if(d == undefined){
            devs.push(processReports[i].devID)
          }
        }else{
          devs.push(processReports[i].devID)
        }
      }

      // loop on devs keys and get reports for each dev and calculate them 
      for (let dev in devs ){
        let eachDevReports = processReports.filter(rep => rep.devID == devs[dev])
        
        let onlyDevWorkingJours:Array<number> = []
        let onlyDevIdelHours:Array<number> = []

        eachDevReports.map(rep => {
          if(rep.time_activity != Activity.IDEAL_HOURS){
            onlyDevWorkingJours.push(rep.durationByHours)
            onlyDevIdelHours.push(0)
          }else{
            // console.log(rep);
            
            onlyDevIdelHours.push(rep.durationByHours)
            onlyDevWorkingJours.push(0)
          }
        })

        let devtotalWorkingHours;
        let devIdelHours;

        if(onlyDevWorkingJours.length > 0){
          devtotalWorkingHours = onlyDevWorkingJours.reduce((a,b)=>a+b)
        }

        if(onlyDevIdelHours.length > 0){
          devIdelHours = onlyDevIdelHours.reduce((a,b)=>a+b)
        }


        // get Tasks number and progress for every dev

        let allDevProgress:number[] = []
        eachDevReports.map(report => allDevProgress.push(report.progress || 0))
        let devProgress = 0 ;
        if (allDevProgress.length > 0){
          devProgress = allDevProgress.reduce((a,b) => a+b)
        }else{
          devProgress = 0
        }


        const projectReport:projectReport = {
          devKey:devs[dev],
          devName: eachDevReports[0].devName , 
          totalWorkingHours:devtotalWorkingHours,
          progress:devProgress,
          idelHours:devIdelHours
        }

        processDevsReports.push(projectReport)
      }

      // request to get projectTasks to calculate total progress

      let tasksNumber = 0
      if(!!this.filterdTasks && this.filterdTasks.length > 0){
        tasksNumber = this.filterdTasks.length;
      }     

      
      let allDevsProgress:number[]  = []
      processReports.map(report => allDevsProgress.push(report.progress || 0))
      let projectProgress = allDevsProgress.reduce((a,b)=>a+b) / tasksNumber
      // push final report
      console.log(process.ex_duration * 8);
      console.log(processTotalRWorkingHours.reduce((a,b)=>a+b));
      
      
      const finalReport:projectsReports = {
        projectKey : process.key || "",
        projectName: process.title , 
        projectReports :  processDevsReports,
        progress: projectProgress,
        remainingTime : (process.ex_duration * 8) -  (processTotalRWorkingHours.reduce((a,b)=>a+b)),
        totalIdelHours : 0
      }
      this.finalProcessReport = finalReport;
    }else{
      const finalReport:projectsReports = {
        projectKey : process.key || "",
        projectName: process.title , 
        projectReports :  [],
        progress: 0 ,
        remainingTime : (process.ex_duration * 8),
        totalIdelHours : 0
      }
      this.finalProcessReport = finalReport;
    }


  }


  getRunningProjectReport(projcet:Project){
    this.loadingSpinnerMode = true ;
    // getReportsByProject
    return this._db.getReportsByProjectID(projcet.key || "").subscribe(
       (res)=>{        
         const data = res['data']
         this.projectReports = data;
         if(!!data && data.length > 0 ){
           let projectReports:projectReport [] = [];
           let totalRWorkingHours:Array<number> = []
           data.map(e => totalRWorkingHours.push(e.durationByHours)) 
           // get devs keys 
           let devs:Array<any> = []
           for (let i in data){
             if(devs.length > 0 ){
               let d = devs.find(k => k == data[i].devID)            
               if(d == undefined){
                 devs.push(data[i].devID)
               }
             }else{
               devs.push(data[i].devID)
             }
           }
  
           // loop on devs keys and get reports for each dev and calculate them 
           for (let dev in devs ){
             let eachDevReports = data.filter(rep => rep.devID == devs[dev])
             
             let onlyDevWorkingJours:Array<number> = []
             let onlyDevIdelHours:Array<number> = []
 
             eachDevReports.map(rep => {
               if(rep.time_activity != Activity.IDEAL_HOURS){
                 onlyDevWorkingJours.push(rep.durationByHours)
                 onlyDevIdelHours.push(0)
               }else{
                 // console.log(rep);
                 
                 onlyDevIdelHours.push(rep.durationByHours)
                 onlyDevWorkingJours.push(0)
               }
             })
 
             let devtotalWorkingHours;
             let devIdelHours;
 
             if(onlyDevWorkingJours.length > 0){
               devtotalWorkingHours = onlyDevWorkingJours.reduce((a,b)=>a+b)
             }
 
             if(onlyDevIdelHours.length > 0){
               devIdelHours = onlyDevIdelHours.reduce((a,b)=>a+b)
             }
 
 
             // get Tasks number and progress for every dev
 
             let allDevProgress:number[] = []
             eachDevReports.map(report => allDevProgress.push(report.progress || 0))
             let devProgress = 0 ;
             if (allDevProgress.length > 0){
               devProgress = allDevProgress.reduce((a,b) => a+b)
             }else{
               devProgress = 0
             }
 
 
             const projectReport:projectReport = {
               devKey:devs[dev],
               devName: eachDevReports[0].devName , 
               totalWorkingHours:devtotalWorkingHours,
               progress:devProgress,
               idelHours:devIdelHours
             }
 
             projectReports.push(projectReport)
           }
 
           // request to get projectTasks to calculate total progress
 
           this.projectTasks = [] ;
           
           // getProjectTasks
           this._db.getTasksByProjectID(projcet.key || "").subscribe(
             (res)=>{
               const tasks = res['data']
               this.allProjectTasks = tasks;
 
               let tasksNumber = 0
               if(!!tasks && tasks.length > 0){
                 tasksNumber = tasks.length;
               }
               let allDevsProgress:number[] = []
               projectReports.map(report => allDevsProgress.push(report.progress || 0))
 
               let projectProgress = allDevsProgress.reduce((a,b)=>a+b) / tasksNumber
 
 
 
               // push final report
               const finalReport:projectsReports = {
                 projectKey : projcet.key || "",
                 projectName: projcet.title , 
                 projectReports :  projectReports,
                 progress: projectProgress,
                 remainingTime : (projcet.duration * 8) -  (totalRWorkingHours.reduce((a,b)=>a+b)),
                 totalIdelHours : projcet.idelHoues ?? 0
               }

               console.log(projcet.duration  ,  totalRWorkingHours.reduce((a,b)=>a+b));
               
               // this.finalProcessReport.push(finalReport)
               this.finalProjectReport = finalReport;
               this.loadingSpinnerMode = false ; 
              //  if(res['status'] == ResStatus.CRUD){
              //  }else{
              //    this.allProjectTasks = [];
              //  }
             }
           )
 
 
   
 
           
          
            
         }else{
 
           const finalReport:projectsReports = {
             projectKey : projcet.key || "",
             projectName: projcet.title , 
             projectReports :  [],
             progress: 0 ,
             remainingTime : (projcet.duration * 8),
             totalIdelHours : projcet.idelHoues ?? 0
           }
 
           // getProjectTasks
           this._db.getTasksByProjectID(projcet.key || "").subscribe(
             (tasks)=>{
               // this.projectTasks = tasks;
               // this.filterdTasks = this.projectTasks;
               this.allProjectTasks = tasks['data'];
              //  if(tasks['status'] == ResStatus.CRUD){
              //  }else{
              //    this.allProjectTasks = [];
              //  }
             },(err)=>console.log(err)
           )
 
           // this.finalProcessReport.push(finalReport)
           this.finalProjectReport = finalReport;
 
           this.loadingSpinnerMode = false ; 
 
 
           
 
         }
        // if(res['status'] == ResStatus.CRUD){
          

        // }
        
       },
       (err)=>{
         console.log(err);
         this.loadingSpinnerMode = false ; 

       }
     )
   }


  getAllRunningProjectsReports(){

    this.finalProjectReport = undefined;
    for(let i in this.runningProjects){
      this.getRunningProjectReport(this.runningProjects[i])
    }
  }


  ramainingTaskCalc(task:Task){
    if(!!task.real_duration){
      return task.ex_duration - task.real_duration
    }else{
      return task.ex_duration
    }
  }


  searchTasks(){
    
    this.projectTasks = this.filterdTasks ;

    if(this.searchKey.length > 0){
      this.projectTasks =  this.projectTasks?.filter(task=> task.title.toLowerCase().includes(this.searchKey.toLowerCase()) || task.empName?.toLowerCase().includes(this.searchKey.toLowerCase()) || task.process_title?.toLowerCase().includes(this.searchKey.toLowerCase()))
    }else{
      this.projectTasks = this.filterdTasks;
    }
  }


}
