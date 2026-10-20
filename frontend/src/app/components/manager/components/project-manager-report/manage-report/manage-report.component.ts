import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Project, Status } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-manage-report',
  templateUrl: './manage-report.component.html',
  styleUrls: ['./manage-report.component.scss']
})
export class ManageReportComponent implements OnInit {

  managers: User[] = [];
  projects: Project[] = [];
  allDevs: User[] = [];
  @Input() report:any;
  @Output() manageReport = new EventEmitter()

  reportForm: FormGroup = new FormGroup({
    'team_request_title': new FormControl(null, Validators.required),
    'team_request_description': new FormControl(null, Validators.required),
    'for_date': new FormControl(null, Validators.required),

    'manager_approve_id': new FormControl(null, Validators.required),

    'projects': new FormArray([], Validators.required),

    'developer_team': new FormControl(null, Validators.required),

  })

  constructor(private _auth: AuthApiService, private _db: DatabaseService, private fb: FormBuilder,
    private _notify:NotificationService,) {

  }

  ngOnInit(): void {
    this.getManagers();
    this.getDevs();
    
    this._auth.user.subscribe(
      (user)=>{
        
        if(!!user){
          this.getProjects(user.key);

        }
      })
    
    if (this.report) {
      this.reportForm.patchValue({...this.report,
        for_date:this._db.getDateFormattedYearMonthDay(this.report.for_date),
        developer_team:this.report.developer_team.map(x=>String(x.user_id)),
        manager_approve_id:this.report.manager_approve_id.toString()
      })
      this.report.projects.forEach(element => {
       
        let selectedProcesses= element.process_details.map((x)=>x= {key:x.process_id , title:x.process_title});
        let allProcess:any[]=[];
        this._db.getProjectProcess(element.project_id).subscribe({
    
          next: (process: any) => {      
            if(process['status'] == ResStatus.CRUD){
            allProcess=process['data']
            
            }else{
            
            }

            let project=  this.fb.group({
              project_id: element.project_id,
              process_details: [selectedProcesses.map(x=>Number(x.key))],
              list:[allProcess]
            })
          this.projectsData().push(project);
    
          }, error: (err: any) => {
        
          }
        })
        
      });
    }else{

      this.addProject();
    }

  }

  getManagers() {
    this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.managers = res['data'];
      }
    })
  }

  getProjects(user_id:string) {

    this._db.getPMMyProjects(user_id).subscribe(projects => {
      if (projects['status'] == ResStatus.CRUD) {
        const data = projects['data']
        this.projects = data.filter(p => p.status != Status.CLOSED)
      }
    },)

  }

  getProjectID(projectForm:AbstractControl) {
    
     this._db.getProjectProcess(projectForm.value.project_id).subscribe({
    
      next: (process: any) => {      
        if(process['status'] == ResStatus.CRUD){
        projectForm.patchValue({list:process['data'],process_details:null})   
        
        }else{

          projectForm.patchValue({list:null,process_details:null}) 
        
        }

      }, error: (err: any) => {
       
    
      }
    })
  
  }

  projectsData(): FormArray {
    return this.reportForm.get('projects') as FormArray;
  }


  addProject() {
    let project= this.fb.group({
      project_id: ['',[Validators.required]],
      process_details:  ['',[Validators.required]],
      list:[]
    });
    if (!this.projectsData().invalid || this.projects.length==0) {
      
      this.projectsData().push(project);
    }
    
    
  }

  deleteProject(i: number) {
    this.projectsData().removeAt(i);
  }
  getDevs(){
    this._auth.user.subscribe(
      (user) => {
        if (!!user) {
          if (user.department == Department.MANAGEMENT || user.accPosition == AccountPositions.MANAGER || user.department == Department.ADMINSTRATION) {
            this._auth.getUserByFilter(Department.TECHNICAL_TEAM).subscribe(devs => {
              if (devs['status'] == ResStatus.CRUD) {
                this.allDevs = devs['data'].filter(u => u.accPosition != AccountPositions.MANAGER && u.accPosition != AccountPositions.Team_Leader)

              }
            })
          } else {
            console.log("You Have No Access For This Page");
          }
        }
      }
    )
  }


  createReport(){
    
   this.reportForm.patchValue({for_date:  this._db.getDateFormatted(this.reportForm.value.for_date) })
    this._db.CreatePMTeamRequest(this.reportForm.value).subscribe(res=>{
      if (res['status'] == ResStatus.CRUD) {
        // this.manageReport.emit(this.reportForm.value);
        this._db.manageManagerReport$.next(this.reportForm.value)


      this._notify.openSnackbar('Report added successfully', SnackBarState.Success);
        
      }
    }

    )
  }

  updateReport(){
    
    this.reportForm.patchValue({for_date:  this._db.getDateFormatted(this.reportForm.value.for_date) });
    let reportBody ={
      ...this.reportForm.value,
      pm_team_request_id:this.report.key
    }
     this._db.updatePMTeamRequest(reportBody).subscribe(res=>{
       if (res['status'] == ResStatus.CRUD) {
       this._notify.openSnackbar('Report updated successfully', SnackBarState.Success);
        //  this.manageReport.emit(reportBody)
         this._db.manageManagerReport$.next(reportBody)
       }
     }
 
     )
   }
}
