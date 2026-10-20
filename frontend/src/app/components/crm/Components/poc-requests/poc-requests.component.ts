import { Component, OnInit } from '@angular/core';
import { PocRequests, RFPRequests } from 'src/app/interfaces/leadsAndContacts';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-poc-requests',
  templateUrl: './poc-requests.component.html',
  styleUrls: ['./poc-requests.component.scss']
})
export class PocRequestsComponent implements OnInit {
  currentUser:User;
  myRequests:PocRequests[] = [];
  departmentEnum = Department;
  myRFPRequests:RFPRequests[] = [];
  activeIndex=0;
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private _noify:NotificationService,) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;
      this.getMyRequests();
      this.getMyRFPRequest();
    })
  }



  getMyRFPRequest(){
    if(this.currentUser.accRole == AccountRoles.SUPER_USER){
      this._db.getAllRFPRequestsForManager().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myRFPRequests = res['data'];
        }else{
          this.myRFPRequests = [];
        }
      },err=>{
        this.myRFPRequests = [];
      })
    }else if(this.currentUser.department == Department.MANAGEMENT || (this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER)){
      this._db.getMyRFPRequestsForManager().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myRFPRequests = res['data'];
        }else{
          this.myRFPRequests = [];
        }
      },err=>{
        this.myRFPRequests = [];
      })
    }else if(this.currentUser.accRole == AccountRoles.SALES){
      this._db.getMyRFPRequestsForSales().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myRFPRequests = res['data'];
        }else{
          this.myRFPRequests = [];
        }
      },err=>{
        this.myRFPRequests = [];
      })
    }
  }


  getMyRequests(){
    if(this.currentUser.accRole == AccountRoles.SUPER_USER){
      this._db.getAllPocRequestsForManager().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myRequests = res['data'];
        }else{
          this.myRequests = [];
        }
      },err=>{
        this.myRequests = [];
      })
    }else if(this.currentUser.department == Department.MANAGEMENT){
      this._db.getMyPocRequestsForManager().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myRequests = res['data'];
        }else{
          this.myRequests = [];
        }
      },err=>{
        this.myRequests = [];
      })
    }else if(this.currentUser.accRole == AccountRoles.SALES){
      this._db.getMyPocRequestsForSales().subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myRequests = res['data'];
        }else{
          this.myRequests = [];
        }
      },err=>{
        this.myRequests = [];
      })
    }
  }
}
