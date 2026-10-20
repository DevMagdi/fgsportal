import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ModuleService } from './module.service';
import { environment } from 'src/environments/environment';

describe('ModuleService', () => {
  let service: ModuleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ModuleService],
    });
    service = TestBed.inject(ModuleService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
    service.clear();
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('reports modules as disabled until enabled (and core always enabled)', () => {
    expect(service.isModuleEnabled('crm')).toBeFalse();
    expect(service.isModuleEnabled('ticketing')).toBeFalse();

    // Core module is always available regardless of entitlements.
    expect(service.isModuleEnabled('core')).toBeTrue();
  });

  it('stores and reports enabled modules', () => {
    service.setEnabledModules(['core', 'crm']);

    expect(service.getEnabledModules()).toEqual(['core', 'crm']);
    expect(service.isModuleEnabled('crm')).toBeTrue();
    expect(service.isModuleEnabled('hr')).toBeFalse();
  });

  it('persists entitlements in localStorage', () => {
    service.setEnabledModules(['core', 'ticketing']);

    const raw = JSON.parse(localStorage.getItem('enabledModules') || '[]');
    expect(raw).toEqual(['core', 'ticketing']);
  });

  it('restores entitlements from localStorage on a new instance', () => {
    service.setEnabledModules(['core', 'crm', 'projects']);

    const newService = TestBed.inject(ModuleService);
    expect(newService.isModuleEnabled('crm')).toBeTrue();
    expect(newService.isModuleEnabled('projects')).toBeTrue();
    expect(newService.isModuleEnabled('hr')).toBeFalse();
  });

  it('clears entitlements on logout', () => {
    service.setEnabledModules(['core', 'crm']);
    service.clear();

    expect(service.getEnabledModules()).toEqual([]);
    expect(service.isModuleEnabled('crm')).toBeFalse();
    expect(localStorage.getItem('enabledModules')).toBeNull();
  });

  it('loads enabled module slugs from the backend', () => {
    const userData = { _token: 'jwt-token' };
    localStorage.setItem('userData', JSON.stringify(userData));

    let result: string[] = [];
    service.loadEnabledModules().subscribe((slugs) => (result = slugs));

    const req = httpMock.expectOne(
      (r) => r.url === `${environment.newServerApi}/api/company/modules`
    );
    expect(req.request.params.get('token')).toBe('jwt-token');

    req.flush({
      data: [
        { slug: 'core', is_enabled: true },
        { slug: 'crm', is_enabled: true },
        { slug: 'hr', is_enabled: false },
      ],
    });

    expect(result).toEqual(['core', 'crm']);
    expect(service.isModuleEnabled('crm')).toBeTrue();
    expect(service.isModuleEnabled('hr')).toBeFalse();
  });

  it('keeps cached entitlements when the backend call fails', () => {
    service.setEnabledModules(['core', 'admin']);
    const userData = { _token: 'jwt-token' };
    localStorage.setItem('userData', JSON.stringify(userData));

    let result: string[] = [];
    service.loadEnabledModules().subscribe((slugs) => (result = slugs));

    httpMock
      .expectOne((r) => r.url === `${environment.newServerApi}/api/company/modules`)
      .error(new ErrorEvent('network'));

    expect(result).toEqual(['core', 'admin']);
    expect(service.isModuleEnabled('admin')).toBeTrue();
  });

  it('loads the full catalogue (including disabled modules) and syncs enabled slugs', () => {
    const userData = { _token: 'jwt-token' };
    localStorage.setItem('userData', JSON.stringify(userData));

    let catalogue: any[] = [];
    service.loadCatalogue().subscribe((modules) => (catalogue = modules));

    const req = httpMock.expectOne(
      (r) => r.url === `${environment.newServerApi}/api/modules`
    );
    expect(req.request.params.get('token')).toBe('jwt-token');

    req.flush({
      data: [
        { id: 1, slug: 'core', name: 'Core', is_core: true, is_active: true, is_enabled: true },
        { id: 2, slug: 'crm', name: 'CRM', is_core: false, is_active: true, is_enabled: true },
        { id: 5, slug: 'hr', name: 'Human Resources', is_core: false, is_active: true, is_enabled: false },
      ],
    });

    // The catalogue keeps disabled modules so cards can render them dimmed.
    expect(catalogue.length).toBe(3);
    expect(service.getCatalogue().map((m) => m.slug)).toEqual(['core', 'crm', 'hr']);

    // Enabled slugs are derived from the catalogue state.
    expect(service.isModuleEnabled('crm')).toBeTrue();
    expect(service.isModuleEnabled('hr')).toBeFalse();
  });

  it('does not call the backend for the catalogue when unauthenticated', () => {
    localStorage.removeItem('userData');

    let catalogue: any[] = ['sentinel'];
    service.loadCatalogue().subscribe((modules) => (catalogue = modules));

    httpMock.expectNone(`${environment.newServerApi}/api/modules`);
    expect(catalogue).toEqual([]);
  });
});
