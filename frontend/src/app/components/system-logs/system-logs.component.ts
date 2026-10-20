import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResStatus } from 'src/app/interfaces/res-status';
import { SystemLogs } from 'src/app/interfaces/system-logs';
import { AccountRoles } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-system-logs',
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.scss']
})
export class SystemLogsComponent implements OnInit {
  limit:number = 50;
  myLogs:SystemLogs[] = [];
  showInKey:boolean = false;
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private router:Router,) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      if(user.accRole != AccountRoles.SUPER_USER){
        this.router.navigate(['/'])
      }
      this.loadLogs();
    })
  }

  loadLogs(){
    this._db.getSystemLogs(this.limit).subscribe(logs=>{
      if(logs['status'] == ResStatus.CRUD){
        this.myLogs = logs['data'];//.slice().reverse();
      }
    })
  }

  loadMore(){
    this.limit += 50;   
    this.loadLogs();
  }


  changeMode(){
    this.showInKey = !this.showInKey
  }

}
