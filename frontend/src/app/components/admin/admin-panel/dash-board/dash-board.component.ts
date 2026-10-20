import { Component, OnInit } from '@angular/core';
import { DashboardStatisticsI } from 'src/app/interfaces/dashbord.interface';
import { Project, Status } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Department, User, UserNavParams } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {
  loaded:boolean = false;
  date:Date;
  currentUser!:User;
  myNavParams!:UserNavParams;
  departmentEnum = Department;
  /* =================================== Projects Status Based Chart Variables =========================== */
  public projectsStatusChartType: string = 'pie';
  public projectsStatusChartDatasets: Array<any> = []; // { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
  public projectsStatusChartLabels: Array<any> = ['Pending','Hold','Scheduled', 'Running' , 'Closed'];
  public projectsStatusChartColors: Array<any> = [
    {
      backgroundColor: [ '#CBC4DA', '#B5179E', '#480CA8', '#560BAD' , '#7209B7'],
      hoverBackgroundColor: ['#CBC4DA', '#B5179E',  '#480CA8', '#560BAD' , '#7209B7'],
      borderWidth: 2,
      
    }
  ];
  public projectsStatusChartOptions: any = {
    responsive: true,
    width:50,
    plugins: {
      legend: {
        position:'right',
          labels: {
              usePointStyle: true,
              
          }
      }
  }

    
  };
  dashboardStatistics: DashboardStatisticsI={
    admin_tasks:0,
    open_tickets:0,
    pending_reports:0,
    public_request:0,
    latest_request:[]
  };

  
  public projectsStatusChartClicked(e: any): void {}
  public projectsStatusChartHovered(e: any): void {}
  /* =================================== Projects Status Based Chart Variables =========================== */

  /* =================================== Projects Type Based Chart Variables =========================== */
  public projectsTypeChartType: string = 'pie';
  public projectsTypeChartDatasets: Array<any> = []; // { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
  public projectsTypeChartLabels: Array<any> = ['Project', 'POC'];
  public projectsTypeChartColors: Array<any> = [
    {
      backgroundColor: [ '#560BAD', '#B5179E'],
      hoverBackgroundColor: ['#560BAD', '#B5179E'],
      borderWidth: 2,
  
      
    }
    
  ];
  public projectsTypeChartOptions: any = {
    responsive: true,
    width:'50px',
    
    plugins: {
      legend: {
        position:'right',
          labels: {
              usePointStyle: true,
              
              
          }
      },
  }
  };
  
  public projectsTypeChartClicked(e: any): void {}
  public projectsTypeChartHovered(e: any): void {}
  /* =================================== Projects Type Based Chart Variables =========================== */


  constructor(private _db:DatabaseService,private _auth:AuthApiService,) { }

  ngOnInit(): void {
    this.loadAllProjectsChart()
    
      this.date = new Date(); 
      this.getCurrentUser();
      this.GetAllDashboardDetails();
    
  }


  loadAllProjectsChart(){
    this._db.getAllProjectsIncludeClosed().subscribe(
      (projects)=>{
        if(projects['status'] == ResStatus.CRUD){
          this.projectStatusPasedAnalysis(projects['data']);
          this.projectTypeBasedAnalysis(projects['data']);
          this.loaded = true;
        }
      },err=>console.log(err)
      
    )
  }

  projectStatusPasedAnalysis(projects:Project[]){
    let statArray:number[] = []
    let SCHEDULEDCounter = 0;
    let RUNNINGCounter = 0;
    let PENDINGCounter = 0;
    let HOLDCounter = 0;
    let CLOSEDCounter = 0;
    projects.forEach(project=>{
      if(project.status == Status.SCHEDULED){
        SCHEDULEDCounter++
      }else if(project.status == Status.RUNNING){
        RUNNINGCounter++
      }else if(project.status == Status.PENDING){
        PENDINGCounter++
      }else if(project.status == Status.HOLD){
        HOLDCounter++
      }else if(project.status == Status.CLOSED){
        CLOSEDCounter++
      }
    })
    statArray.push(SCHEDULEDCounter)
    statArray.push(RUNNINGCounter)
    statArray.push(PENDINGCounter)
    statArray.push(HOLDCounter)
    statArray.push(CLOSEDCounter)

    this.projectsStatusChartDatasets.push({ data: statArray, label: 'Projects' })
  }


  projectTypeBasedAnalysis(projects:Project[]){
    let projectTypeArray:number[] = []
    let projectCounter = 0;
    let POCCounter = 0;
    projects.forEach(project=>{
      if(project.type == '2'){
        projectCounter++
      }else if(project.type == '1'){
        POCCounter++
      }
    })
    projectTypeArray.push(projectCounter)
    projectTypeArray.push(POCCounter)
    

    this.projectsTypeChartDatasets.push({ data: projectTypeArray, label: 'Project Type' })
  }

  getCurrentUser(){
     this._auth.user.subscribe(
     (res:any)=>{
       this.currentUser=res;
        this.getStatistics()
      }
   )
  }
  getStatistics(){
    this._auth.getNavPermsByUserID(this.currentUser?.key || '').subscribe(res=>{

      this.myNavParams={...res};
      
    })
  }
  GetAllDashboardDetails(){
    this._auth.GetAllDashboardDetails().subscribe({
      next:(res)=>{
        this.dashboardStatistics=res.data
        
      },error:(err)=>{
        
      }
    })
  }




}
