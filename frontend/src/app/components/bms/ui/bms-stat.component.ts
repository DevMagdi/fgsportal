import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** One figure with its label. `value` is rendered as given; a missing value shows a dash, never a made-up number. */
@Component({
  selector: 'app-bms-stat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bms-stat">
      <span class="bms-stat-icon" aria-hidden="true"><i class="bx" [ngClass]="icon"></i></span>
      <div class="bms-stat-copy">
        <span class="bms-stat-value">{{ value === null || value === undefined ? '—' : value }}</span>
        <span class="bms-stat-label">{{ label }}</span>
        <span class="bms-stat-hint" *ngIf="hint">{{ hint }}</span>
      </div>
    </div>`,
  styleUrls: ['./bms-ui.scss'],
})
export class BmsStatComponent {
  @Input() label = '';
  @Input() value: number | string | null | undefined = null;
  @Input() hint = '';
  @Input() icon = 'bx-bar-chart-alt-2';
}
