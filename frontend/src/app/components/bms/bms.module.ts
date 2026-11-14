import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BmsExportService } from './bms-export.service';
import { BmsPermissionGuard } from './bms-permission.guard';
import { BmsStateModule } from './bms-state.module';
import { BmsConfirmDialogComponent } from './bms-confirm-dialog.component';
import { BmsConfirmService } from './bms-confirm.service';
import { ExecutiveDashboardComponent } from './dashboard/executive-dashboard.component';
import { BusinessUnitsComponent } from './units/business-units.component';
import { UnitDetailComponent } from './units/unit-detail.component';
import { OrganizationOverviewComponent } from './organization/organization-overview.component';
import { UnitTeamsComponent } from './organization/unit-teams.component';
import { BmsUiModule } from './ui/bms-ui.module';
import { WeeklyPlansComponent } from './plans/weekly-plans.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { ProductTrackingComponent } from './products/product-tracking.component';
import { BmsCollectionComponent } from './collection/bms-collection.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { ReportsComponent } from './reports/reports.component';
import { EmployeeManagementComponent } from './employees/employee-management.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { BmsNoAccessComponent } from './no-access/bms-no-access.component';
import { BMS_COLLECTIONS } from './bms-catalog';
import { AccessComponent } from './access/access.component';

/**
 * Every screen declares the ability it needs; the guard enforces it.
 *
 * The parent route is component-less: BMS pages render directly inside the
 * single application shell (`AppShellComponent`), which owns the only sidebar
 * and header. There is no BMS-specific shell any more.
 */
const routes: Routes = [{
  path: '', children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'no-access', component: BmsNoAccessComponent },
    { path: 'dashboard', component: ExecutiveDashboardComponent, data: { ability: 'dashboard.view' }, canActivate: [BmsPermissionGuard] },
    { path: 'organization', component: OrganizationOverviewComponent, data: { ability: 'units.view' }, canActivate: [BmsPermissionGuard] },
    { path: 'units', component: BusinessUnitsComponent, data: { ability: 'units.view' }, canActivate: [BmsPermissionGuard] },
    { path: 'units/:id', component: UnitDetailComponent, data: { ability: 'units.view' }, canActivate: [BmsPermissionGuard] },
    { path: 'plans', component: WeeklyPlansComponent, data: { ability: 'plans.view' }, canActivate: [BmsPermissionGuard] },
    { path: 'my-tasks', component: MyTasksComponent, data: { ability: 'plans.view' }, canActivate: [BmsPermissionGuard] },
    { path: 'opportunities', component: OpportunitiesComponent, data: { ability: 'opportunities.view' }, canActivate: [BmsPermissionGuard] },
    { path: 'products', component: ProductTrackingComponent, data: { ability: 'products.view' }, canActivate: [BmsPermissionGuard] },
    { path: 'meetings', component: MeetingsComponent, data: { ability: 'meetings.view' }, canActivate: [BmsPermissionGuard] },
    { path: 'reports', component: ReportsComponent, data: { ability: 'reports.view' }, canActivate: [BmsPermissionGuard] },
    { path: 'access', component: AccessComponent, data: { ability: 'roles.manage' }, canActivate: [BmsPermissionGuard] },
    { path: 'employees', component: EmployeeManagementComponent, data: { ability: 'directory.view' }, canActivate: [BmsPermissionGuard] },
    ...Object.keys(BMS_COLLECTIONS).map(key => ({
      path: key,
      component: BmsCollectionComponent,
      data: { config: BMS_COLLECTIONS[key], ability: `${BMS_COLLECTIONS[key].manage.replace('.manage', '')}.view` },
      canActivate: [BmsPermissionGuard],
    })),
  ],
}];

@NgModule({
  declarations: [
    BmsConfirmDialogComponent, ExecutiveDashboardComponent, BusinessUnitsComponent, WeeklyPlansComponent,
    OpportunitiesComponent, ProductTrackingComponent, BmsCollectionComponent, MeetingsComponent,
    ReportsComponent, AccessComponent, EmployeeManagementComponent, MyTasksComponent, BmsNoAccessComponent,
    OrganizationOverviewComponent, UnitDetailComponent, UnitTeamsComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, BmsStateModule, BmsUiModule, RouterModule.forChild(routes)],
  // BmsApiService, BmsAccessService and BmsLanguageService are root singletons shared with the application shell.
  providers: [BmsExportService, BmsConfirmService],
})
export class BmsModule {}
