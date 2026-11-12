import { BmsShellComponent } from './bms-shell.component';
import { BmsAccessService } from './bms-access.service';
import { BmsApiService } from './bms-api.service';
import { BmsLanguageService } from './bms-language.service';
import { Router } from '@angular/router';

describe('BmsShellComponent', () => {
  let language: BmsLanguageService;
  let router: any;
  let shell: BmsShellComponent;
  let originalDirection: string;

  beforeEach(() => {
    language = new BmsLanguageService();
    router = { url: '/bms/development' };
    originalDirection = document.documentElement.getAttribute('dir') || '';
    shell = new BmsShellComponent(language, {} as BmsApiService, {} as BmsAccessService, router as Router);
  });

  afterEach(() => {
    shell.ngOnDestroy();
    if (originalDirection) document.documentElement.setAttribute('dir', originalDirection);
    else document.documentElement.removeAttribute('dir');
  });

  it('scopes language direction to the BMS shell and leaves the legacy document direction untouched', () => {
    document.documentElement.setAttribute('dir', 'ltr');
    language.language$.next('ar');
    expect(shell.direction).toBe('rtl');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    language.language$.next('en');
    expect(shell.direction).toBe('ltr');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });

  it('resolves active category and breadcrumb labels from the preserved route', () => {
    expect(shell.currentCategoryKey()).toBe('grpOrganization');
    expect(shell.currentTitleKey()).toBe('development');
    expect(shell.isGroupActive('organization')).toBe(true);
    expect(shell.isActive(shell.groups[0].links[3])).toBe(true);
  });

  it('supports responsive menu open and close state', () => {
    shell.isMobile = true;
    shell.toggleMenu();
    expect(shell.menuOpen).toBe(true);
    shell.closeMenu();
    expect(shell.menuOpen).toBe(false);
  });
});
