import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BmsAccessService } from './bms-access.service';
import { BmsApiService } from './bms-api.service';
import { BmsExportService } from './bms-export.service';
import { BmsLanguageService } from './bms-language.service';
import { BmsPermissionGuard } from './bms-permission.guard';
import { BmsShellComponent } from './bms-shell.component';
import { ExecutiveDashboardComponent } from './dashboard/executive-dashboard.component';
import { BusinessUnitsComponent } from './units/business-units.component';
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

/** Every screen declares the ability it needs; the guard enforces it. */
const routes: Routes = [{
  path: '', component: BmsShellComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'no-access', component: BmsNoAccessComponent },
    { path: 'dashboard', component: ExecutiveDashboardComponent, data: { ability: 'dashboard.view' }, canActivate: [BmsPermissionGuard] },
    { path: 'units', component: BusinessUnitsComponent, data: { ability: 'units.view' }, canActivate: [BmsPermissionGuard] },
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
    BmsShellComponent, ExecutiveDashboardComponent, BusinessUnitsComponent, WeeklyPlansComponent,
    OpportunitiesComponent, ProductTrackingComponent, BmsCollectionComponent, MeetingsComponent,
    ReportsComponent, AccessComponent, EmployeeManagementComponent, MyTasksComponent, BmsNoAccessComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  providers: [BmsApiService, BmsLanguageService, BmsExportService, BmsAccessService],
})
export class BmsModule {}
