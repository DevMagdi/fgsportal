import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BmsApiService } from './bms-api.service';

/**
 * Loads and caches the signed-in user's BMS abilities so navigation never
 * flashes links the user cannot open. The backend remains the security
 * boundary; this only drives the UI and the post-login landing page.
 */
@Injectable({ providedIn: 'root' })
export class BmsAccessService {
  /** Ordered landing pages, mirroring the BMS shell navigation. */
  static readonly LANDING: { path: string; ability: string }[] = [
    { path: '/bms/dashboard', ability: 'dashboard.view' },
    { path: '/bms/reports', ability: 'reports.view' },
    { path: '/bms/plans', ability: 'plans.view' },
    { path: '/bms/units', ability: 'units.view' },
    { path: '/bms/opportunities', ability: 'opportunities.view' },
    { path: '/bms/products', ability: 'products.view' },
    { path: '/bms/meetings', ability: 'meetings.view' },
    { path: '/bms/leads', ability: 'leads.view' },
    { path: '/bms/recruitment', ability: 'recruitment.view' },
    { path: '/bms/procurement', ability: 'procurement.view' },
    { path: '/bms/events', ability: 'events.view' },
    { path: '/bms/documents', ability: 'documents.view' },
    { path: '/bms/employees', ability: 'directory.view' },
    { path: '/bms/access', ability: 'roles.manage' },
  ];

  private can$ = new BehaviorSubject<string[] | null>(null);

  constructor(private api: BmsApiService) {}

  abilities(): Observable<string[]> {
    if (this.can$.value !== null) {
      return of(this.can$.value);
    }
    return this.api.get<any>('lookups').pipe(
      map(data => (data?.can || []) as string[]),
      tap(can => this.can$.next(can)),
      catchError(() => {
        this.can$.next([]);
        return of([] as string[]);
      })
    );
  }

  can(ability: string): boolean {
    return (this.can$.value || []).includes(ability);
  }

  /** First page the user may open, or the access screen when nothing matches. */
  firstLanding(): string {
    const found = BmsAccessService.LANDING.find(entry => this.can(entry.ability));
    return found ? found.path : '/bms/no-access';
  }

  /** Refresh after a role change / re-login. */
  reset(): void {
    this.can$.next(null);
  }

  guard(ability: string | undefined, router: Router): Observable<boolean | UrlTree> {
    return this.abilities().pipe(
      map(can => {
        if (!ability || can.includes(ability)) {
          return true;
        }
        const target = this.firstLanding();
        // Never bounce the user to the same blocked route.
        return router.createUrlTree([target === router.url ? '/bms/no-access' : target]);
      })
    );
  }
}
