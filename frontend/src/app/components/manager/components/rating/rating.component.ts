import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { AskForRate, Question, QuestionGroup } from 'src/app/interfaces/rating';
import { ResStatus } from 'src/app/interfaces/res-status';
import { Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ShareRatingDataServiceService } from 'src/app/services/share-rating-data-service.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  currentUser:User;
  departmentEnum = Department;
  reatingLoading:boolean = true;
  myAskForRate:AskForRate[]=[];
  activeIndex: number = 0;

  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private _notify:NotificationService,
              private router:Router,
              private _shareData:ShareRatingDataServiceService) { }


  ngOnInit(): void {
    this._auth.user.subscribe(res=>{
      this.currentUser = res;
      this.getMyPendingRating();
    })
  }


  getMyPendingRating(){
    this.reatingLoading = true;
    this._db.getMyPendingAskForRate().subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.myAskForRate=res['data'];
        this.reatingLoading = false;
      }else{
        this.myAskForRate=[]
        this.reatingLoading = false;
      }
    },err=>{
      this.myAskForRate=[]
      this.reatingLoading = false;
    })
  }


  rateUser(askForRate:AskForRate){
    // this.router.navigate([`/manager/rating/${askForRate.id}`], { queryParams: { askForRate: JSON.stringify(askForRate) }})
    this._shareData.setData(askForRate)
    this.router.navigate([`/manager/rating/${askForRate.id}`])
  }


}
