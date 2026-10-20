import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { AskForRate, Question, RateAnswers, Rating, UserQuestionAnswers } from 'src/app/interfaces/rating';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ShareRatingDataServiceService } from 'src/app/services/share-rating-data-service.service';

@Component({
  selector: 'app-rate-user',
  templateUrl: './rate-user.component.html',
  styleUrls: ['./rate-user.component.scss']
})
export class RateUserComponent implements OnInit {
  askForRate:AskForRate;
  currentUser:User;
  rateUserLoading:boolean = false;
  ratingForm:FormGroup = new FormGroup({
    'rates':new FormArray([
      new FormGroup({
        'q_id': new FormControl('',Validators.required),
        'q': new FormControl('',Validators.required),
        'q_rate': new FormControl('',Validators.required),
        'q_comment': new FormControl(''),
        'is_rate': new FormControl(true),
      })
    ]),
  })
  rates = this.ratingForm.get('rates') as FormArray;

  questions:Question[] = [];

  constructor(private _db:DatabaseService,
              private _auth:AuthApiService,
              private router:Router,
              private _notify:NotificationService,
              private _shareData:ShareRatingDataServiceService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(res=>{
      this.currentUser = res;
      this.getCurrentRateData();
    })
  }

  getMyRateQuestions(){
    
    
  }


  getCurrentRateData(){
    this.askForRate = this._shareData.getData();
    console.log(this.askForRate);

    
    if(!this.askForRate){
      this.router.navigate([`/manager/rating`])
    }else{
      // this.questions = this.askForRate.question as Question[];          
      // this.questions.map(q =>{
      //   const emptyAns:UserQuestionAnswers = {
      //     question_id:q.id || '',
      //     question_type_id:q.question_type_id,
      //   }
      //   if(q.question_type_id == '1'){
      //     emptyAns.rate = 1;
      //     emptyAns.comment = '';
      //   }else if(q.question_type_id == '2'){
      //     emptyAns.answer = [];
      //     emptyAns.comment = '';
      //   }
      //   q.anss = emptyAns;
      // })
      this._db.getQuestionsByQuestionGroup(this.askForRate.question_group_id).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.questions = res['data'];          
          this.questions.map(q =>{
            const emptyAns:UserQuestionAnswers = {
              question_id:q.id || '',
              question_type_id:q.question_type_id,
            }
            if(q.question_type_id == '1'){
              emptyAns.rate = 1;
              emptyAns.comment = '';
            }else if(q.question_type_id == '2'){
              emptyAns.answer = [];
              emptyAns.comment = '';
            }
            q.anss = emptyAns;
          })
        }else{
          this.questions = [];
        }
      },err=>{
        this.questions = [];
      })
      // for(let i in this.askForRate.question){
      //   if(parseInt(i) == 0){
      //     this.rates.removeAt(0);
      //   }
      //   if(this.askForRate.question[i].rate == '0'){
      //     this.rates.push(new FormGroup({
      //       'q_id': new FormControl(this.askForRate.question[i].id,Validators.required),
      //       'q': new FormControl({value: this.askForRate.question[i].question, disabled: true},Validators.required),
      //       'q_rate': new FormControl(null),
      //       'q_comment': new FormControl('',Validators.required),
      //       'is_rate':new FormControl(false),
      //     }))
      //   }else{
      //     this.rates.push(new FormGroup({
      //       'q_id': new FormControl(this.askForRate.question[i].id,Validators.required),
      //       'q': new FormControl({value: this.askForRate.question[i].question, disabled: true},Validators.required),
      //       'q_rate': new FormControl(1,Validators.required),
      //       'q_comment': new FormControl(''),
      //       'is_rate':new FormControl(true),
      //     }))
      //   }
      // }
    }
  }

  submitRating(){
    this.rateUserLoading = true;
    if(!!this.askForRate.question_group_id){
      const finalRateObj:RateAnswers = {
        question_group_id:this.askForRate.question_group_id,
        // user_to_rate_id : this.askForRate.user_to_rate_id || '',
        questions:[],
        ask_to_rate_id : this.askForRate.id
      }

      this.questions.map(q=>{
        if(!!q.anss){
          if(q.isMulti == '0' && q.question_type_id == '2'){
            const a:any = []
            a.push(q.anss.answer)
            q.anss.answer = a
          }
          finalRateObj.questions.push(q.anss)
        }
      })
  
      this._db.CreateNewRateUser(finalRateObj).subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this._notify.openSnackbar('Success', SnackBarState.Success)
          this.rateUserLoading = false;
          this.router.navigate([`/manager/rating`])
        }else{
          this.rateUserLoading = false;
        }
      },err=>{
        this.rateUserLoading = false;
      }) 
    }else{
      return this._notify.openSnackbar('Error', SnackBarState.Warning)
    }

       
  }


  // submitRating(){
  //   this._notify.openDialog(
  //     'Submit rating?',
  //     `Are you sure you want to Submit rating for ${this.askForRate.user_to_rate_name}?`,
  //     false,
  //     '',
  //     true,
  //     false).subscribe(response => {
  //       if (response) {
  //         this.rateUserLoading = true;
  //         const newRating:Rating = {
  //           ask_to_rate_id : this.askForRate.id || '',
  //           questions:this.ratingForm.get(['rates'])?.value
  //         }
          
  //         this._db.CreateNewRateUser(newRating).subscribe(res=>{
  //           console.log(res);
  //           if(res['status'] == ResStatus.CRUD){
  //             this._notify.openSnackbar('Success', SnackBarState.Success)
  //             this.rateUserLoading = false;
  //             this.router.navigate([`/manager/rating`])
  //           }else{
  //             this.rateUserLoading = false;
  //           }
  //         },err=>{
  //           this.rateUserLoading = false;
  //         })
  //       } else {
  //         this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  //       }
  //   });
    
  // }
  
}
