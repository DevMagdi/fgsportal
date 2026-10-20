import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ModuleGuard } from './module.guard';
import { ModuleService } from './module.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('ModuleGuard', () => {
  let guard: ModuleGuard;
  let moduleService: ModuleService;
  let router: Router;

  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [ModuleGuard, ModuleService],
    });
    guard = TestBed.inject(ModuleGuard);
    moduleService = TestBed.inject(ModuleService);
    router = TestBed.inject(Router);
    localStorage.clear();
    moduleService.clear();
  });

  function routeFor(module?: string): ActivatedRouteSnapshot {
    return { data: module ? { module } : {} } as ActivatedRouteSnapshot;
  }

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('allows navigation when the required module is enabled', (done) => {
    moduleService.setEnabledModules(['core', 'crm']);

    guard.canActivate(routeFor('crm'), state).subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('redirects to the module-disabled page when the module is disabled', (done) => {
    moduleService.setEnabledModules(['core']);

    guard.canActivate(routeFor('hr'), state).subscribe((result) => {
      expect(result instanceof UrlTree).toBeTrue();
      expect(router.parseUrl('/module-disabled?module=hr').toString()).toBe(
        (result as UrlTree).toString()
      );
      done();
    });
  });

  it('always allows the core module', (done) => {
    moduleService.clear();

    guard.canActivate(routeFor('core'), state).subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('allows routes without a module requirement', (done) => {
    moduleService.clear();

    guard.canActivate(routeFor(), state).subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  });
});
