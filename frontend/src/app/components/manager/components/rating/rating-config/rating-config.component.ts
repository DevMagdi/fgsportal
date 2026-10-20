import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { AskForRate, queestionType, Question, QuestionAnswers, QuestionGroup, QuestionGroupSub_Type, QuestionGroupType } from 'src/app/interfaces/rating';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-rating-config',
  templateUrl: './rating-config.component.html',
  styleUrls: ['./rating-config.component.scss']
})
export class RatingConfigComponent implements OnInit {
  selectedQGType:QuestionGroupType;

  currentUser:User;
  AccountRolesEnum = AccountRoles;

  reatingLoading:boolean = true;
  allUsers:User[]=[];
  filteredUsers:any[];
  /* ================================================ Start Question Group Section  ===================================== */
  allQG:QuestionGroup[]=[];
  allQGTypes:QuestionGroupType[]=[];
  allQGSubTypes:QuestionGroupSub_Type[]=[];

  newQGForm:FormGroup=new FormGroup({
    'title':new FormControl(null,Validators.required),
    'type':new FormControl(null, Validators.required),
    'to':new FormControl(null),
    'id':new FormControl(null),
  })
  filteredQG: any[];
  selectedQG:QuestionGroup|undefined;
  questionGroupOnEditMode:boolean = false;
  
  /* ================================================ End Question Group Section  ===================================== */  

  /* ================================================ Start Question Section  ===================================== */
    questionTypes:queestionType[]=[];
    QGQuestions:Question[]=[];
    newQForm:FormGroup=new FormGroup({
      'id':new FormControl(null),
      'question_type':new FormControl(null,Validators.required),
      'question':new FormControl(null,Validators.required),
      'isMulti':new FormControl(null),
      'answer':new FormArray([]),
    })

    // new FormGroup({
    //   'id':new FormControl(null),
    //   'answer':new FormControl(null)
    // })
    answers = this.newQForm.get('answer') as FormArray;

    questionOnEditMode:boolean = false;
  /* ================================================ End Question Section  ===================================== */


  /* ================================================ Start Ask For Rate Section  ===================================== */

  AFR:AskForRate[]=[];
  newAFRForm:FormGroup=new FormGroup({
    'id':new FormControl(null),
    'user_rate_id':new FormControl(null,Validators.required),
    'user_to_rate_id':new FormControl(null,Validators.required),
  })

  AFROnEditMode:boolean = false;

  /* ================================================ End Ask For Rate Section  ===================================== */
  constructor(private _auth:AuthApiService,
              private _db:DatabaseService,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(res=>{
      this.currentUser = res;
      this.getAllQGTypes();
      // this.getAllQuestionGroup()
    })
  }


  TabSelectionChange(event: any){
    console.log('test');
    
    this.getAllQuestionGroup()
    // if(this.activeIndex == 0){
    // }else if(this.activeIndex == 1){

    // }
  }

