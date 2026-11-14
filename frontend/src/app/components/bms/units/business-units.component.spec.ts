import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { BmsApiService } from '../bms-api.service';
import { BmsConfirmService } from '../bms-confirm.service';
import { BmsExportService } from '../bms-export.service';
import { BmsLanguageService } from '../bms-language.service';
import { BusinessUnitsComponent } from './business-units.component';

const UNITS = [
  { id: 1, name: 'Alpha Iota', parent_id: null, is_active: true, services: ['Consulting'], director_id: 9, director: { id: 9, username: 'mona' }, users: [{ id: 1 }, { id: 2 }] },
  { id: 2, name: 'Alpha X', parent_id: 1, parent: { id: 1, name: 'Alpha Iota' }, is_active: false, services: [], director: null, users: [{ id: 2 }] },
];

describe('BusinessUnitsComponent', () => {
  let fixture: ComponentFixture<BusinessUnitsComponent>;
  let component: BusinessUnitsComponent;
  let calls: { method: string; path: string; body?: any }[];

  function create(can: string[]): void {
    calls = [];
    const api = {
      get: (path: string) => { calls.push({ method: 'get', path }); return of(path === 'lookups' ? { can, users: [], units: [] } : path === 'units' ? UNITS : [{ id: 7, product_name: 'Kraken', business_units: [{ id: 1, name: 'Alpha Iota' }] }]); },
      post: (path: string, body: any) => { calls.push({ method: 'post', path, body }); return of({}); },
      put: (path: string, body: any) => { calls.push({ method: 'put', path, body }); return of({}); },
    };
    TestBed.configureTestingModule({
      declarations: [BusinessUnitsComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: BmsApiService, useValue: api }, { provide: BmsLanguageService, useValue: { t: (key: string) => key } },
        { provide: BmsExportService, useValue: {} }, { provide: BmsConfirmService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(BusinessUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('renders one card per unit with people, sub-unit and product counts', () => {
    create(['units.view', 'products.view']);
    expect(fixture.nativeElement.querySelectorAll('.unit-card').length).toBe(2);
    expect(component.headcount(UNITS[0])).toBe(2);
    expect(component.childCount(UNITS[0])).toBe(1);
    expect(component.productsOf(UNITS[0]).map(product => product.product_name)).toEqual(['Kraken']);
  });

  it('does not request products or show management actions without the abilities', () => {
    create(['units.view']);
    expect(calls.map(call => call.path).sort()).toEqual(['lookups', 'units']);
    expect(fixture.nativeElement.querySelector('.unit-card-actions')).toBeNull();
    expect(fixture.nativeElement.querySelector('.org-header .org-button-primary')).toBeNull();
  });

  it('filters cards by search text and status', () => {
    create(['units.view']);
    component.search = 'consult';
    expect(component.visibleUnits.map(unit => unit.id)).toEqual([1]);
    component.search = ''; component.status = 'inactive';
    expect(component.visibleUnits.map(unit => unit.id)).toEqual([2]);
  });

  it('edits in the side panel and sends the same payload to the same endpoint', () => {
    create(['units.view', 'units.manage']);
    component.edit(UNITS[0]);
    expect(component.panelOpen).toBe(true);
    component.form.patchValue({ servicesText: 'Consulting, Delivery' });
    component.save();
    const put = calls.find(call => call.method === 'put');
    expect(put?.path).toBe('units/1');
    expect(put?.body.services).toEqual(['Consulting', 'Delivery']);
    expect(put?.body.user_ids).toEqual([1, 2]);
    expect(put?.body.parent_id).toBeNull();
    expect('servicesText' in put?.body).toBe(false);
    expect(component.panelOpen).toBe(false);
  });

  it('creates through POST units and refuses an empty name', () => {
    create(['units.view', 'units.manage']);
    component.create();
    component.save();
    expect(calls.some(call => call.method === 'post')).toBe(false);
    component.form.patchValue({ name: 'Alpha Zeta' });
    component.save();
    expect(calls.find(call => call.method === 'post')?.path).toBe('units');
  });
});
