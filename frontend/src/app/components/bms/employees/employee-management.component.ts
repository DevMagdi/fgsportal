import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';

/**
 * Employee management (BRD section 5): directory with search + unit/title/
 * status filters, create/edit, activation, photo, certificates and roles.
 * The backend re-checks every permission; this screen only mirrors it.
 */
@Component({ selector: 'app-employee-management', templateUrl: './employee-management.component.html', styleUrls: ['../bms-shared.scss'] })
export class EmployeeManagementComponent extends BmsBaseComponent implements OnInit {
  employees: any[] = [];
  meta: any = { total: 0 };
  roles: any[] = [];
  selection: any = null;
  editing: any = null;
  filters: any = { search: '', business_unit_id: '', work_degrees_id: '', active: '', role_id: '' };
  form: FormGroup;
  certificate: any = { name: '', issuer: '', issued_at: '', expires_at: '', business_unit_id: '' };
  certificateFile: File | null = null;

  constructor(api: BmsApiService, lang: BmsLanguageService, private fb: FormBuilder, private exporter: BmsExportService) {
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

  ngOnInit(): void { super.ngOnInit(); this.load(); }

  load(): void {
    this.loading = true;
    this.api.get<any>('employees', this.cleanFilters()).subscribe({
      next: result => {
        this.employees = result.data || [];
        this.meta = result.meta || { total: this.employees.length };
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
    if (!confirm(`${employee.active ? this.lang.t('confirmDeactivate') : this.lang.t('confirmActivate')} — ${employee.name} (${entity})`)) return;
    this.api.post(`employees/${employee.id}/status`, { active: !employee.active }).subscribe({
      next: () => { this.saved(); this.load(); },
      error: error => this.showError(error),
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
    if (!confirm(`${this.lang.t('confirmImport')} (${this.importSummary.valid})`)) return;
    const form = new FormData(); form.append('file', this.importFile); form.append('dry_run', '0');
    this.api.post<any>('employees/import', form).subscribe({
      next: data => { this.saved(); this.importSummary = data.summary; this.importRows = data.rows || []; this.importFile = null; this.load(); },
      error: error => this.showError(error),
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
