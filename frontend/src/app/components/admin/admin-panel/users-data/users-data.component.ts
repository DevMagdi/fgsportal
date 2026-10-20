import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountRoles, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';

@Component({
  selector: 'app-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.scss']
})
export class UsersDataComponent implements OnInit {
  usersDataLoader:boolean = false;
  users:User[] = [];
  currentUser:User;
  getToday = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
  fileName= `${this.getToday}.xlsx`;

  constructor(private _auth:AuthApiService,
              private excelServ:ExportExcelService,
              ) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      if(this.currentUser.department == Department.MANAGEMENT||(this.currentUser.department == Department.ADMINSTRATION && this.currentUser.accRole == AccountRoles.HUMAN_RESOURCE)){
        this.getUserData();
      }     
    })
  }

  getUserData(){
    this._auth.getAllUsersData().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.users = res['data']
        this.users.map(u=>{
          if(!!u.mobileNumber){
            const phoneSTR:any = u.mobileNumber            
            u.mobileNumber = JSON.parse(phoneSTR)
          }else{
            u.mobileNumber = [];
          }
        })
        this.users = this.users.sort((a,b)=>{
          return compare(a.username, b.username, true);
        })
      }
    })
  }
  clear(table: Table) {
    table.clear();
  }


  exportUsersDataReport():void{
    let element = document.getElementById('usersDataReport'); 
    this.excelServ.exportexcel(element , `users Data Report ${this.fileName}`)
    
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}