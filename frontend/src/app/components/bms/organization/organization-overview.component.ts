import { hasAbility } from '../bms-abilities.util';
import { Component, OnInit } from '@angular/core';
import { BmsApiService } from '../bms-api.service';
import { BmsLanguageService } from '../bms-language.service';
import {
  OrgProduct, OrgUnit, OrgUnitNode, OrgUnitProgress, buildUnitTree, distinctPeople, flattenTree, personName,
  productsForUnit, progressForUnit, unitHeadcount,
} from './organization.util';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Organization overview: the business-unit hierarchy with directors, people,
 * products and weekly progress, plus the central departments.
 *
 * Read-only. Every figure comes from an existing endpoint, and each source is
 * requested only when the account holds the ability that endpoint requires:
 *   units               -> units.view (the route's own ability)
 *   products            -> products.view
 *   executive-dashboard -> dashboard.view
 *   lookups             -> any BMS user (abilities, department names)
 */
@Component({
  selector: 'app-organization-overview',
  templateUrl: './organization-overview.component.html',
  styleUrls: ['./organization-shared.scss', './organization-overview.component.scss'],
})
export class OrganizationOverviewComponent implements OnInit {
  abilities: string[] = [];
  departments: { id: number; department_name: string }[] = [];
  lookupsState: LoadState = 'idle';

  units: OrgUnit[] = [];
  unitsState: LoadState = 'idle';
  rows: OrgUnitNode[] = [];

  products: OrgProduct[] = [];
  productsState: LoadState = 'idle';

  progress: OrgUnitProgress[] = [];
  progressState: LoadState = 'idle';

  peopleCount: number | null = null;
  multiUnitCount: number | null = null;

  constructor(private api: BmsApiService, public lang: BmsLanguageService) {}

  ngOnInit(): void {
    this.loadUnits();
    this.loadLookups();
  }

  can(ability: string): boolean { return hasAbility(this.abilities, ability); }

  loadLookups(): void {
    this.lookupsState = 'loading';
    this.api.get<any>('lookups').subscribe({
      next: data => {
        this.abilities = data?.can || [];
        this.departments = data?.departments || [];
        this.lookupsState = 'ready';
        if (this.can('products.view')) this.loadProducts();
        if (this.can('dashboard.view')) this.loadProgress();
      },
      error: () => this.lookupsState = 'error',
    });
  }

  loadUnits(): void {
    this.unitsState = 'loading';
    this.api.get<OrgUnit[]>('units').subscribe({
      next: data => {
        this.units = data || [];
        this.rows = flattenTree(buildUnitTree(this.units));
        const people = distinctPeople(this.units);
        this.peopleCount = people.length;
        this.multiUnitCount = people.filter(entry => entry.unitIds.length > 1).length;
        this.unitsState = 'ready';
      },
      error: () => this.unitsState = 'error',
    });
  }

  loadProducts(): void {
    this.productsState = 'loading';
    this.api.get<OrgProduct[]>('products').subscribe({
      next: data => { this.products = data || []; this.productsState = 'ready'; },
      error: () => this.productsState = 'error',
    });
  }

  loadProgress(): void {
    this.progressState = 'loading';
    this.api.get<any>('executive-dashboard').subscribe({
      next: data => { this.progress = data?.unit_progress || []; this.progressState = 'ready'; },
      error: () => this.progressState = 'error',
    });
  }

  get activeUnits(): number { return this.units.filter(unit => unit.is_active !== false).length; }

  directorName(unit: OrgUnit): string { return unit.director ? personName(unit.director) : ''; }
  headcount(unit: OrgUnit): number { return unitHeadcount(unit); }
  childCount(node: OrgUnitNode): number { return node.children.length; }
  productsOf(unit: OrgUnit): OrgProduct[] { return productsForUnit(this.products, unit.id); }
  progressOf(unit: OrgUnit): OrgUnitProgress | null { return progressForUnit(this.progress, unit.id); }

  trackNode(_index: number, node: OrgUnitNode): number { return node.unit.id; }
  trackId(_index: number, item: { id: number }): number { return item.id; }
}
