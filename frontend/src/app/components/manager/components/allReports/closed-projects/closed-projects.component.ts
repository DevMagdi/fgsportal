import { Component, OnInit } from '@angular/core';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Project ,ProjectStatus } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-closed-projects',
  templateUrl: './closed-projects.component.html',
  styleUrls: ['./closed-projects.component.scss']
})
export class ClosedProjectsComponent implements OnInit {

  getToday = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
  fileName= `${this.getToday}.xlsx`;
  closedProjects:Project[]=[]
  currentUser:User;
  projectDetails:Project;
  DepartmentEnum = Department;
  accPosistionEnum = AccountPositions;
  projectStatus:ProjectStatus[] = [];
  constructor(private excelServ:ExportExcelService,
              private notify:NotificationService,
              private _db:DatabaseService,
              private _auth:AuthApiService) { }

  ngOnInit(): void {

    this._auth.user.subscribe(user=>{
        if(!!user){
          this.currentUser = user
        }
      }
    )

    this.getClosed();
    this.getProjectStatus()
  }

  getClosed(){
    this._db.getClosedProjects().subscribe(projects=>{
      if(projects['status'] == ResStatus.CRUD){
        this.closedProjects = projects['data'];        
      }else if(projects['status'] == ResStatus.Success_But_Empty){
        this.closedProjects = [];
      }
    },console.log)
  }

  getProjectStatus(){
    this._db.getAllProjectStatus().subscribe(s=>{
      if(s['status'] == ResStatus.CRUD){
        this.projectStatus = s['data'];        
      }
    })
  }


  exportCloserprojectsReport():void{
    let element = document.getElementById('closedProjectsReport'); 
    this.excelServ.exportexcel(element , `closedProjectsReport${this.fileName}`)
   }


   changePrjectStatus(project:Project){
    this.notify.openDialog(
      'Change Project Status?',
      `Are you sure you want to change this Project status?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          // project.status = e.target.value;
          this._db.updateProjectStatus(project.key || '' , project.status).subscribe(res=>{
            if(res['status'] == ResStatus.CRUD){
              this.getClosed();
            }else{
            }
          })
        } else {
          this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }

}
