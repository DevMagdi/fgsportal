import { Component, OnInit,Input,Output ,EventEmitter} from '@angular/core';
import { Question, UserQuestionAnswers } from 'src/app/interfaces/rating';

@Component({
  selector: 'app-standard-rate-form',
  templateUrl: './standard-rate-form.component.html',
  styleUrls: ['./standard-rate-form.component.scss']
})
export class StandardRateFormComponent implements OnInit {
  @Input() question:Question[] = [];
  @Output() questionOutput = new EventEmitter<Question[]>();

  constructor() { 

    
  }

  ngOnInit(): void {   
    this.question.map(q =>{
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


  }


  submitRate(){
    this.questionOutput.emit(this.question);
  }
}
