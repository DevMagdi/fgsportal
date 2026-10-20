import { Injectable } from '@angular/core';
import { AuthApiService } from './auth-api.service';
import { ModuleService } from './module.service';
import {
  ModulePage,
  PageVisibilityContext,
  visiblePages,
} from './module-pages.registry';

/**
 * Bridges the declarative module-pages registry with the logged-in user's
 * department/role/permissions, so the module detail cards show exactly the
 * same features the sidebar would for that user.
 */
@Injectable({ providedIn: 'root' })
export class ModulePagesService {
  constructor(
    private authApi: AuthApiService,
    private moduleService: ModuleService
  ) {}

  isModuleEnabled(slug: string): boolean {
    return this.moduleService.isModuleEnabled(slug);
  }

  /** Feature pages of a module after applying the sidebar visibility rules. */
  pagesFor(slug: string): ModulePage[] {
    return visiblePages(slug, this.buildContext());
  }

  private buildContext(): PageVisibilityContext {
    const user = this.authApi.currentUser ?? this.authApi.user.value ?? null;
    const permissionIds = (this.authApi.userPerms ?? [])
      .map((p) => Number(p.permission_id))
      .filter((id) => !Number.isNaN(id));

    const department = user?.department;
    const position = user?.accPosition;

    // Same computation as NavbarComponent.ngOnInit.
    const isManager =
      department === '1' || (department === '2' && position === '5');
    const isAdmin = department === '4';

    return {
      user: user
        ? {
            department: user.department,
            accRole: user.accRole,
            accPosition: user.accPosition,
          }
        : null,
      permissionIds,
      isManager,
      isAdmin,
    };
  }
}
