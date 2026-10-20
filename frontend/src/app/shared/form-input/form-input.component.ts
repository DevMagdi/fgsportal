import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements OnInit {

  @Input() label: string = '';
  @Input() control: FormControl |any;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  // @Input() disabled: boolean=false;
  @Input() accept='';
  @Output() inputChanged = new EventEmitter<boolean>();
  @Output() onFocus = new EventEmitter<boolean>();
  
  constructor() { }

  ngOnInit() {
  }
  inputChange(event:any){
    
    this.inputChanged.emit(event)
  }
  focusout(){
    this.onFocus.emit(true);
  }
}
