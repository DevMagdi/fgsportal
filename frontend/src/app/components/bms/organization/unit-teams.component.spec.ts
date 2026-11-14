import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { BmsApiService } from '../bms-api.service';
import { BmsConfirmService } from '../bms-confirm.service';
import { BmsLanguageService } from '../bms-language.service';
import { OrgTeam, UnitTeamsComponent } from './unit-teams.component';

const MEMBERS = [
  { id: 1, firstname: 'Mona', lastname: 'Adel' },
  { id: 2, firstname: 'Omar', lastname: 'Said' },
  { id: 3, firstname: 'Aya', lastname: 'Nabil' },
];

function team(overrides: Partial<OrgTeam> = {}): OrgTeam {
  return {
    id: 10, business_unit_id: 5, name: 'Platform', description: null, is_active: true, lead_id: 1, lead: MEMBERS[0],
    members: [MEMBERS[0], MEMBERS[1]], members_count: 2, can_manage: true, can_manage_members: true, ...overrides,
  };
}

describe('UnitTeamsComponent', () => {
  let fixture: ComponentFixture<UnitTeamsComponent>;
  let component: UnitTeamsComponent;
  let calls: { method: string; path: string; body?: any }[];
  let teams: OrgTeam[];
  let failure: any;
  let confirmed: boolean;

  function create(abilities: string[], canManage: boolean, list: OrgTeam[] = [team()]): void {
    calls = []; teams = list; failure = null; confirmed = true;
    const respond = (method: string, path: string, body?: any) => {
      calls.push({ method, path, body });
      if (failure && method !== 'get') return throwError(failure);
      if (method === 'get') return of(teams);
      if (path.endsWith('/development-manager')) return of({ development_manager: MEMBERS.find(person => person.id === body.user_id) || null });
      return of(team());
    };
    const api = {
      get: (path: string, params?: any) => respond('get', path, params),
      post: (path: string, body: any) => respond('post', path, body),
      put: (path: string, body: any) => respond('put', path, body),
      delete: (path: string) => respond('delete', path),
    };
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [UnitTeamsComponent],
      providers: [
        { provide: BmsApiService, useValue: api },
        { provide: BmsLanguageService, useValue: { t: (key: string) => key } },
        { provide: BmsConfirmService, useValue: { confirm: () => of(confirmed) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(UnitTeamsComponent);
    component = fixture.componentInstance;
    component.unitId = 5; component.abilities = abilities; component.members = MEMBERS; component.canManage = canManage;
    component.ngOnChanges({ unitId: new SimpleChange(0, 5, true) });
    fixture.detectChanges();
  }

  // The side panel is not declared here (NO_ERRORS_SCHEMA), so its form is always in the DOM:
  // the assertions look at the teams section only.
  const section = (): HTMLElement => fixture.nativeElement.querySelector('section.org-panel');
  const text = (): string => section().textContent || '';
  const writes = () => calls.filter(call => call.method !== 'get');

  it('loads the teams of the unit only', () => {
    create(['teams.view'], false);
    expect(calls).toEqual([{ method: 'get', path: 'teams', body: { business_unit_id: 5 } }]);
    expect(text()).toContain('Platform');
    expect(text()).toContain('Omar Said');
  });

  it('offers no management action to a read-only account', () => {
    create(['teams.view'], false, [team({ can_manage: false, can_manage_members: false })]);
    expect(component.canManageUnit).toBeFalse();
    expect(section().querySelector('.org-button-primary')).toBeNull();
    expect(section().querySelector('.team-card-actions')).toBeNull();
    expect(text()).not.toContain('teamsDevManagerChange');
  });

  it('does not offer unit management when the ability is held but not for this unit', () => {
    create(['teams.view', 'teams.manage'], false, []);
    expect(component.canManageUnit).toBeFalse();
    expect(section().querySelector('app-bms-state[kind="empty"]')).not.toBeNull();
    expect(text()).not.toContain('teamsNew');
  });

  it('creates a team in this unit and keeps the lead among the members', () => {
    create(['teams.view', 'teams.manage'], true, []);
    component.create();
    component.form.name = '  Data  ';
    component.setLead('3');
    component.toggleMember(2, true);
    component.toggleMember(3, false); // the lead cannot be unticked
    component.save();
    expect(writes()).toEqual([{
      method: 'post', path: 'teams',
      body: { name: 'Data', description: null, is_active: true, lead_id: 3, user_ids: [3, 2], business_unit_id: 5 },
    }]);
    expect(component.panelOpen).toBeFalse();
    expect(component.notice).toBe('teamsSaved');
    expect(calls.filter(call => call.method === 'get').length).toBe(2);
  });

  it('does not submit a team without a name', () => {
    create(['teams.view', 'teams.manage'], true, []);
    component.create();
    component.save();
    expect(writes()).toEqual([]);
    expect(component.nameMissing).toBeTrue();
  });

  it('updates a managed team through the team endpoint', () => {
    create(['teams.view', 'teams.manage'], true);
    component.edit(teams[0]);
    component.setLead('');
    component.toggleMember(1, false);
    component.save();
    expect(writes()).toEqual([{
      method: 'put', path: 'teams/10',
      body: { name: 'Platform', description: null, is_active: true, lead_id: null, user_ids: [2] },
    }]);
  });

  it('lets a team lead change members only, through the members endpoint', () => {
    create(['teams.view', 'teams.manage_own'], false, [team({ can_manage: false, can_manage_members: true })]);
    expect(text()).toContain('teamsEditMembers');
    expect(text()).not.toContain('teamsDelete');
    component.edit(teams[0]);
    expect(component.membersOnly).toBeTrue();
    component.toggleMember(3, true);
    component.save();
    expect(writes()).toEqual([{ method: 'put', path: 'teams/10/members', body: { user_ids: [1, 2, 3] } }]);
  });

  it('shows the server validation message and keeps the panel open', () => {
    create(['teams.view', 'teams.manage'], true);
    component.edit(teams[0]);
    failure = { error: { message: 'The given data was invalid.', errors: { user_ids: ['Every team member must be a member of the team\'s business unit.'] } } };
    component.save();
    expect(component.panelOpen).toBeTrue();
    expect(component.saving).toBeFalse();
    expect(component.formError).toContain('must be a member');
  });

  it('deletes a team only after confirmation', () => {
    create(['teams.view', 'teams.manage'], true);
    confirmed = false;
    component.remove(teams[0]);
    expect(writes()).toEqual([]);
    confirmed = true;
    component.remove(teams[0]);
    expect(writes()).toEqual([{ method: 'delete', path: 'teams/10', body: undefined }]);
    expect(component.notice).toBe('teamsDeleted');
  });

  it('assigns and removes the development manager and reports the change', () => {
    create(['teams.view', 'teams.manage'], true);
    const emitted: any[] = [];
    component.developmentManagerChange.subscribe(value => emitted.push(value));
    component.editManager();
    component.chooseManager('2');
    component.saveManager();
    expect(writes()).toEqual([{ method: 'put', path: 'units/5/development-manager', body: { user_id: 2 } }]);
    expect(emitted).toEqual([MEMBERS[1]]);
    expect(component.managerEditing).toBeFalse();

    component.editManager();
    expect(component.managerChoice).toBe(2);
    component.chooseManager('');
    component.saveManager();
    expect(writes()[1]).toEqual({ method: 'put', path: 'units/5/development-manager', body: { user_id: null } });
    expect(emitted[1]).toBeNull();
  });

  it('keeps the development manager unchanged when the server refuses', () => {
    create(['teams.view', 'teams.manage'], true);
    component.developmentManager = MEMBERS[0];
    component.editManager();
    component.chooseManager('3');
    failure = { error: { message: 'You may not manage teams of this business unit.' } };
    component.saveManager();
    expect(component.developmentManager).toEqual(MEMBERS[0]);
    expect(component.error).toContain('may not manage');
  });

  it('reloads when the unit changes and reports a load failure', () => {
    create(['teams.view'], false);
    component.unitId = 6;
    component.ngOnChanges({ unitId: new SimpleChange(5, 6, false) });
    expect(calls[calls.length - 1]).toEqual({ method: 'get', path: 'teams', body: { business_unit_id: 6 } });
    (TestBed.inject(BmsApiService) as any).get = () => throwError({ status: 500 });
    component.load();
    expect(component.state).toBe('error');
  });
});
