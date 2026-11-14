import { BMS_NAVIGATION_GROUPS, BmsNavigationState } from './bms-navigation';
import { BMS_MODULE_KEYS } from './bms-catalog';
import { of } from 'rxjs';
import { BmsAccessService } from './bms-access.service';
import { BMS_EXTRA_LABELS } from './bms-translations';

describe('BMS six-category navigation', () => {
  it('defines exactly the approved top-level groups in order', () => {
    expect(BMS_NAVIGATION_GROUPS.map(group => group.label)).toEqual([
      'grpOrganization', 'grpAccessManagement', 'grpExecution',
      'grpBusinessDev', 'grpOperations', 'grpReports',
    ]);
  });

  it('provides the six approved category labels in English and Arabic', () => {
    const labels = BMS_NAVIGATION_GROUPS.map(group => group.label);
    labels.forEach(key => {
      expect(BMS_EXTRA_LABELS.en[key]).toBeTruthy();
      expect(BMS_EXTRA_LABELS.ar[key]).toBeTruthy();
    });
    expect(BMS_EXTRA_LABELS.en.grpOrganization).toBe('Organization');
    expect(BMS_EXTRA_LABELS.en.grpAccessManagement).toBe('Access Management');
    expect(BMS_EXTRA_LABELS.en.grpExecution).toBe('Execution');
    expect(BMS_EXTRA_LABELS.en.grpBusinessDev).toBe('Business Development');
    expect(BMS_EXTRA_LABELS.en.grpOperations).toBe('Operations');
    expect(BMS_EXTRA_LABELS.en.grpReports).toBe('Reports');
  });

  it('maps every existing BMS route exactly once without orphaning a workflow', () => {
    const paths = BMS_NAVIGATION_GROUPS.reduce((all: string[], group) =>
      all.concat(group.links.map(link => link.path)), []);
    expect(paths.length).toBe(BMS_MODULE_KEYS.length);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.slice().sort()).toEqual(BMS_MODULE_KEYS.slice().sort());
  });

  it('filters links by existing abilities and leaves an empty category without links', () => {
    const state = new BmsNavigationState();
    const organization = BMS_NAVIGATION_GROUPS[0];
    expect(state.visibleLinks(organization, []).length).toBe(0);
    expect(state.visibleLinks(organization, ['development.view']).map(link => link.path))
      .toEqual(['development']);
    expect(state.visibleLinks(organization, ['units.view', 'directory.view']).map(link => link.path))
      .toEqual(['organization', 'units', 'employees']);
  });

  it('expands and collapses categories and follows the active route', () => {
    const state = new BmsNavigationState();
    expect(state.isExpanded('reports')).toBe(true);
    state.toggle('reports');
    expect(state.isExpanded('reports')).toBe(false);
    state.toggle('organization');
    expect(state.isExpanded('organization')).toBe(true);
    state.expandForPath('/bms/development?tab=training');
    expect(state.isExpanded('organization')).toBe(true);
    expect(state.groupForPath('/bms/development')?.id).toBe('organization');
    expect(state.linkForPath('/bms/leads/123')?.path).toBe('leads');
  });

  it('preserves the development route and its current permission ability', () => {
    const link = BMS_NAVIGATION_GROUPS[0].links.find(item => item.path === 'development');
    expect(link?.ability).toBe('development.view');
    expect(link?.label).toBe('development');
  });

  it('keeps the existing route guard behavior for authorized and unauthorized routes', () => {
    const router = { url: '/bms/units', createUrlTree: (commands: string[]) => ({ redirect: commands[0] }) };
    const allowedAccess = new BmsAccessService({ get: () => of({ can: ['units.view'] }) } as any);
    const deniedAccess = new BmsAccessService({ get: () => of({ can: [] }) } as any);
    let allowed: any;
    let denied: any;
    allowedAccess.guard('units.view', router as any).subscribe(result => allowed = result);
    deniedAccess.guard('units.view', router as any).subscribe(result => denied = result);
    expect(allowed).toBe(true);
    expect(denied.redirect).toBe('/bms/no-access');
  });
});
