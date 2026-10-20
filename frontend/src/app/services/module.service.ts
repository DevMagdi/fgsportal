import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface SystemModule {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_core: boolean;
  is_active: boolean;
  is_enabled: boolean;
}

const STORAGE_KEY = 'enabledModules';

/**
 * Holds the modules enabled for the logged-in user's company.
 *
 * The list is fetched from the backend right after login / autoLogin and is
 * mirrored to localStorage so route guards and the navbar work synchronously
 * on a page refresh even before the HTTP response arrives.
 */
@Injectable({ providedIn: 'root' })
export class ModuleService {
  private enabledModulesSubject = new BehaviorSubject<string[]>(this.readStorage());
  private loadedSubject = new BehaviorSubject<boolean>(this.hasStoredData());
  private catalogueSubject = new BehaviorSubject<SystemModule[]>([]);

  /** Stream of enabled module slugs. */
  enabledModules$: Observable<string[]> = this.enabledModulesSubject.asObservable();
  /** Emits true once the first entitlement load (or cache restore) is done. */
  loaded$: Observable<boolean> = this.loadedSubject.asObservable();
  /** Stream of the full module catalogue (enabled and disabled) with per-company state. */
  catalogue$: Observable<SystemModule[]> = this.catalogueSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Fetch the full module catalogue (all six sellable modules, each with its
   * `is_enabled` state for the current company). Used by the modules dashboard
   * so disabled modules can still be shown as dimmed cards.
   */
  loadCatalogue(): Observable<SystemModule[]> {
    const token = this.getToken();
    if (!token) {
      return of(this.getCatalogue());
    }

    return this.http
      .get<any>(`${environment.newServerApi}/api/modules?token=${token}`)
      .pipe(
        map((res) => (res?.data ?? []) as SystemModule[]),
        tap((modules) => {
          this.catalogueSubject.next(modules);
          // Keep the enabled-slug cache in sync with the catalogue response.
          const slugs = modules.filter((m) => m.is_enabled).map((m) => m.slug);
          if (slugs.length > 0) {
            this.setEnabledModules(slugs);
          }
        }),
        catchError(() => of(this.getCatalogue()))
      );
  }

  /** Synchronous snapshot of the full catalogue (empty until first load). */
  getCatalogue(): SystemModule[] {
    return [...this.catalogueSubject.value];
  }

  /**
   * Fetch the modules enabled for the current user's company.
   * Safe to call repeatedly; failures keep the last known cached value.
   */
  loadEnabledModules(): Observable<string[]> {
    const token = this.getToken();
    if (!token) {
      this.loadedSubject.next(true);
      return of(this.getEnabledModules());
    }

    return this.http
      .get<any>(`${environment.newServerApi}/api/company/modules?token=${token}`)
      .pipe(
        map((res) => {
          const modules: SystemModule[] = res?.data ?? [];
          return modules.map((m) => m.slug);
        }),
        tap((slugs) => {
          this.setEnabledModules(slugs);
          this.loadedSubject.next(true);
        }),
        catchError(() => {
          // Keep cached entitlements if the backend is temporarily unavailable.
          this.loadedSubject.next(true);
          return of(this.getEnabledModules());
        })
      );
  }

  /** Synchronous check used by templates and guards. Core is always enabled. */
  isModuleEnabled(slug: string): boolean {
    if (slug === 'core') {
      return true;
    }
    return this.enabledModulesSubject.value.includes(slug);
  }

  getEnabledModules(): string[] {
    return [...this.enabledModulesSubject.value];
  }

  setEnabledModules(slugs: string[]): void {
    const unique = Array.from(new Set(slugs));
    this.enabledModulesSubject.next(unique);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
    this.loadedSubject.next(true);
  }

  clear(): void {
    this.enabledModulesSubject.next([]);
    this.loadedSubject.next(false);
    this.catalogueSubject.next([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private readStorage(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  }

  private hasStoredData(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
  }

  private getToken(): string | null {
    try {
      const raw = localStorage.getItem('userData');
      return raw ? JSON.parse(raw)?._token ?? null : null;
    } catch {
      return null;
    }
  }
}
