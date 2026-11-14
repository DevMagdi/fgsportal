import { Directive, OnInit } from '@angular/core';
import { BmsApiService } from './bms-api.service';
import { BmsLanguageService } from './bms-language.service';
import { hasAbility } from './bms-abilities.util';

@Directive()
export abstract class BmsBaseComponent implements OnInit {
  lookups: any = { users: [], departments: [], products: [], roles: [], can: [] };
  loading = false;
  error = '';
  success = '';
  constructor(public api: BmsApiService, public lang: BmsLanguageService) {}
  ngOnInit(): void { this.loadLookups(); }
  loadLookups(): void { this.api.get<any>('lookups').subscribe({ next: data => this.lookups = data, error: error => this.showError(error) }); }
  can(ability: string): boolean { return hasAbility(this.lookups.can, ability); }
  showError(error: any): void { this.loading = false; this.success = ''; this.error = error?.error?.message || error?.message || this.lang.t('error'); }
  saved(message?: string): void { this.loading = false; this.error = ''; this.success = message || this.lang.t('saved'); }
  name(entity: any): string { return entity?.username || `${entity?.firstname || ''} ${entity?.lastname || ''}`.trim() || '-'; }
}
