import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { hasAbility } from '../bms-abilities.util';
import { BmsApiService } from '../bms-api.service';
import { BmsConfirmService } from '../bms-confirm.service';
import { BmsLanguageService } from '../bms-language.service';
import { personName } from './organization.util';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export interface TeamPerson { id: number; username?: string; firstname?: string; lastname?: string; email?: string; }
export interface OrgTeam {
  id: number; business_unit_id: number; name: string; description: string | null; is_active: boolean;
  lead_id: number | null; lead: TeamPerson | null; members: TeamPerson[]; members_count: number;
  can_manage: boolean; can_manage_members: boolean;
}
interface TeamForm { name: string; description: string; is_active: boolean; lead_id: number | null; user_ids: number[]; }

/**
 * Teams of one business unit and the unit's development manager (Stage B2).
 *
 *   teams?business_unit_id=            -> teams.view
 *   POST/PUT/DELETE teams              -> teams.manage, for this unit (the server decides: `can_manage`)
 *   PUT teams/{id}/members             -> team managers, or the team's own lead (`can_manage_members`)
 *   PUT units/{id}/development-manager -> teams.manage, for this unit
 *
 * Only members of the unit are offered as team members, team lead or development
 * manager; the server enforces the same rule. Nothing here reads or writes the
 * reporting line (manager_id).
 */
@Component({
  selector: 'app-unit-teams',
  templateUrl: './unit-teams.component.html',
  styleUrls: ['./organization-shared.scss', './unit-teams.component.scss'],
})
export class UnitTeamsComponent implements OnChanges, OnDestroy {
  @Input() unitId = 0;
  @Input() abilities: string[] = [];
  /** Members of the unit: the only people who may join a team, lead one, or be development manager. */
  @Input() members: TeamPerson[] = [];
  /** `can_manage_teams` of the unit payload. */
  @Input() canManage = false;
  @Input() developmentManager: TeamPerson | null = null;
  @Output() developmentManagerChange = new EventEmitter<TeamPerson | null>();

  teams: OrgTeam[] = [];
  state: LoadState = 'idle';
  notice = '';
  error = '';

  panelOpen = false;
  editing: OrgTeam | null = null;
  /** True when the panel may only change the member list (the team's own lead). */
  membersOnly = false;
  form: TeamForm = this.emptyForm();
  submitted = false;
  saving = false;
  formError = '';

  managerEditing = false;
  managerChoice: number | null = null;
  managerSaving = false;

  private request?: Subscription;

