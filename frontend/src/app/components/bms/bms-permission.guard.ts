import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BmsAccessService } from './bms-access.service';

/**
 * Route-level BMS authorization. A user without the ability required by a
 * screen is sent to their first permitted page, or to the access screen when
 * they hold no BMS ability at all — never to a blank page or a login loop.
 */
@Injectable({ providedIn: 'root' })
export class BmsPermissionGuard implements CanActivate {
  constructor(private access: BmsAccessService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.access.guard(route.data?.ability as string | undefined, this.router);
  }
}
