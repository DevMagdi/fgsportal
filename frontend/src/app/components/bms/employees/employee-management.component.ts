import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsExportService } from '../bms-export.service';
import { BmsConfirmService } from '../bms-confirm.service';
import { BmsLanguageService } from '../bms-language.service';
import { unitNameById } from '../organization/organization.util';

/**
 * Employee management (BRD section 5): directory with search + unit/title/
 * status filters, create/edit, activation, photo, certificates and roles.
 * The backend re-checks every permission; this screen only mirrors it.
 */
@Component({ selector: 'app-employee-management', templateUrl: './employee-management.component.html', styleUrls: ['../bms-shared.scss'], styles: ['.unit-link{text-decoration:none}.unit-link:hover{text-decoration:underline}.directory-footer{align-items:center;margin:14px 0 0}.directory-footer p{margin:0}'] })
export class EmployeeManagementComponent extends BmsBaseComponent implements OnInit, OnDestroy {
  employees: any[] = [];
  meta: any = { total: 0 };
  page = 1;
  private routeSub?: Subscription;
  private unitFromLink = false;
  roles: any[] = [];
  selection: any = null;
  editing: any = null;
  filters: any = { search: '', business_unit_id: '', work_degrees_id: '', active: '', role_id: '' };
  form: FormGroup;
  certificate: any = { name: '', issuer: '', issued_at: '', expires_at: '', business_unit_id: '' };
  certificateFile: File | null = null;

  constructor(api: BmsApiService, lang: BmsLanguageService, private fb: FormBuilder, private exporter: BmsExportService, private confirmDialog: BmsConfirmService, private route: ActivatedRoute) {
    super(api, lang);
    this.form = fb.group({
      firstname: ['', Validators.required], lastname: ['', Validators.required],
      username: ['', Validators.required], email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      mobile_number: [''], work_degrees_id: [''], sub_departments_id: [''],
      hiring_date: [''], manager_id: [''], active: [true], business_unit_ids: [[], Validators.required],
      role_id: [''], role_business_unit_id: [''],
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    // A unit page links here with ?business_unit_id= so the directory opens on that unit.
    // The parameter is followed, not read once: opening "Employees" from the sidebar afterwards
    // reuses this component, and must drop the unit filter that the link applied.
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      const unit = params.get('business_unit_id');
      if (unit && /^\d+$/.test(unit)) {
        this.filters.business_unit_id = unit;
        this.unitFromLink = true;
      } else if (this.unitFromLink) {
        this.filters.business_unit_id = '';
        this.unitFromLink = false;
      }
      this.applyFilters();
    });
  }

  ngOnDestroy(): void { this.routeSub?.unsubscribe(); }

  /** Filters changed: start again from the first page. */
  applyFilters(): void { this.page = 1; this.load(); }
  goToPage(page: number): void {
    if (page < 1 || page > this.lastPage || page === this.page) return;
    this.page = page;
    this.load();
  }
  get lastPage(): number { return Number(this.meta?.last_page) || 1; }
  /** Name of the unit a role is scoped to; an unscoped role applies to the whole organization. */
  roleScope(role: any): string {
    if (!role?.business_unit_id) return this.lang.t('globalRole');
    // A role can point at a unit this account cannot see, or one that was deleted: say so instead of printing an id.
    const known = (this.lookups.units || []).some((unit: any) => unit.id === role.business_unit_id);
    return known ? unitNameById(this.lookups.units, role.business_unit_id) : this.lang.t('orgUnitUnavailable');
  }
  trackId(_index: number, item: any): number { return item.id; }

  load(): void {
    this.loading = true;
    this.api.get<any>('employees', { ...this.cleanFilters(), page: this.page }).subscribe({
      next: result => {
        this.employees = result.data || [];
        this.meta = result.meta || { total: this.employees.length };
        this.page = Number(this.meta.current_page) || 1;
        this.roles = this.lookups.roles || [];
        if (this.selection) this.selection = this.employees.find(item => item.id === this.selection.id) || this.selection;
        this.loading = false;
      },
      error: error => this.showError(error),
    });
  }

  private cleanFilters(): any {
    const out: any = {};
    Object.keys(this.filters).forEach(key => { if (this.filters[key] !== '' && this.filters[key] !== null) out[key] = this.filters[key]; });
    return out;
  }

