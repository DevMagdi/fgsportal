import { Component, EventEmitter, Input, Output } from '@angular/core';

export type BmsStateKind = 'loading' | 'empty' | 'error' | 'success';

/** Small accessible state primitive shared by BMS shell surfaces. */
@Component({
  selector: 'app-bms-state',
  templateUrl: './bms-state.component.html',
  styleUrls: ['./bms-state.component.scss'],
})
export class BmsStateComponent {
  @Input() kind: BmsStateKind = 'empty';
  @Input() message = '';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();

  activate(): void {
    this.action.emit();
  }
}
