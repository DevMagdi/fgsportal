import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BmsApiService } from './bms-api.service';
import { hasAbility } from './bms-abilities.util';

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
  private failed$ = new BehaviorSubject<boolean>(false);

  /** Abilities for the global navigation: `null` until the first load settles. */
  readonly abilities$: Observable<string[] | null> = this.can$.asObservable();
  /** True when the last abilities request failed (the sidebar offers a retry). */
  readonly loadFailed$: Observable<boolean> = this.failed$.asObservable();

  constructor(private api: BmsApiService) {}

  abilities(): Observable<string[]> {
    if (this.can$.value !== null) {
      return of(this.can$.value);
    }
    return this.api.get<any>('lookups').pipe(
      map(data => (data?.can || []) as string[]),
      tap(can => { this.failed$.next(false); this.can$.next(can); }),
      catchError(() => {
        this.failed$.next(true);
        this.can$.next([]);
        return of([] as string[]);
      })
    );
  }

  /**
   * Re-read the abilities from the server without blanking the current ones,
   * so the global sidebar never flashes empty. Called by the application shell
   * when a session starts and whenever the user enters the BMS workspace (the
   * retired BMS shell reloaded them at the same moments). A failed refresh
   * keeps the last known abilities; with none known it publishes an empty list.
   */
  refresh(): Observable<string[]> {
    return this.api.get<any>('lookups').pipe(
      map(data => (data?.can || []) as string[]),
      tap(can => { this.failed$.next(false); this.can$.next(can); }),
      catchError(() => {
        this.failed$.next(true);
        if (this.can$.value === null) this.can$.next([]);
        return of(this.can$.value || []);
      })
    );
  }

  can(ability: string): boolean {
    return hasAbility(this.can$.value, ability);
  }

  /** First page the user may open, or the access screen when nothing matches. */
  firstLanding(): string {
    const found = BmsAccessService.LANDING.find(entry => this.can(entry.ability));
    return found ? found.path : '/bms/no-access';
  }

  /** Refresh after a role change / re-login. */
  reset(): void {
    this.failed$.next(false);
    this.can$.next(null);
  }

  guard(ability: string | undefined, router: Router): Observable<boolean | UrlTree> {
    return this.abilities().pipe(
      map(can => {
        if (!ability || hasAbility(can, ability)) {
          return true;
        }
        const target = this.firstLanding();
        // Never bounce the user to the same blocked route.
        return router.createUrlTree([target === router.url ? '/bms/no-access' : target]);
      })
    );
  }
}
