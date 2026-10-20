import { Component, OnInit, Output } from '@angular/core';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-incentive',
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.scss']
})
export class IncentiveComponent implements OnInit {
  @Output() currentUser:User;
  DepartmentEnum = Department;
  accPositionEnum = AccountPositions;
  unPaidIncentiveNum:number = 0;
  lableName:string = 'Unpaid Incentive'
  constructor(private _auth:AuthApiService,
              private _finance:FinanceService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{      
      this.currentUser = user;
    })
    // this.auth.user.subscribe(user=>{
    //   this.currentUser = user;
    // })
    

    this._finance.getUnPaidIncentive().subscribe(inc=>{
      if(inc['status']==ResStatus.CRUD){
        this.unPaidIncentiveNum = inc['data'].length;
        if(this.unPaidIncentiveNum > 0){
          this.lableName = this.lableName + " " + this.unPaidIncentiveNum
        }
      }else{
        this.unPaidIncentiveNum = 0;
      }
    })
    // this._salary.getUnPaidIncentive().subscribe(inc=>{
    //   this.unPaidIncentiveNum = inc.length;
    //   if(this.unPaidIncentiveNum > 0){
    //     this.lableName = this.lableName + " " + this.unPaidIncentiveNum
    //   }
    // })
  }



}
