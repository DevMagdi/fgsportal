import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BmsLanguageService } from '../../components/bms/bms-language.service';
import { EMPTY_NAV_COUNTERS, NavCounterKey, NavCounters, NavGroup, VisibleNavGroup } from '../navigation/nav.model';

/** The one and only application sidebar. It renders whatever the shell resolved as visible. */
@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss'],
})
export class AppSidebarComponent implements OnChanges {
  @Input() groups: VisibleNavGroup[] = [];
  @Input() activeGroupId = '';
  @Input() activeItemId = '';
  @Input() counters: NavCounters = EMPTY_NAV_COUNTERS;
  /** Desktop icon-rail mode. */
  @Input() collapsed = false;
  @Input() mobile = false;
  @Input() mobileOpen = false;
  @Input() abilitiesLoading = false;
  @Input() abilitiesFailed = false;
  @Input() showOpenToWork = false;

  @Output() navigated = new EventEmitter<void>();
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() retryAbilities = new EventEmitter<void>();
  @Output() openToWork = new EventEmitter<void>();

  private expanded = new Set<string>();

  /** Where focus was before the mobile drawer opened, so it can be handed back. */
  private returnFocusTo: HTMLElement | null = null;

  constructor(public lang: BmsLanguageService, private host: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.activeGroupId && this.activeGroupId) this.expanded.add(this.activeGroupId);
    if (changes.mobileOpen && !changes.mobileOpen.firstChange && this.mobile) {
      if (this.mobileOpen) {
        this.returnFocusTo = document.activeElement as HTMLElement | null;
        // Wait for `inert` to be lifted by the same change detection pass.
        setTimeout(() => this.focusable()[0]?.focus());
      } else {
        const target = this.returnFocusTo;
        this.returnFocusTo = null;
        if (target && document.contains(target)) target.focus();
      }
    }
  }

  /** While the mobile drawer is open, Tab cycles inside it (the page behind is covered by the backdrop). */
  @HostListener('keydown', ['$event']) trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.mobile || !this.mobileOpen) return;
    const items = this.focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const current = document.activeElement;
    if (event.shiftKey && current === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && current === last) { event.preventDefault(); first.focus(); }
  }

  private focusable(): HTMLElement[] {
    const nodes = this.host.nativeElement.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    return Array.from(nodes).filter(node => node.offsetParent !== null);
  }

  /** Labels and sub-lists are only rendered when there is room for them. */
  get rail(): boolean { return this.collapsed && !this.mobile; }

  isExpanded(group: NavGroup): boolean { return this.expanded.has(group.id); }

  toggle(group: NavGroup): void {
    if (this.rail) {
      // In the icon rail a group opens the full sidebar on that group.
      this.expanded.add(group.id);
      this.collapsedChange.emit(false);
      return;
    }
    if (this.expanded.has(group.id)) this.expanded.delete(group.id);
    else this.expanded.add(group.id);
  }

  badge(key?: NavCounterKey): number { return key ? (this.counters[key] || 0) : 0; }

  startsSection(index: number): boolean {
    return index === 0 || this.groups[index - 1].section !== this.groups[index].section;
  }

  sectionLabel(group: NavGroup): string { return group.section === 'bms' ? 'sectionBms' : 'sectionWorkspaces'; }

  trackGroup(_index: number, group: NavGroup): string { return group.id; }
  trackItem(_index: number, item: { id: string }): string { return item.id; }
}
