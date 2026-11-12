import { Component, OnInit } from '@angular/core';
import { BmsAccessService } from '../bms-access.service';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsLanguageService } from '../bms-language.service';
import { BmsExportService } from '../bms-export.service';
import { BmsConfirmService } from '../bms-confirm.service';

/**
 * Access & roles (BRD section 18): permission matrix, current assignments per
 * employee, assign/revoke with an explicit confirmation, and the audit trail
 * of every role change. Scope enforcement lives on the server.
 */
@Component({ selector: 'app-bms-access', templateUrl: './access.component.html', styleUrls: ['../bms-shared.scss'] })
export class AccessComponent extends BmsBaseComponent implements OnInit {
  assignment: any = { user_id: '', role_id: '', business_unit_id: '' };
  search = '';
  roleFilter = '';
  unitFilter = '';
  assignmentsByUser: { [key: number]: any[] } = {};
  selectedEmployee: any = null;
  audit: any[] = [];

  constructor(api: BmsApiService, lang: BmsLanguageService, private exporter: BmsExportService, private access: BmsAccessService, private confirmDialog: BmsConfirmService) { super(api, lang); }

  ngOnInit(): void { super.ngOnInit(); this.loadAudit(); }

  rows(): any[] {
    return (this.lookups.roles || []).map((role: any) => ({ Role: role.name, Slug: role.slug, Permissions: (role.abilities || []).join(', ') }));
  }

  excel(): void { this.exporter.excel([{ name: 'BMS roles', rows: this.rows() }], 'bms-role-matrix'); }
  pdf(): void { this.exporter.pdf(this.lang.t('roleMatrix'), this.rows(), 'bms-role-matrix'); }

  employees(): any[] {
    const term = (this.search || '').toLowerCase();
    return (this.lookups.users || []).filter((user: any) =>
      !term || `${user.username || ''} ${user.firstname || ''} ${user.lastname || ''} ${user.email || ''}`.toLowerCase().includes(term)
    ).filter((user: any) => !this.unitFilter || (this.assignmentsByUser[user.id] || []).some((a: any) => a.business_unit_id === Number(this.unitFilter)));
  }

  selectEmployee(user: any): void {
    this.selectedEmployee = user;
    this.assignment.user_id = user.id;
    this.loadAssignments(user.id);
  }

  loadAssignments(userId: number): void {
    this.api.get<any[]>(`employees/${userId}/roles`).subscribe({
      next: data => { this.assignmentsByUser = { ...this.assignmentsByUser, [userId]: data || [] }; },
      error: error => this.showError(error),
    });
  }

  assign(): void {
    if (!this.assignment.user_id || !this.assignment.role_id) { this.error = this.lang.t('validationError'); return; }
    this.confirmDialog.confirm(this.lang.t('confirmAssign'), {
      title: this.lang.t('assignRole'), confirmLabel: this.lang.t('assign'),
    }).subscribe(confirmed => {
      if (!confirmed) return;
      const body = { ...this.assignment, business_unit_id: this.assignment.business_unit_id || null };
      this.api.post('roles/assign', body).subscribe({
        next: (data: any) => { this.saved(); this.assignmentsByUser = { ...this.assignmentsByUser, [this.assignment.user_id]: data || [] }; this.loadAudit(); },
        error: error => this.showError(error),
      });
    });
  }

  revoke(assignment?: any): void {
    const target = assignment || this.assignment;
    const body = { user_id: target.user_id || this.selectedEmployee?.id, role_id: target.role_id, business_unit_id: target.business_unit_id || null };
    if (!body.user_id || !body.role_id) { this.error = this.lang.t('validationError'); return; }
    this.confirmDialog.confirm(this.lang.t('confirmRevoke'), {
      title: this.lang.t('revoke'), confirmLabel: this.lang.t('revoke'), destructive: true,
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.api.post('roles/revoke', body).subscribe({
        next: (data: any) => { this.saved(); this.assignmentsByUser = { ...this.assignmentsByUser, [body.user_id]: data || [] }; this.loadAudit(); },
        error: error => this.showError(error),
      });
    });
  }

  loadAudit(): void {
    this.api.get<any>('audit/role-changes').subscribe({ next: data => this.audit = data || [], error: () => { /* audit is best-effort */ } });
  }

  scopeLabel(assignment: any): string {
    return assignment.business_unit ? assignment.business_unit : this.lang.t('globalRole');
  }
}