  startCreate(): void {
    this.editing = null;
    this.form.reset({ firstname: '', lastname: '', username: '', email: '', password: '', mobile_number: '', work_degrees_id: '', sub_departments_id: '', hiring_date: '', manager_id: '', active: true, business_unit_ids: [], role_id: '', role_business_unit_id: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startEdit(employee: any): void {
    this.editing = employee;
    this.form.reset({
      firstname: employee.name?.split(' ')[0] || '', lastname: employee.name?.split(' ').slice(1).join(' ') || '',
      username: employee.username, email: employee.email, password: '', mobile_number: '',
      work_degrees_id: employee.work_degrees_id || '', sub_departments_id: '', hiring_date: employee.hiring_date || '', manager_id: employee.manager_id || '',
      active: employee.active, business_unit_ids: (employee.business_units || []).map((unit: any) => unit.id), role_id: '', role_business_unit_id: '',
    });
    // Password is only required when creating a new account.
    this.form.get('password')?.setValidators(this.editing ? [Validators.minLength(8)] : [Validators.required, Validators.minLength(8)]);
    this.form.get('password')?.updateValueAndValidity();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel(): void { this.editing = null; this.form.reset({ active: true, business_unit_ids: [] }); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); this.error = this.lang.t('validationError'); return; }
    const value = this.form.value;
    const body: any = { ...value };
    ['work_degrees_id', 'sub_departments_id', 'role_id', 'role_business_unit_id', 'hiring_date', 'mobile_number', 'manager_id'].forEach(key => {
      if (body[key] === '' || body[key] === null) body[key] = null;
    });
    if (!body.password) delete body.password;
    if (this.editing) {
      delete body.role_id; delete body.role_business_unit_id; delete body.password;
      if (!body.hiring_date) delete body.hiring_date;
    }
    this.loading = true;
    const request = this.editing ? this.api.put(`employees/${this.editing.id}`, body) : this.api.post('employees', body);
    request.subscribe({
      next: (employee: any) => { this.saved(); this.editing = null; this.selection = employee; this.form.reset({ active: true, business_unit_ids: [] }); this.load(); this.loadLookups(); },
      error: error => this.showError(error),
    });
  }

  toggleStatus(employee: any): void {
    const entity = this.lang.t('employee');
    const deactivating = !!employee.active;
    const message = `${deactivating ? this.lang.t('confirmDeactivate') : this.lang.t('confirmActivate')} — ${employee.name} (${entity})`;
    this.confirmDialog.confirm(message, {
      title: this.lang.t(deactivating ? 'deactivate' : 'activate'),
      confirmLabel: this.lang.t(deactivating ? 'deactivate' : 'activate'),
      destructive: deactivating,
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.api.post(`employees/${employee.id}/status`, { active: !employee.active }).subscribe({
        next: () => { this.saved(); this.load(); },
        error: error => this.showError(error),
      });
    });
  }

  uploadPhoto(event: any, employee: any): void {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('photo', file);
    this.api.post(`employees/${employee.id}/photo`, form).subscribe({
      next: () => { this.saved(); this.load(); },
      error: error => this.showError(error),
    });
  }

  select(employee: any): void { this.selection = employee; this.certificate.error = ''; }
  file(event: any): void { const file = event.target.files?.[0]; if (file) this.certificateFile = file; }

  addCertificate(): void {
    if (!this.selection || !this.certificate.name || !this.certificateFile) { this.error = this.lang.t('validationError'); return; }
    const form = new FormData();
    form.append('user_id', String(this.selection.id));
    ['name', 'issuer', 'issued_at', 'expires_at', 'business_unit_id'].forEach(key => { if (this.certificate[key]) form.append(key, this.certificate[key]); });
    form.append('file', this.certificateFile);
    this.api.post('certificates', form).subscribe({
      next: () => { this.saved(); this.certificate = { name: '', issuer: '', issued_at: '', expires_at: '', business_unit_id: '' }; this.certificateFile = null; this.load(); },
      error: error => this.showError(error),
    });
  }

  importOpen = false; importRows: any[] = []; importSummary: any = null; importFile: File | null = null;
  downloadTemplate(): void { this.api.download('employees/import/template', 'bms-employee-import-template.csv', () => this.error = this.lang.t('error')); }
  chooseImportFile(event: any): void { this.importFile = event.target.files?.[0] || null; }
  previewImport(): void {
    if (!this.importFile) { this.error = this.lang.t('validationError'); return; }
    const form = new FormData(); form.append('file', this.importFile); form.append('dry_run', '1');
    this.api.post<any>('employees/import', form).subscribe({
      next: data => { this.importRows = data.rows || []; this.importSummary = data.summary; this.importOpen = true; },
      error: error => this.showError(error),
    });
  }
  confirmImport(): void {
    if (!this.importFile || !this.importSummary?.valid) return;
    this.confirmDialog.confirm(`${this.lang.t('confirmImport')} (${this.importSummary.valid})`, {
      title: this.lang.t('bulkImport'), confirmLabel: this.lang.t('confirmImport'),
    }).subscribe(confirmed => {
      if (!confirmed) return;
      const form = new FormData(); form.append('file', this.importFile as File); form.append('dry_run', '0');
      this.api.post<any>('employees/import', form).subscribe({
        next: data => { this.saved(); this.importSummary = data.summary; this.importRows = data.rows || []; this.importFile = null; this.load(); },
        error: error => this.showError(error),
      });
    });
  }
  download(path: string, name: string): void { this.api.download(path, name, () => this.error = this.lang.t('error')); }

  expiryStatus(certificate: any): string {
    if (!certificate.expires_at) return 'none';
    const days = (new Date(certificate.expires_at).getTime() - Date.now()) / 86400000;
    if (days < 0) return 'expired';
    if (days < 60) return 'soon';
    return 'valid';
  }

  rows(): any[] {
    return this.employees.map(employee => ({
      Name: employee.name, Username: employee.username, Email: employee.email, JobTitle: employee.job_title,
      Units: (employee.business_units || []).map((unit: any) => unit.name).join(', '),
      HiringDate: employee.hiring_date, Roles: (employee.roles || []).map((role: any) => role.name).join(', '),
      Active: employee.active ? 'Yes' : 'No',
    }));
  }
  excel(): void { this.exporter.excel([{ name: 'Employees', rows: this.rows() }], 'bms-employees'); }
  pdf(): void { this.exporter.pdf(this.lang.t('employees'), this.rows(), 'bms-employees'); }
}
