import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { BmsApiService } from '../bms-api.service';
import { BmsLanguageService } from '../bms-language.service';
import { OrganizationOverviewComponent } from './organization-overview.component';

const UNITS = [
  { id: 1, name: 'Alpha Iota', parent_id: null, is_active: true, director: { id: 9, firstname: 'Mona', lastname: 'Adel' }, users: [{ id: 1 }, { id: 2 }] },
  { id: 2, name: 'Alpha X', parent_id: 1, is_active: true, director: null, users: [{ id: 2 }, { id: 3 }] },
  { id: 3, name: 'Alpha Gen', parent_id: 1, is_active: false, director: null, users: [] },
];

describe('OrganizationOverviewComponent', () => {
  let fixture: ComponentFixture<OrganizationOverviewComponent>;
  let calls: string[];
  let responses: { [path: string]: any };

  function create(can: string[], failing: string[] = []): OrganizationOverviewComponent {
    calls = [];
    responses = {
      lookups: { can, departments: [{ id: 4, department_name: 'Sales' }] },
      units: UNITS,
      products: [{ id: 7, product_name: 'Kraken', business_units: [{ id: 2, name: 'Alpha X' }] }],
      'executive-dashboard': { unit_progress: [{ id: 2, total: 4, progress: 50 }, { id: 1, total: 0, progress: 0 }] },
    };
    const api = { get: (path: string) => { calls.push(path); return failing.includes(path) ? throwError({ status: 500 }) : of(responses[path]); } };
    TestBed.configureTestingModule({
      declarations: [OrganizationOverviewComponent],
      providers: [{ provide: BmsApiService, useValue: api }, { provide: BmsLanguageService, useValue: { t: (key: string) => key } }],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(OrganizationOverviewComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('requests only units and lookups for an account without product or dashboard abilities', () => {
    create(['units.view']);
    expect(calls.sort()).toEqual(['lookups', 'units']);
  });

  it('requests products and unit progress only when the abilities allow it', () => {
    create(['units.view', 'products.view', 'dashboard.view']);
    expect(calls.sort()).toEqual(['executive-dashboard', 'lookups', 'products', 'units']);
  });

  it('counts each person once across units and orders the hierarchy parent first', () => {
    const component = create(['units.view']);
    expect(component.peopleCount).toBe(3);
    expect(component.multiUnitCount).toBe(1);
    expect(component.activeUnits).toBe(2);
    expect(component.rows.map(row => `${row.depth}:${row.unit.name}`)).toEqual(['0:Alpha Iota', '1:Alpha Gen', '1:Alpha X']);
  });

  it('links each unit row to its detail page and shows only departments returned by the API', () => {
    create(['units.view', 'products.view']);
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Sales');
    ['HR', 'Finance', 'Legal'].forEach(name => expect(text).not.toContain(name));
    expect(fixture.nativeElement.querySelectorAll('.org-tree .org-row').length).toBe(3);
    expect(text).toContain('Kraken');
  });

  it('shows an error state for units without inventing figures', () => {
    const component = create(['units.view'], ['units']);
    expect(component.unitsState).toBe('error');
    expect(component.peopleCount).toBeNull();
    expect(fixture.nativeElement.querySelector('app-bms-state[kind="error"]')).toBeTruthy();
  });
});
