import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Shown when a user navigates to a route belonging to a module their company
 * has not purchased/enabled.
 */
@Component({
  selector: 'app-module-disabled',
  template: `
    <div class="module-disabled-container d-flex flex-column align-items-center justify-content-center text-center p-5">
      <div class="card shadow-sm p-5" style="max-width: 520px;">
        <h2 class="mb-3">Module not enabled</h2>
        <p class="text-muted">
          The <strong>{{ moduleSlug }}</strong> module is not enabled for your company.
          Please contact your administrator or the FGS Connect sales team to enable it.
        </p>
        <div class="d-flex gap-2 justify-content-center mt-3">
          <button class="btn btn-outline-primary" type="button" (click)="browseModules()">Browse all modules</button>
          <button class="btn btn-primary" type="button" (click)="goBack()">Go back</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .module-disabled-container {
        min-height: 70vh;
      }
    `,
  ],
})
export class ModuleDisabledComponent implements OnInit {
  moduleSlug = 'requested';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.moduleSlug = this.route.snapshot.queryParamMap.get('module') ?? 'requested';
  }

  goBack(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigateByUrl(returnUrl && returnUrl !== '/module-disabled' ? '/' : '/');
  }

  browseModules(): void {
    this.router.navigateByUrl('/modules');
  }
}
