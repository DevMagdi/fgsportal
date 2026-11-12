import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface BmsConfirmDialogData {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive: boolean;
}

/** Accessible confirmation surface used only by BMS actions. */
@Component({
  selector: 'app-bms-confirm-dialog',
  templateUrl: './bms-confirm-dialog.component.html',
  styleUrls: ['./bms-confirm-dialog.component.scss'],
})
export class BmsConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: BmsConfirmDialogData) {}
}
