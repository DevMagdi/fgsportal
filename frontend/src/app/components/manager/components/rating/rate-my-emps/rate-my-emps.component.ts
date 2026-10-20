import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Question, QuestionGroup, RateAnswers, Rating, UserQuestionAnswers } from 'src/app/interfaces/rating';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-rate-my-emps',
  templateUrl: './rate-my-emps.component.html',
  styleUrls: ['./rate-my-emps.component.scss']
})
export class RateMyEmpsComponent implements OnInit {
  currentUser: User;
  myEmps:User[]=[];
  ratingForm:FormGroup = new FormGroup({
    'rates':new FormArray([
      new FormGroup({
        'q_id': new FormControl('',Validators.required),
        'q': new FormControl('',Validators.required),
        'q_rate': new FormControl('',Validators.required),
        'q_comment': new FormControl(''),
        'question_type_id': new FormControl(''),
      })
    ]),
    'user_id':new FormControl(null,Validators.required)
  })
  rates = this.ratingForm.get('rates') as FormArray;
  rateEmpLoading:boolean = false;


  myQG:QuestionGroup[] = [];
  selectedQG:QuestionGroup | undefined;
  selectedUserId:string;
  loadingUsers: boolean = false;


  questions:Question[] = [];

  constructor(private _db:DatabaseService,
              private _auth:AuthApiService,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(res=>{
      this.currentUser = res;
      // this.getMyUsersToRate();
      this.getMyStaticForms();
    })
  }
  // getMyUsersToRate() {
  //   if(this.currentUser.department == Department.MANAGEMENT){
  //     this._auth.getAllUsers().subscribe(res=>{
  //       if(res['status']==ResStatus.CRUD){
  //         this.myEmps = res['data'];
  //         this.myEmps = this.myEmps.filter(u=>u.accPosition != AccountPositions.MANAGER);
  //         this.myEmps = this.myEmps.sort((a,b)=>{
  //           return compare(a.username, b.username, true);
  //         })
  //       }else{
  //         this.myEmps = [];
  //       }
  //     },err=>{
  //       this.myEmps = [];
  //     })
  //   }else if(this.currentUser.department == Department.TECHNICAL_TEAM && this.currentUser.accPosition == AccountPositions.MANAGER){
  //     this._auth.getUserByFilter(Department.TECHNICAL_TEAM).subscribe(res=>{
  //       if(res['status']==ResStatus.CRUD){
  //         this.myEmps = res['data'];
  //         this.myEmps = this.myEmps.filter(u=>u.accPosition != AccountPositions.MANAGER);
  //         this.myEmps = this.myEmps.sort((a,b)=>{
  //           return compare(a.username, b.username, true);
  //         })
  //       }else{
  //         this.myEmps = [];
  //       }
  //     },err=>{
  //       this.myEmps = [];
  //     })
  //   }else if(this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER){
  //     this._auth.getUserByFilter(Department.Business_Development).subscribe(res=>{
  //       if(res['status']==ResStatus.CRUD){
  //         this.myEmps = res['data'];
  //         this.myEmps = this.myEmps.filter(u=>u.accPosition != AccountPositions.MANAGER);
  //         this.myEmps = this.myEmps.sort((a,b)=>{
  //           return compare(a.username, b.username, true);
  //         })
  //       }else{
  //         this.myEmps = [];
  //       }
  //     },err=>{
  //       this.myEmps = [];
  //     })
  //   }else if(this.currentUser.department == Department.ADMINSTRATION && this.currentUser.accPosition == AccountPositions.MANAGER){
  //     this._auth.getUserByFilter(Department.ADMINSTRATION).subscribe(res=>{
  //       if(res['status']==ResStatus.CRUD){
  //         this.myEmps = res['data'];
  //         this.myEmps = this.myEmps.filter(u=>u.accPosition != AccountPositions.MANAGER);
  //         this.myEmps = this.myEmps.sort((a,b)=>{
  //           return compare(a.username, b.username, true);
  //         })
  //       }else{
  //         this.myEmps = [];
  //       }
  //     },err=>{
  //       this.myEmps = [];
  //     })
  //   }
  // }


