import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { BmsApiService } from '../bms-api.service';
import { BmsConfirmService } from '../bms-confirm.service';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';
import { EmployeeManagementComponent } from './employee-management.component';

describe('EmployeeManagementComponent directory', () => {
  let fixture: ComponentFixture<EmployeeManagementComponent>;
  let component: EmployeeManagementComponent;
  let requests: any[];
  let query: BehaviorSubject<any>;

  function create(params: any = {}): void {
    requests = [];
    query = new BehaviorSubject(convertToParamMap(params));
    const api = {
      get: (path: string, filters: any = {}) => {
        if (path === 'lookups') return of({ can: ['directory.view'], users: [], roles: [], units: [{ id: 2, name: 'Alpha X' }] });
        requests.push(filters);
        const page = filters.page || 1;
        return of({ data: [{ id: page, name: `Person ${page}`, business_units: [{ id: 2, name: 'Alpha X' }], roles: [] }], meta: { current_page: page, last_page: 2, total: 51 } });
      },
    };
    TestBed.configureTestingModule({
      declarations: [EmployeeManagementComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: BmsApiService, useValue: api }, { provide: BmsLanguageService, useValue: { t: (key: string) => key } },
        { provide: BmsExportService, useValue: {} }, { provide: BmsConfirmService, useValue: {} },
        { provide: ActivatedRoute, useValue: { queryParamMap: query.asObservable() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(EmployeeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('loads the first page once, with no unit filter by default', () => {
    create();
    expect(requests).toEqual([{ page: 1 }]);
  });

  it('pages forward and back, and never past either end', () => {
    create();
    component.goToPage(2);
    expect(requests[1]).toEqual({ page: 2 });
    expect(component.page).toBe(2);
    component.goToPage(3);
    component.goToPage(2);
    expect(requests.length).toBe(2);
    component.goToPage(1);
    expect(requests[2]).toEqual({ page: 1 });
  });

  it('restarts at the first page when filters are applied', () => {
    create();
    component.goToPage(2);
    component.filters.search = 'sara';
    component.applyFilters();
    expect(requests[2]).toEqual({ search: 'sara', page: 1 });
  });

  it('opens on the unit named in the link and drops that filter when the link parameter goes away', () => {
    create({ business_unit_id: '2' });
    expect(requests[0]).toEqual({ business_unit_id: '2', page: 1 });
    query.next(convertToParamMap({}));
    expect(requests[1]).toEqual({ page: 1 });
    expect(component.filters.business_unit_id).toBe('');
  });

  it('keeps a unit filter chosen by hand when the URL has no parameter, and ignores a malformed one', () => {
    create({ business_unit_id: '2;drop' });
    expect(requests[0]).toEqual({ page: 1 });
    component.filters.business_unit_id = '2';
    query.next(convertToParamMap({}));
    expect(component.filters.business_unit_id).toBe('2');
  });

  it('names the unit a role is scoped to, and never prints a raw id', () => {
    create();
    expect(component.roleScope({ business_unit_id: 2 })).toBe('Alpha X');
    expect(component.roleScope({ business_unit_id: 99 })).toBe('orgUnitUnavailable');
    expect(component.roleScope({ business_unit_id: null })).toBe('globalRole');
  });
});
