import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmsApiService } from '../bms-api.service';
import { BmsBaseComponent } from '../bms-base.component';
import { BmsLanguageService } from '../bms-language.service';
import { BmsExportService } from '../bms-export.service';
import { BmsConfirmService } from '../bms-confirm.service';
import { OrgProduct, personName, productsForUnit, unitHeadcount } from '../organization/organization.util';

/**
 * Business units as cards. Create and edit use the same form, endpoints and
 * payload as before; the form now opens in a side panel.
 */
@Component({
  selector: 'app-business-units',
  templateUrl: './business-units.component.html',
  styleUrls: ['../bms-shared.scss', '../organization/organization-shared.scss'],
})
export class BusinessUnitsComponent extends BmsBaseComponent implements OnInit {
  units: any[] = [];
  loaded = false;
  loadFailed = false;
  editing: any = null;
  panelOpen = false;
  saving = false;
  submitted = false;
  form: FormGroup;
  search = '';
  status: '' | 'active' | 'inactive' = '';
  products: OrgProduct[] = [];
  private productsRequested = false;

  constructor(api: BmsApiService, lang: BmsLanguageService, private fb: FormBuilder, private exporter: BmsExportService, private confirmDialog: BmsConfirmService) {
    super(api, lang);
    this.form = fb.group({ name: ['', Validators.required], parent_id: [''], description: [''], key_messages: [''], servicesText: [''], director_id: [''], user_ids: [[]], is_active: [true] });
  }

  ngOnInit(): void { super.ngOnInit(); this.load(); }

  loadLookups(): void {
    this.api.get<any>('lookups').subscribe({ next: data => { this.lookups = data; this.loadProducts(); }, error: error => this.showError(error) });
  }

  load(): void {
    this.loading = true;
    this.loadFailed = false;
    this.api.get<any[]>('units').subscribe({
      next: data => { this.units = data || []; this.loaded = true; this.loading = false; this.loadProducts(); },
      error: e => { this.loadFailed = !this.loaded; this.showError(e); },
    });
  }

  /** Product names per card, requested once and only for accounts that may see products. */
  private loadProducts(): void {
    if (this.productsRequested) return;
    if (!this.loaded || !this.can('products.view')) return;
    this.productsRequested = true;
    this.api.get<OrgProduct[]>('products').subscribe({ next: data => this.products = data || [], error: () => this.productsRequested = false });
  }

  get visibleUnits(): any[] {
    const term = this.search.trim().toLowerCase();
    return this.units.filter(unit => {
      if (this.status === 'active' && !unit.is_active) return false;
      if (this.status === 'inactive' && unit.is_active) return false;
      if (!term) return true;
      return [unit.name, unit.description, unit.parent?.name, this.directorName(unit), unit.director?.username, ...(unit.services || [])]
        .some(value => (value || '').toString().toLowerCase().includes(term));
    });
  }

  headcount(unit: any): number { return unitHeadcount(unit); }
  childCount(unit: any): number { return this.units.filter(item => item.parent_id === unit.id).length; }
  productsOf(unit: any): OrgProduct[] { return productsForUnit(this.products, unit.id); }
  /** First and last name, as on the overview and the unit page (exports keep the existing username form). */
  directorName(unit: any): string { return unit.director ? personName(unit.director) : ''; }
  trackId(_index: number, item: any): number { return item.id; }

  create(): void { this.reset(); this.error = ''; this.submitted = false; this.panelOpen = true; }

  edit(unit: any): void {
    this.editing = unit;
    this.error = '';
    this.submitted = false;
    this.form.reset({ name: '', parent_id: '', description: '', key_messages: '', servicesText: '', director_id: '', user_ids: [], is_active: true });
    this.form.patchValue({ ...unit, servicesText: (unit.services || []).join(', '), parent_id: unit.parent_id || '', director_id: unit.director_id || '', user_ids: (unit.users || []).map((u: any) => u.id) });
    this.panelOpen = true;
  }

  reset(): void {
    this.editing = null;
    this.form.reset({ name: '', parent_id: '', description: '', key_messages: '', servicesText: '', director_id: '', user_ids: [], is_active: true });
  }

  closePanel(): void { this.panelOpen = false; this.reset(); }

  save(): void {
    this.submitted = true;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.value;
    const body = { ...value, parent_id: value.parent_id || null, director_id: value.director_id || null, services: (value.servicesText || '').split(',').map((v: string) => v.trim()).filter((v: string) => v) };
    delete body.servicesText;
    this.saving = true;
    const request = this.editing ? this.api.put(`units/${this.editing.id}`, body) : this.api.post('units', body);
    request.subscribe({
      next: () => { this.saving = false; this.saved(); this.closePanel(); this.load(); },
      error: e => { this.saving = false; this.showError(e); this.error = this.validationMessage(e) || this.error; },
    });
  }

  /** The server's field message (e.g. "The name has already been taken.") instead of the generic validation summary. */
  private validationMessage(error: any): string {
    const fields = error?.error?.errors;
    if (!fields || typeof fields !== 'object') return '';
    const first = ([] as any[]).concat(...Object.keys(fields).map(key => fields[key]))[0];
    return typeof first === 'string' ? first : '';
  }

  get nameMissing(): boolean { return this.submitted && this.form.controls.name.invalid; }

  rows(): any[] { return this.units.map(u => ({ Name: u.name, Parent: u.parent?.name, Director: this.name(u.director), Members: (u.users || []).map((m: any) => this.name(m)).join(', '), Services: (u.services || []).join(', '), Description: u.description, KeyMessages: u.key_messages, Active: u.is_active ? 'Yes' : 'No' })); }
  excel(): void { this.exporter.excel([{ name: 'Business units', rows: this.rows() }], 'bms-business-units'); }
  pdf(): void { this.exporter.pdf(this.lang.t('units'), this.rows(), 'bms-business-units'); }

  toggleStatus(unit: any): void {
    this.api.post(`units/${unit.id}/status`, { is_active: !unit.is_active }).subscribe({ next: () => { this.saved(); this.load(); }, error: e => this.showError(e) });
  }

  remove(unit: any): void {
    this.confirmDialog.confirm(this.lang.t('confirmDelete'), { title: this.lang.t('delete'), confirmLabel: this.lang.t('delete'), destructive: true }).subscribe(confirmed => {
      if (!confirmed) return;
      this.api.delete(`units/${unit.id}`).subscribe({ next: () => { this.saved(); this.load(); }, error: e => this.showError(e) });
    });
  }
}
