import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/interfaces/project';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-dev-projects',
  templateUrl: './dev-projects.component.html',
  styleUrls: ['./dev-projects.component.scss']
})
export class DevProjectsComponent implements OnInit {



  myProjectsList:Project[]= [];
  constructor(private _db:DatabaseService,
              private _auth:AuthApiService) { }

  ngOnInit(): void {

    this._auth.user.subscribe(
      (user)=>{
        if(!!user){
          this._db.getDevProjects(user.key).subscribe(data=>{
              // console.log(data);
              if(data['status'] == ResStatus.CRUD){
                this.myProjectsList = data['data']
              }
            }
          )
          // if(user.accRoles == AccountRoles.Automation_Engineer){
          // }
          // else if(user.accRoles == AccountRoles.Automation_Engineer){
          //   this.db.getBAProjects(user.key , user.username).subscribe(
          //     (data)=>{
          //       this.myProjectsList = data
          //     }
          //   )
          // }else if(user.accRoles == AccountRoles.Automation_Engineer){
          //   this.db.getTechLeadProjects(user.key).subscribe(
          //     (data)=>{
          //       this.myProjectsList = data
          //     }
          //   )
          // }
        
        }
      }
    )
  }

}
