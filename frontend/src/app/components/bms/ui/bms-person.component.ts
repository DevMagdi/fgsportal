import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { initials } from '../organization/organization.util';

/** A person shown once, the same way everywhere: initials, name and an optional second line. */
@Component({
  selector: 'app-bms-person',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="bms-person" [class.bms-person-compact]="compact">
      <span class="bms-person-avatar" aria-hidden="true">{{ letters }}</span>
      <span class="bms-person-copy">
        <span class="bms-person-name">{{ name || '-' }}</span>
        <span class="bms-person-detail" *ngIf="detail">{{ detail }}</span>
      </span>
    </span>`,
  styleUrls: ['./bms-ui.scss'],
})
export class BmsPersonComponent {
  @Input() name = '';
  @Input() detail = '';
  @Input() compact = false;
  get letters(): string { return initials(this.name); }
}
