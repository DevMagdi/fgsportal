import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
  title: string;
  message: string;
  warning: string;
  isTitleMode?: boolean;
  isPasswordMode?: boolean;
  canTitleBeBlank: boolean;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  // matcher = new CustomErrorStateMatcher();

  titleFormControl: FormControl;

  lessonTitle = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<DialogComponent>
  ) { }

  ngOnInit(): void {
    this.titleFormControl = new FormControl('', [
      Validators.required
    ]);
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      if (this.titleFormControl.value !== '') {
        this.dialogRef.close(this.titleFormControl.value);
      }
    }
  }

}