  constructor(private api: BmsApiService, public lang: BmsLanguageService, private confirmDialog: BmsConfirmService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.unitId) {
      this.closePanel();
      this.managerEditing = false;
      this.notice = ''; this.error = '';
      this.load();
    }
  }

  ngOnDestroy(): void { this.request?.unsubscribe(); }

  /**
   * Creating a team and changing the development manager need teams.manage FOR THIS UNIT.
   * Holding the ability is not enough, so the server's answer for the unit (`can_manage_teams`) decides.
   */
  get canManageUnit(): boolean { return this.canManage && hasAbility(this.abilities, 'teams.manage'); }
  get candidates(): TeamPerson[] {
    return (this.members || []).slice().sort((a, b) => this.name(a).localeCompare(this.name(b)));
  }
  get nameMissing(): boolean { return this.submitted && !this.form.name.trim(); }

  name(person: TeamPerson | null | undefined): string { return person ? personName(person) : ''; }

  load(): void {
    this.request?.unsubscribe();
    this.teams = [];
    if (!Number.isInteger(this.unitId) || this.unitId <= 0) { this.state = 'idle'; return; }
    this.state = 'loading';
    this.request = this.api.get<OrgTeam[]>('teams', { business_unit_id: this.unitId }).subscribe({
      next: data => { this.teams = data || []; this.state = 'ready'; },
      error: () => this.state = 'error',
    });
  }

  /* ----------------------------------------------------------------- teams */

  create(): void {
    this.editing = null; this.membersOnly = false;
    this.form = this.emptyForm();
    this.openPanel();
  }

  edit(team: OrgTeam): void {
    this.editing = team;
    this.membersOnly = !team.can_manage;
    this.form = {
      name: team.name, description: team.description || '', is_active: team.is_active,
      lead_id: team.lead_id, user_ids: team.members.map(member => member.id),
    };
    this.openPanel();
  }

  private openPanel(): void { this.submitted = false; this.formError = ''; this.panelOpen = true; }
  closePanel(): void { this.panelOpen = false; this.saving = false; }

  isMember(id: number): boolean { return this.form.user_ids.includes(id); }
  /** The lead is always a member, so their checkbox cannot be cleared. */
  isLead(id: number): boolean { return this.form.lead_id === id; }

  toggleMember(id: number, checked: boolean): void {
    if (this.isLead(id)) return;
    this.form.user_ids = checked ? Array.from(new Set(this.form.user_ids.concat(id))) : this.form.user_ids.filter(member => member !== id);
  }

  setLead(value: string | number | null): void {
    const id = value === null || value === '' ? null : Number(value);
    this.form.lead_id = id;
    if (id !== null && !this.form.user_ids.includes(id)) this.form.user_ids = this.form.user_ids.concat(id);
  }

  save(): void {
    this.submitted = true;
    if (this.saving) return;
    if (!this.membersOnly && !this.form.name.trim()) return;
    this.saving = true; this.formError = '';

    const full = {
      name: this.form.name.trim(), description: this.form.description.trim() || null, is_active: this.form.is_active,
      lead_id: this.form.lead_id, user_ids: this.form.user_ids,
    };
    const request = !this.editing
      ? this.api.post<OrgTeam>('teams', { ...full, business_unit_id: this.unitId })
      : this.membersOnly
        ? this.api.put<OrgTeam>(`teams/${this.editing.id}/members`, { user_ids: this.form.user_ids })
        : this.api.put<OrgTeam>(`teams/${this.editing.id}`, full);

    request.subscribe({
      next: () => { this.closePanel(); this.flash(this.lang.t('teamsSaved')); this.load(); },
      error: failure => { this.saving = false; this.formError = this.message(failure, 'teamsSaveError'); },
    });
  }

  remove(team: OrgTeam): void {
    this.confirmDialog.confirm(this.lang.t('teamsDeleteConfirm'), { title: this.lang.t('teamsDelete'), confirmLabel: this.lang.t('teamsDelete'), destructive: true })
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.api.delete(`teams/${team.id}`).subscribe({
          next: () => { this.flash(this.lang.t('teamsDeleted')); this.load(); },
          error: failure => { this.notice = ''; this.error = this.message(failure, 'error'); },
        });
      });
  }

  /* --------------------------------------------------- development manager */

  editManager(): void { this.managerChoice = this.developmentManager?.id ?? null; this.managerEditing = true; this.error = ''; }
  cancelManager(): void { this.managerEditing = false; }
  chooseManager(value: string | number | null): void { this.managerChoice = value === null || value === '' ? null : Number(value); }

  saveManager(): void {
    if (this.managerSaving) return;
    this.managerSaving = true;
    this.api.put<any>(`units/${this.unitId}/development-manager`, { user_id: this.managerChoice }).subscribe({
      next: unit => {
        this.managerSaving = false; this.managerEditing = false;
        this.developmentManager = unit?.development_manager || null;
        this.developmentManagerChange.emit(this.developmentManager);
        this.flash(this.lang.t('teamsDevManagerSaved'));
      },
      error: failure => { this.managerSaving = false; this.notice = ''; this.error = this.message(failure, 'error'); },
    });
  }

  /* ----------------------------------------------------------------- helpers */

  private emptyForm(): TeamForm { return { name: '', description: '', is_active: true, lead_id: null, user_ids: [] }; }
  private flash(text: string): void { this.error = ''; this.notice = text; }

  /** First validation message the server returned, else its message, else a translated fallback. */
  private message(failure: any, fallback: string): string {
    const fields = failure?.error?.errors;
    if (fields && typeof fields === 'object') {
      const first = Object.keys(fields).map(key => fields[key]).find(value => Array.isArray(value) && value.length);
      if (first) return String(first[0]);
    }
    return failure?.error?.message || this.lang.t(fallback);
  }

  trackId(_index: number, item: { id: number }): number { return item.id; }
}
