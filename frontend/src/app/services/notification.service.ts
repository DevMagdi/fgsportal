import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { DialogComponent } from '../components/dialog/dialog.component';
import { SnackbarComponent, SnackbarData, SnackBarState } from '../components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackbar: MatSnackBar, private dialog: MatDialog) { }
  
  openSnackbar(message: string, state: SnackBarState = SnackBarState.Info, duration: number = 2000) {

    const data: SnackbarData = {
      state: state,
      message: message
    };

    this.snackbar.openFromComponent(SnackbarComponent, {
      duration: duration,
      panelClass: ['blue-snackbar'],
      data: data,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      direction: 'ltr',
      politeness: 'assertive',
    });
  }

  openDialog(
    title: string,
    message: string,
    isTitleMode = false,
    warning = '',
    canTitleBeBlank = false,
    isPasswordMode = false): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {
        title: title,
        message: message,
        warning: warning,
        isTitleMode: isTitleMode,
        canTitleBeBlank: canTitleBeBlank,
        isPasswordMode: isPasswordMode
      }
    });

    return dialogRef.afterClosed();

  }
}
