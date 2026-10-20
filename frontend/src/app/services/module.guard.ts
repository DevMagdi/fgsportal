import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ModuleService } from './module.service';

/**
 * Generic sellable-module guard.
 *
 * Usage in a route definition:
 *   { path: 'CRM', canActivate: [ModuleGuard], data: { module: 'crm' }, ... }
 *
 * The guard waits for the first entitlement load, then allows navigation only
 * when the required module is enabled for the user's company. Otherwise it
 * redirects to the "module not enabled" page, which keeps the lazy chunk from
 * being reached when the client did not buy the module.
 */
@Injectable({ providedIn: 'root' })
export class ModuleGuard implements CanActivate {
  constructor(private moduleService: ModuleService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const requiredModule: string | undefined = route.data?.module;

    if (!requiredModule) {
      // No module requirement on this route.
      return new Observable((observer) => {
        observer.next(true);
        observer.complete();
      });
    }

    return combineLatest([
      this.moduleService.loaded$,
      this.moduleService.enabledModules$,
    ]).pipe(
      filter(([loaded]) => loaded),
      take(1),
      map(([, enabledModules]) => {
        if (requiredModule === 'core' || enabledModules.includes(requiredModule)) {
          return true;
        }
        return this.router.createUrlTree(['/module-disabled'], {
          queryParams: { module: requiredModule, returnUrl: state.url },
        });
      })
    );
  }
}
