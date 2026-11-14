import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

/**
 * Side panel for forms that used to sit above a list. It is a modal dialog:
 * focus moves in when it opens, Tab stays inside, Escape and the backdrop
 * close it, and focus returns to whatever opened it.
 */
@Component({
  selector: 'app-bms-side-panel',
  template: `
    <div class="bms-panel-backdrop" *ngIf="open" (click)="close()"></div>
    <aside class="bms-panel" *ngIf="open" #panel role="dialog" aria-modal="true" [attr.aria-label]="heading" tabindex="-1" (keydown)="trapFocus($event)">
      <header class="bms-panel-header">
        <h2>{{ heading }}</h2>
        <button type="button" class="bms-panel-close" (click)="close()" [attr.aria-label]="closeLabel"><i class="bx bx-x" aria-hidden="true"></i></button>
      </header>
      <div class="bms-panel-content"><ng-content></ng-content></div>
    </aside>`,
  styleUrls: ['./bms-side-panel.component.scss'],
})
export class BmsSidePanelComponent implements OnChanges {
  @Input() open = false;
  @Input() heading = '';
  @Input() closeLabel = 'Close';
  @Output() closed = new EventEmitter<void>();
  @ViewChild('panel') panel?: ElementRef<HTMLElement>;

  private opener: HTMLElement | null = null;
  private static readonly FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.open) return;
    if (this.open) {
      this.opener = document.activeElement as HTMLElement | null;
      setTimeout(() => {
        const host = this.panel?.nativeElement;
        const first = host?.querySelector<HTMLElement>('.bms-panel-content ' + BmsSidePanelComponent.FOCUSABLE.split(', ').join(', .bms-panel-content '));
        (first || host)?.focus();
      });
    } else if (!changes.open.firstChange) {
      const opener = this.opener;
      this.opener = null;
      setTimeout(() => { if (opener && document.contains(opener)) opener.focus(); });
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { if (this.open) this.close(); }

  close(): void {
    // Escape closes the panel while a field still has focus. Removing a focused field makes the browser
    // fire its blur in the middle of the render pass, which changes the form state after it was checked.
    // Letting go of focus first keeps that change inside this event.
    const active = document.activeElement as HTMLElement | null;
    if (active && this.panel?.nativeElement.contains(active)) active.blur();
    this.closed.emit();
  }

  trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.panel) return;
    const items = Array.from(this.panel.nativeElement.querySelectorAll<HTMLElement>(BmsSidePanelComponent.FOCUSABLE)).filter(item => item.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
}
