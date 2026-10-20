import { Component, OnInit } from '@angular/core';
import { ResStatus } from 'src/app/interfaces/res-status';
import { OpenToWork, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-open-to-work',
  templateUrl: './open-to-work.component.html',
  styleUrls: ['./open-to-work.component.scss']
})
export class OpenToWorkComponent implements OnInit {
  newServerApi = environment.newServerApi;
  users:OpenToWork[] = [];
  constructor(private _auth:AuthApiService) { }

  ngOnInit(): void {
    this._auth.getAllOpenToWork().subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.users = res['data']
      }else{
        this.users = [];
      }
    },err=>{
      this.users = []
    })
  }

}
