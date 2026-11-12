import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BmsLanguageService } from './bms-language.service';
import { BmsConfirmDialogComponent, BmsConfirmDialogData } from './bms-confirm-dialog.component';

export interface BmsConfirmOptions {
  title?: string;
  confirmLabel?: string;
  destructive?: boolean;
}

/** BMS-scoped Material confirmation dialog; returns false when dismissed. */
@Injectable()
export class BmsConfirmService {
  constructor(private dialog: MatDialog, private lang: BmsLanguageService) {}

  confirm(message: string, options: BmsConfirmOptions = {}): Observable<boolean> {
    const data: BmsConfirmDialogData = {
      title: options.title || this.lang.t('confirmTitle'),
      message,
      confirmLabel: options.confirmLabel || this.lang.t('continue'),
      cancelLabel: this.lang.t('cancel'),
      destructive: !!options.destructive,
    };

    return this.dialog.open<BmsConfirmDialogComponent, BmsConfirmDialogData, boolean>(BmsConfirmDialogComponent, {
      data,
      panelClass: 'bms-dialog-panel',
      ariaDescribedBy: 'bms-confirm-message',
      width: '440px',
      maxWidth: 'calc(100vw - 28px)',
      autoFocus: 'dialog',
      restoreFocus: true,
      direction: this.lang.direction,
    }).afterClosed().pipe(map(confirmed => confirmed === true));
  }
}