  selectGroup(){
    this.rates.clear();
    this.ratingForm.reset();
    this.getGroupAvailableUsers();
    this.getMyRateQuestions();
  }


  getGroupAvailableUsers(){
    if(!!this.selectedQG){
      this.loadingUsers = true;
      this._db.getUsersForRateByGroupID(this.selectedQG.id || '').subscribe(res=>{
        if(res['status'] == ResStatus.CRUD){
          this.myEmps = res['data'];        
          this.loadingUsers = false;
        }else{
          this.loadingUsers = false;
          this.myEmps = [];
        }
      },err=>{
        this.loadingUsers = false;
        this.myEmps = [];
      })
    }
  }

  selectUser(){
    this.ratingForm.patchValue({
      'user_id':this.selectedUserId
    })
  }

  getMyStaticForms(){
    this._db.getActiveGroupsQuestionGroupsOnDemand().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.myQG = res['data'];
      }else{
        this.myQG = [];
      }
    },err=>{
      this.myQG = [];
    })
  }

  

  getMyRateQuestions(){
    if(!!this.selectedQG){
      this._db.getQuestionsByQuestionGroup(this.selectedQG.id || '').subscribe(res=>{
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
          // const questions:Question = res['data']
          // console.log(questions);
          // for(let i in questions){
          //   if(parseInt(i) == 0){
          //     this.rates.removeAt(0);
          //   }
          //   if(questions[i].rate == '0'){
          //     this.rates.push(new FormGroup({
          //       'q_id': new FormControl(questions[i].id,Validators.required),
          //       'q': new FormControl({value: questions[i].question, disabled: true},Validators.required),
          //       'q_rate': new FormControl(null),
          //       'q_comment': new FormControl('',Validators.required),
          //       'question_type_id':new FormControl(false),
          //     }))
          //   }else{
          //     this.rates.push(new FormGroup({
          //       'q_id': new FormControl(questions[i].id,Validators.required),
          //       'q': new FormControl({value: questions[i].question, disabled: true},Validators.required),
          //       'q_rate': new FormControl(1,Validators.required),
          //       'q_comment': new FormControl(''),
          //       'question_type_id':new FormControl(true),
          //     }))
          //   }
          // }
        }else{
          this.questions = [];
        }
      },err=>{
        this.questions = [];
      })
    }
  }



  submitRating(){
    this.rateEmpLoading = true;
    if(!!this.selectedQG){
      const finalRateObj:RateAnswers = {
        question_group_id:this.selectedQG.id || '',
        user_to_rate_id : this.selectedUserId,
        questions:[]
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
          this.rateEmpLoading = false;
          this.selectedQG = undefined;
        }else{
          this.rateEmpLoading = false;
        }
      },err=>{
        this.rateEmpLoading = false;
      }) 
    }else{
      return this._notify.openSnackbar('Error', SnackBarState.Warning)
    }

       
  }
  // submitRating(){
  //   this._notify.openDialog(
  //     'Submit rating?',
  //     `Are you sure you want to Submit rating for ${this.ratingForm.get(['user_id'])?.value}?`,
  //     false,
  //     '',
  //     true,
  //     false).subscribe(response => {
  //       if (response) {
  //         this.rateEmpLoading = true;
  //         const newRating:Rating = {
  //           ask_to_rate_id : this.ratingForm.get(['user_id'])?.value,
  //           questions:this.ratingForm.get(['rates'])?.value
  //         }
          
  //         this._db.CreateNewRateUser(newRating).subscribe(res=>{
  //           console.log(res);
  //           if(res['status'] == ResStatus.CRUD){
  //             this._notify.openSnackbar('Success', SnackBarState.Success)
  //             this.rateEmpLoading = false;
  //             this.ratingForm.reset();
  //           }else{
  //             this.rateEmpLoading = false;
  //           }
  //         },err=>{
  //           this.rateEmpLoading = false;
  //         })
  //       } else {
  //         this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
  //       }
  //   });
    
  // }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}