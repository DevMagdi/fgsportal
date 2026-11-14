import { hasAbility } from '../bms-abilities.util';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { expand, map, reduce } from 'rxjs/operators';
import { BmsApiService } from '../bms-api.service';
import { BmsLanguageService } from '../bms-language.service';
import {
  OrgEmployee, OrgProduct, ReportingNode, flattenReporting, personName, reportingLines, unitRoleNames,
} from '../organization/organization.util';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';
interface UnitRoleRow { employee: OrgEmployee; roles: string[]; }

/**
 * One business unit: management, people, reporting lines, products, weekly
 * plans and linked meeting decisions.
 *
 * Read-only, on existing endpoints:
 *   units/{id}                     -> units.view (the route's ability)
 *   employees?business_unit_id=    -> directory.view
 *   products?business_unit_id=     -> products.view
 * Reporting lines come from each person's `manager_id`. They are shown as
 * reporting lines, never as teams. Teams and the development manager are a
 * separate panel (app-unit-teams, teams.view), with their own endpoints.
 */
@Component({
  selector: 'app-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['../organization/organization-shared.scss', './unit-detail.component.scss'],
})
export class UnitDetailComponent implements OnInit, OnDestroy {
  unitId = 0;
  unit: any = null;
  unitState: LoadState = 'idle';

  abilities: string[] = [];
  abilitiesLoaded = false;

  employees: OrgEmployee[] = [];
  employeesState: LoadState = 'idle';
  lines: ReportingNode[] = [];
  unattached: OrgEmployee[] = [];
  linked = 0;
  unitRoles: UnitRoleRow[] = [];

  products: OrgProduct[] = [];
  productsState: LoadState = 'idle';

  private routeSub?: Subscription;
  private requests: Subscription[] = [];

  constructor(private route: ActivatedRoute, private api: BmsApiService, public lang: BmsLanguageService) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.unitId = Number(params.get('id'));
      this.loadAll();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.cancelRequests();
  }

  can(ability: string): boolean { return hasAbility(this.abilities, ability); }

  private cancelRequests(): void { this.requests.forEach(request => request.unsubscribe()); this.requests = []; }

  loadAll(): void {
    this.cancelRequests();
    this.unit = null;
    this.employees = []; this.lines = []; this.unattached = []; this.linked = 0; this.unitRoles = []; this.products = [];
    this.employeesState = 'idle'; this.productsState = 'idle';
    if (!Number.isInteger(this.unitId) || this.unitId <= 0) { this.unitState = 'error'; return; }
    this.loadUnit();
    if (this.abilitiesLoaded) return;
    this.requests.push(this.api.get<any>('lookups').subscribe({
      next: data => { this.abilities = data?.can || []; this.abilitiesLoaded = true; this.loadScoped(); },
      // Without abilities the people and product sections stay closed rather than risk a forbidden request.
      error: () => { this.abilitiesLoaded = false; },
    }));
  }

  /**
   * People and products are requested only once the unit itself has loaded and the abilities are known:
   * a unit the server refuses (outside the account's scope, or deleted) must not trigger further requests.
   */
  private loadScoped(): void {
    if (this.unitState !== 'ready' || !this.abilitiesLoaded || this.employeesState !== 'idle' || this.productsState !== 'idle') return;
    if (this.can('directory.view')) this.loadEmployees();
    if (this.can('products.view')) this.loadProducts();
  }

  loadUnit(): void {
    this.unitState = 'loading';
    this.requests.push(this.api.get<any>(`units/${this.unitId}`).subscribe({
      next: data => { this.unit = data; this.unitState = 'ready'; this.loadScoped(); },
      error: () => this.unitState = 'error',
    }));
  }

  /** The directory is paginated (50 per page); every page is read so nobody in the unit is left out. */
  loadEmployees(): void {
    this.employeesState = 'loading';
    const page = (number: number): Observable<any> => this.api.get<any>('employees', { business_unit_id: this.unitId, page: number });
    this.requests.push(page(1).pipe(
      expand(result => {
        const current = Number(result?.meta?.current_page || 1), last = Number(result?.meta?.last_page || 1);
        return current < last ? page(current + 1) : EMPTY;
      }),
      map(result => (result?.data || []) as OrgEmployee[]),
      reduce((all, rows) => all.concat(rows), [] as OrgEmployee[]),
    ).subscribe({
      next: rows => {
        const seen = new Set<number>();
        this.employees = rows.filter(row => !seen.has(row.id) && !!seen.add(row.id));
        const reporting = reportingLines(this.employees);
        this.lines = flattenReporting(reporting.lines);
        this.unattached = reporting.unattached;
        this.linked = reporting.linked;
        this.unitRoles = this.employees
          .map(employee => ({ employee, roles: unitRoleNames(employee, this.unitId) }))
          .filter(row => row.roles.length);
        this.employeesState = 'ready';
      },
      error: () => this.employeesState = 'error',
    }));
  }

  loadProducts(): void {
    this.productsState = 'loading';
    this.requests.push(this.api.get<OrgProduct[]>('products', { business_unit_id: this.unitId }).subscribe({
      next: data => { this.products = data || []; this.productsState = 'ready'; },
      error: () => this.productsState = 'error',
    }));
  }

  get directorName(): string { return this.unit?.director ? personName(this.unit.director) : ''; }
  get basicMembers(): any[] { return this.unit?.users || []; }
  get headcount(): number { return this.unit?.headcount ?? this.basicMembers.length; }
  get plans(): any[] {
    return (this.unit?.weekly_plans || []).slice().sort((a: any, b: any) => String(b.week_start).localeCompare(String(a.week_start))).slice(0, 5);
  }
  get minutes(): any[] { return this.unit?.minutes || []; }

  memberName(person: any): string { return personName(person); }
  rolesIn(employee: OrgEmployee): string[] { return unitRoleNames(employee, this.unitId); }
  otherUnits(item: { business_units?: { id: number; name: string }[] }): { id: number; name: string }[] {
    return (item.business_units || []).filter(unit => unit.id !== this.unitId);
  }
  /** Manager shown for a person whose manager is not a member of this unit. */
  outsideManager(employee: OrgEmployee): string {
    if (!employee.manager_id || this.employees.some(member => member.id === employee.manager_id)) return '';
    return employee.manager || '';
  }
  planProgress(plan: any): number | null {
    const tasks = plan?.tasks || [];
    if (!tasks.length) return null;
    return Math.round(tasks.reduce((sum: number, task: any) => sum + (Number(task.progress) || 0), 0) / tasks.length);
  }

  trackId(_index: number, item: { id: number }): number { return item.id; }
  trackNode(_index: number, node: ReportingNode): number { return node.employee.id; }
  trackRole(_index: number, row: UnitRoleRow): number { return row.employee.id; }
}
