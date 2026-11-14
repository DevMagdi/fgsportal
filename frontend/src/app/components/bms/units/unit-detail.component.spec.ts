import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { BmsApiService } from '../bms-api.service';
import { BmsLanguageService } from '../bms-language.service';
import { UnitDetailComponent } from './unit-detail.component';

const employee = (id: number, name: string, manager_id: number | null, extra: any = {}) =>
  ({ id, name, manager_id, manager: null, business_units: [{ id: 2, name: 'Alpha X' }], roles: [], active: true, ...extra });

describe('UnitDetailComponent', () => {
  let fixture: ComponentFixture<UnitDetailComponent>;
  let calls: { path: string; filters: any }[];
  let params: BehaviorSubject<any>;

  function create(can: string[], options: { unitFails?: boolean } = {}): UnitDetailComponent {
    calls = [];
    params = new BehaviorSubject(convertToParamMap({ id: '2' }));
    const api = {
      get: (path: string, filters: any = {}) => {
        calls.push({ path, filters });
        if (path === 'lookups') return of({ can });
        if (path.startsWith('units/')) {
          return options.unitFails ? throwError({ status: 403 }) : of({
            id: Number(path.split('/')[1]), name: 'Alpha X', is_active: true, parent: { id: 1, name: 'Alpha Iota' }, children: [], headcount: 3,
            director: { id: 10, firstname: 'Omar', lastname: 'Said' }, users: [{ id: 10, firstname: 'Omar', lastname: 'Said' }], weekly_plans: [], minutes: [],
          });
        }
        if (path === 'employees') {
          return filters.page === 1
            ? of({ data: [employee(10, 'Omar Said', null, { roles: [{ id: 1, name: 'Unit Director', slug: 'unit_director', business_unit_id: 2 }, { id: 2, name: 'Employee', slug: 'employee', business_unit_id: null }] }), employee(11, 'Sara Ali', 10)], meta: { current_page: 1, last_page: 2 } })
            : of({ data: [employee(12, 'Ziad Amr', 99, { manager: 'Hany Fouad' }), employee(11, 'Sara Ali', 10)], meta: { current_page: 2, last_page: 2 } });
        }
        if (path === 'products') return of([{ id: 7, product_name: 'Kraken', business_units: [{ id: 2, name: 'Alpha X' }, { id: 3, name: 'Alpha Gen' }], overall_progress: 40 }]);
        return of(null);
      },
    };
    TestBed.configureTestingModule({
      declarations: [UnitDetailComponent],
      providers: [
        { provide: BmsApiService, useValue: api },
        { provide: BmsLanguageService, useValue: { t: (key: string) => key } },
        { provide: ActivatedRoute, useValue: { paramMap: params.asObservable() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(UnitDetailComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('does not request employees or products without the matching abilities', () => {
    const component = create(['units.view']);
    expect(calls.map(call => call.path).sort()).toEqual(['lookups', 'units/2']);
    expect(component.employeesState).toBe('idle');
    expect(fixture.nativeElement.textContent).toContain('orgNoDirectoryPermission');
    expect(component.basicMembers.length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.unit-member').length).toBe(1);
  });

  it('reads every directory page for the unit and lists each person once', () => {
    const component = create(['units.view', 'directory.view', 'products.view']);
    const pages = calls.filter(call => call.path === 'employees').map(call => call.filters);
    expect(pages).toEqual([{ business_unit_id: 2, page: 1 }, { business_unit_id: 2, page: 2 }]);
    expect(component.employees.map(item => item.id)).toEqual([10, 11, 12]);
    expect(calls.find(call => call.path === 'products')?.filters).toEqual({ business_unit_id: 2 });
  });

  it('builds reporting lines from manager_id and keeps unit-scoped roles only', () => {
    const component = create(['units.view', 'directory.view']);
    expect(component.lines.map(node => `${node.depth}:${node.employee.name}`)).toEqual(['0:Omar Said', '1:Sara Ali']);
    expect(component.unattached.map(item => item.name)).toEqual(['Ziad Amr']);
    expect(component.linked).toBe(1);
    expect(component.unitRoles.map(row => row.roles)).toEqual([['Unit Director']]);
    expect(component.outsideManager(component.employees[2])).toBe('Hany Fouad');
  });

  it('labels the section as reporting lines and states that projects are not linked', () => {
    create(['units.view', 'directory.view']);
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('orgReportingTitle');
    expect(text).toContain('orgReportingHint');
    expect(text).toContain('orgProjectsPending');
  });

  it('reloads when the route moves to another unit', () => {
    create(['units.view']);
    params.next(convertToParamMap({ id: '5' }));
    expect(calls.map(call => call.path)).toContain('units/5');
    expect(calls.filter(call => call.path === 'lookups').length).toBe(1);
  });

  it('shows an error state when the unit is out of scope or the id is not a number', () => {
    const component = create(['units.view', 'directory.view', 'products.view'], { unitFails: true });
    expect(component.unitState).toBe('error');
    // A refused unit must not be followed by requests for its people or products.
    expect(calls.some(call => call.path === 'employees' || call.path === 'products')).toBe(false);
    params.next(convertToParamMap({ id: 'abc' }));
    expect(component.unitState).toBe('error');
    expect(calls.some(call => call.path === 'units/NaN')).toBe(false);
  });
});