  getManagers(){
    this.reatingLoading=true;
    this._auth.getUserByFilter(undefined,undefined,AccountPositions.MANAGER).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.allUsers = res['data'];
        this.reatingLoading=false;
      }else{
        this.allUsers = [];
        this.reatingLoading=false;
      }
    },err=>{
      this.allUsers = [];
      this.reatingLoading=false;
    })
  }


  getAllUsers(){
    this.reatingLoading=true;
    this._auth.getAllUsers().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.allUsers = res['data'];
        this.reatingLoading=false;
      }else{
        this.allUsers = [];
        this.reatingLoading=false;
      }
    },err=>{
      this.allUsers = [];
      this.reatingLoading=false;
    })
  }

  /* ================================================ Start Question Group Section  ===================================== */
  selectQGType(){
    this.getAllQuestionGroup();
  }

  checkIfNormal(){
    if(this.newQGForm.get('type')?.value != '4' && this.selectedQGType.id != '1'){
      this.getManagers();
    }
  }
  
  getAllQuestionGroup(){
    this.reatingLoading = true;
    this.allQG =[];
    this._db.getAllQuestionGroupByType_ID(this.selectedQGType.id || '').subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.allQG = res['data'];        
        this.reatingLoading = false;
      }else{
        this.reatingLoading = false;
        this.allQG =[];
      }
    },err=>{
      this.reatingLoading = false;
      this.allQG =[];
    })
  }


  submitQGForm(){   
    if(this.questionGroupOnEditMode){
      this.submitUpdateQG();
    }else{
      this.createQG()
    }
  }


  createQG(){
    this.reatingLoading = true;
    const newQG:QuestionGroup={
      question_group_title:this.newQGForm.get(['title'])?.value,
      group_sub_type_id:this.newQGForm.get(['type'])?.value,
    }
    if(!!this.newQGForm.get(['to'])?.value){
      newQG.user_id = this.newQGForm.get(['to'])?.value;
    }else{
      newQG.user_id = [];
    }
    this._db.createQuestionGroup(newQG).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.newQGForm.reset();
        this.getAllQuestionGroup();
        this.reatingLoading = false;
      }else{
        this.reatingLoading = false;
      }
    },err=>{
      this.reatingLoading = false;
    })
  }


  updateQG(QG:QuestionGroup){
    this.questionGroupOnEditMode=true;
    this.openNewQuestionGroupModal();
    this.getManagers();
    this.newQGForm.patchValue({
      'title':QG.question_group_title,
      'id':QG.id,
      'type':QG.group_sub_type_id,
      'to':QG.user_id
    })
  }

  changeQGStatus(QG:QuestionGroup){
    if(QG.status == '1'){
      QG.status = '0'
    }else{
      QG.status = '1'
    }
    this._db.updateQuestionGroup(QG).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.newQGForm.reset();
        this.questionGroupOnEditMode=false;
        this.selectedQG=undefined;
        this.getAllQuestionGroup();
        this.reatingLoading = false;
      }else{
        this.reatingLoading = false;
      }
    },err=>{
      this.reatingLoading = false;
    })
  }

  submitUpdateQG(){
    this.reatingLoading = true;
    const newQG:QuestionGroup={
      question_group_title:this.newQGForm.get(['title'])?.value,
      id:this.newQGForm.get(['id'])?.value,
      group_sub_type_id:this.newQGForm.get(['type'])?.value,
      user_id:this.newQGForm.get(['to'])?.value,
    }
    // if(this.newQGForm.get(['type'])?.value == '1'){
    //   newQG.user_id = [];
    // }else{
    //   if(!!this.newQGForm.get(['to'])?.value){
    //     newQG.user_id = this.newQGForm.get(['to'])?.value;
    //   }else{
    //     newQG.user_id = [];
    //   }
    // }

    this._db.updateQuestionGroup(newQG).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.newQGForm.reset();
        this.questionGroupOnEditMode=false;
        this.selectedQG=undefined;
        this.getAllQuestionGroup();
        this.reatingLoading = false;
      }else{
        this.reatingLoading = false;
      }
    },err=>{
      this.reatingLoading = false;
    })
  }

  deleteQG(qg:QuestionGroup){
    this._notify.openDialog(
      'Delete Question Group?',
      `Are you sure you want to Delete Question Group?`,
      false,
      '* By deleting this you will delete all questions and rating related to this group',
      true,
      false).subscribe(response => {
        if (response) {
          this.reatingLoading = true;
          this._db.deleteQuestionGroup(qg.id || '').subscribe(res=>{
            if(res['status']==ResStatus.CRUD){
              this.selectedQG=undefined;
              this.getAllQuestionGroup();
              this.reatingLoading = false;
            }else{
              this.reatingLoading = false;
            }
          },err=>{
            this.reatingLoading = false;
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

  
  filterQG(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.allQG.length; i++) {
      let country = this.allQG[i];
      if (country.question_group_title.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
    }

    this.filteredQG = filtered;
  }

  selectQG(){
    this.getQuestionsByQG();
    this.getAllAskForRate();
    this.getAllUsers();
  }

  getAllQGTypes(){
    this.reatingLoading = true;
    this._db.getAllQuestionGroupTypes().subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.allQGTypes = res['data'];
        this.reatingLoading = false;
      }else{
        this.allQGTypes = []
        this.reatingLoading = false;
      }
    },err=>{
      this.allQGTypes = []
      this.reatingLoading = false;
    })
  }

  getQGSub_typesByTypeID(){
    this.reatingLoading = true;
    this.allQGSubTypes = [];
    this._db.getQuestionGroupSubTypesByTypeID(this.selectedQGType.id || '').subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.allQGSubTypes = res['data'];
        this.reatingLoading = false;
      }else{
        this.allQGSubTypes = []
        this.reatingLoading = false;
      }
    },err=>{
      this.allQGSubTypes = []
      this.reatingLoading = false;
    })
  }

  openNewQuestionGroupModal(){
    this.getQGSub_typesByTypeID();
  }

  /* ================================================ End Question Group Section  ===================================== */


  /* ================================================ Start Question Section  ===================================== */


  opennewQModal(){
    this.getAllQuestionTypes();
  }

  delAnswer(i){
    this.answers.removeAt(i);
  }

  addAnswer(){
    const newG = new FormGroup({
      'id':new FormControl(null),
      'answer': new FormControl('',Validators.required),
    })
    this.answers.push(newG);
  }

  checkType(){
    if(this.newQForm.get('question_type')?.value == '2'){
      this.addAnswer();
    }else{
      this.answers.clear();
    }
  }

  getAllQuestionTypes(){
    this._db.getAllQuestionTypes().subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.questionTypes = res['data'];
        this.reatingLoading = false;
      }else{
        this.reatingLoading = false;
        this.questionTypes =[];
      }
    },err=>{
      this.reatingLoading = false;
      this.questionTypes =[];
    })
  }

  getQuestionsByQG(){
    this.reatingLoading = true;
    this._db.getQuestionsByQuestionGroup(this.selectedQG?.id || '').subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.QGQuestions = res['data'];
        this.reatingLoading = false;
      }else{
        this.reatingLoading = false;
        this.QGQuestions =[];
      }
    },err=>{
      this.reatingLoading = false;
      this.QGQuestions =[];
    })
  }


  submitQuestionForm(){

    if(this.newQForm.get(['question_type'])?.value == '2' && this.answers.length < 2){
      return this._notify.openSnackbar('Answers Should be more than one' , SnackBarState.Warning , 5000)
    }else{
      if(this.questionOnEditMode){
        this.submitUpdateQuestion();
      }else{
        this.createQuestion()
      }
    }
  }

  createQuestion(){
    this.reatingLoading = true;
    const newQ:Question={
      question:this.newQForm.get(['question'])?.value,
      question_type_id:this.newQForm.get(['question_type'])?.value,
      question_group_id:this.selectedQG?.id ? this.selectedQG.id : ''
    }

    if(this.newQForm.get(['question_type'])?.value == '2'){
      if(!this.newQForm.get(['isMulti'])?.value){
        newQ.isMulti = false;
      }else{
        newQ.isMulti = this.newQForm.get(['isMulti'])?.value
      }
      let answers:string[] = [];
      const ans = this.newQForm.get(['answer'])?.value;
      for (let i in ans){
        answers.push(ans[i].answer)
      }
      newQ.answer =answers
    }

    this._db.createQuestion(newQ).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.newQForm.reset();
        this.answers.clear();
        this.getQuestionsByQG();
        this.reatingLoading = false;
      }else{
        this.reatingLoading = false;
      }
    },err=>{
      this.reatingLoading = false;
    })
  }


  updateQusetion(Q:Question){
    this.opennewQModal();
    this.questionOnEditMode = true;
    this.newQForm.patchValue({
      'question':Q.question,
      'id':Q.id,
      'question_type':Q.question_type_id,
    })

    if(Q.question_type_id == '2'){
      this.newQForm.patchValue({
        'isMulti':Q.isMulti == '1' ? true : false,
      })

      for(let i in Q.return_answer){
        const newA = new FormGroup({
          'id': new FormControl(Q.return_answer[i].id,Validators.required),
          'answer': new FormControl(Q.return_answer[i].answer,Validators.required),
        })
        this.answers.push(newA);
      }
    }
  }

  submitUpdateQuestion(){
    this.reatingLoading = true;
    const newQuestion:Question={
      question:this.newQForm.get(['question'])?.value,
      question_type_id:this.newQForm.get(['question_type'])?.value,
      question_group_id:this.selectedQG?.id ? this.selectedQG.id : '',
      id:this.newQForm.get(['id'])?.value
    }


    if(this.newQForm.get(['question_type'])?.value == '2'){
      if(!this.newQForm.get(['isMulti'])?.value){
        newQuestion.isMulti = false;
      }else{
        newQuestion.isMulti = this.newQForm.get(['isMulti'])?.value
      }

      if(!this.newQForm.get(['answer'])?.value){
        return this._notify.openSnackbar('Answers Should be more than one' , SnackBarState.Warning , 5000)
      }else{
        newQuestion.answer = this.newQForm.get(['answer'])?.value;
      }
    }


    this._db.updateQuestion(newQuestion).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.questionOnEditMode = false;
        this.newQForm.reset();
        this.answers.clear();
        this.getQuestionsByQG();
        this.reatingLoading = false;
      }else{
        this.reatingLoading = false;
      }
    },err=>{
      this.reatingLoading = false;
    })
  }

  deleteQuestion(q:Question){
    this._notify.openDialog(
      'Delete Question?',
      `Are you sure you want to Delete Question?`,
      false,
      '* By deleting this you will delete rating related to this group',
      true,
      false).subscribe(response => {
        if (response) {
          this.reatingLoading = true;
          this._db.deleteQuestion(q.id || '').subscribe(res=>{
            if(res['status']==ResStatus.CRUD){
              this.getQuestionsByQG();
              this.reatingLoading = false;
            }else{
              this.reatingLoading = false;
            }
          },err=>{
            this.reatingLoading = false;
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

  /* ================================================ End Question Section  ===================================== */


  /* ================================================ Start Ask For Rate Section  ===================================== */


  // openAskForRateModal(){
  //   this.getAllUsers();
  // }

  getAllAskForRate(){
    this.reatingLoading = true;
    this._db.getAllAskForRate(this.selectedQG?.id || '').subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.AFR = res['data'];
        this.reatingLoading = false;
      }else{
        this.reatingLoading = false;
        this.AFR =[];
      }
    },err=>{
      this.reatingLoading = false;
      this.AFR =[];
    })
  }


  submitAFRForm(){
    if(this.AFROnEditMode){
      this.submitUpdateAskForRate();
    }else{
      this.createAskForRate()
    }
  }

  createAskForRate(){
    this.reatingLoading = true;
    const newAFR:AskForRate={
      user_rate_id:this.newAFRForm.get(['user_rate_id'])?.value,
      user_to_rate_id:this.newAFRForm.get(['user_to_rate_id'])?.value,
      question_group_id:this.selectedQG?.id ? this.selectedQG.id : ''
    }
    this._db.createAskForRate(newAFR).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.newAFRForm.reset();
        this.getAllAskForRate();
        this.reatingLoading = false;
      }else{
        this.reatingLoading = false;
      }
    },err=>{
      this.reatingLoading = false;
    })
  }


  updateAskForRate(afr:AskForRate){
    // this.getAllUsers();
    console.log(afr);
    
    this.AFROnEditMode = true;
    this.newAFRForm.patchValue({
      'id':afr.id,
      'user_rate_id':afr.user_rate_id,
      'user_to_rate_id':afr.user_to_rate_id,
    })
  }

  submitUpdateAskForRate(){
    this.reatingLoading = true;
    const newAFR:AskForRate={
      user_rate_id:this.newAFRForm.get(['user_rate_id'])?.value,
      user_to_rate_id:this.newAFRForm.get(['user_to_rate_id'])?.value,
      question_group_id:this.selectedQG?.id ? this.selectedQG.id : '',
      id:this.newAFRForm.get(['id'])?.value
    }
    this._db.updateAskForRate(newAFR).subscribe(res=>{
      if(res['status']==ResStatus.CRUD){
        this.AFROnEditMode = false;
        this.newAFRForm.reset();
        this.getAllAskForRate();
        this.reatingLoading = false;
      }else{
        this.reatingLoading = false;
      }
    },err=>{
      this.reatingLoading = false;
    })
  }

  deleteAskForRate(afr:AskForRate){
    this._notify.openDialog(
      'Delete Ask For Rate?',
      `Are you sure you want to Delete Ask For Rate?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.reatingLoading = true;
          this._db.deleteAskForRate(afr.id || '').subscribe(res=>{
            if(res['status']==ResStatus.CRUD){
              this.getAllAskForRate();
              this.reatingLoading = false;
            }else{
              this.reatingLoading = false;
            }
          },err=>{
            this.reatingLoading = false;
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
    });
  }

  /* ================================================ End Ask For Rate Section  ===================================== */

  clear(table: Table) {
    table.clear();
  }  


}
