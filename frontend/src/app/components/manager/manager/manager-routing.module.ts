import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerGuard } from 'src/app/services/manager.guard';
// import { ClientTicketsComponent } from '../../client/Components/client-tickets/client-tickets.component';
import { ProjectDetailsComponent } from '../../project-details/project-details.component';
import { ProjectSubTasksComponent } from '../../project-sub-tasks/project-sub-tasks.component';
import { ConfigurationsComponent } from '../components/configurations/configurations.component';
import { CreateUserComponent } from '../components/create-user/create-user.component';
import { IncentiveComponent } from '../components/incentive/incentive.component';
import { LicenseDetailsComponent } from '../components/license/license-details/license-details.component';
import { LicenseComponent } from '../components/license/license.component';
import { ManagerComponent } from '../components/manager/manager.component';
import { OpenToWorkComponent } from '../components/open-to-work/open-to-work.component';
import { OrgChartComponent } from '../components/org-chart/org-chart.component';
import { PartnerDetailsComponent } from '../components/partners/partner-details/partner-details.component';
import { PartnersComponent } from '../components/partners/partners.component';
import { ProjectCostComponent } from '../components/project-cost/project-cost.component';
import { ProjectsComponent } from '../components/projects/projects.component';
import { PublicRequestsApprovalComponent } from '../components/public-requests-approval/public-requests-approval.component';
import { RateUserComponent } from '../components/rating/rate-user/rate-user.component';
import { RatingConfigComponent } from '../components/rating/rating-config/rating-config.component';
import { RatingComponent } from '../components/rating/rating.component';
import { ReportsApprovalComponent } from '../components/reports-approval/reports-approval.component';
import { ReportsComponent } from '../components/reports/reports.component';
import { SalariesComponent } from '../components/salaries/salaries.component';
import { SupportDetailsComponent } from '../components/support/support-details/support-details.component';
import { SupportComponent } from '../components/support/support.component';
import { PublicReportsComponent } from '../components/public-reports/public-reports.component';
import { ManageAdminTasksComponent } from '../components/manage-admin-tasks/manage-admin-tasks.component';
import { DevProgressComponent } from '../components/dev-progress/dev-progress.component';
import { InstallmentsComponent } from '../components/installments/installments.component';
import { NewInstallmentComponent } from '../components/installments/new-installment/new-installment.component';
import { InstallmentDetailsComponent } from '../components/installments/installment-details/installment-details.component';
import { AllInstallmentsComponent } from '../components/installments/all-installments/all-installments.component';
import { CloneProjectComponent } from '../components/clone-project/clone-project.component';
import { ProjectManagerReportComponent } from '../components/project-manager-report/project-manager-report.component';
import { ManagerReportsComponent } from '../components/manager-reports/manager-reports.component';

const routes: Routes = [
  { path: 'projects', component: ProjectsComponent ,canActivate:[ManagerGuard]},
  { path: 'projects/:id', component: ProjectDetailsComponent ,canActivate:[ManagerGuard]},
  { path: 'projects/:id/:subTasks', component: ProjectSubTasksComponent ,canActivate:[ManagerGuard]},
  { path: 'addusers', component: CreateUserComponent  ,canActivate:[ManagerGuard]},
  { path: 'reports', component: ReportsComponent,canActivate:[ManagerGuard]},
  { path: 'public_reports', component: PublicReportsComponent,canActivate:[ManagerGuard]},
  { path: 'admin_tasks', component: ManageAdminTasksComponent,canActivate:[ManagerGuard]},
  
  { path: 'apporval', component: ReportsApprovalComponent ,canActivate:[ManagerGuard]},
  { path: 'salaries', component: SalariesComponent,canActivate:[ManagerGuard]},
  { path: 'costs', component: ProjectCostComponent,canActivate:[ManagerGuard]},
  { path: 'incentive', component: IncentiveComponent,canActivate:[ManagerGuard]},
  { path: 'publicreqs', component: PublicRequestsApprovalComponent,canActivate:[ManagerGuard]},
  { path: 'config', component: ConfigurationsComponent,canActivate:[ManagerGuard]},
  { path: 'client-support', component: SupportComponent,canActivate:[ManagerGuard]},
  { path: 'client-support/:id', component: SupportDetailsComponent,canActivate:[ManagerGuard]},
  // { path: 'client-tickets', component: ClientTicketsComponent,canActivate:[ManagerGuard]},
  { path: 'license', component: LicenseComponent,canActivate:[ManagerGuard]},
  { path: 'license/:id', component: LicenseDetailsComponent,canActivate:[ManagerGuard]},
  { path: 'partners', component: PartnersComponent,canActivate:[ManagerGuard]},
  { path: 'partners/:id', component: PartnerDetailsComponent ,canActivate:[ManagerGuard]},
  { path: 'org', component: OrgChartComponent ,canActivate:[ManagerGuard]},
  { path: 'available', component: OpenToWorkComponent ,canActivate:[ManagerGuard]},
  { path: 'rating/config', component: RatingConfigComponent ,canActivate:[ManagerGuard]},
  { path: 'rating', component: RatingComponent ,canActivate:[ManagerGuard]},
  { path: 'rating/:id', component: RateUserComponent ,canActivate:[ManagerGuard]},
  { path: 'devprog', component: DevProgressComponent ,canActivate:[ManagerGuard]},
  { path: 'installments/:type', component: InstallmentsComponent ,canActivate:[ManagerGuard]},
  { path: 'installments/:type/new', component: NewInstallmentComponent ,canActivate:[ManagerGuard]},
  { path: 'installments/:type/all', component: AllInstallmentsComponent ,canActivate:[ManagerGuard]},
  { path: 'installments/:type/:id', component: InstallmentDetailsComponent ,canActivate:[ManagerGuard]},
  { path: 'cloneProject/:id', component: CloneProjectComponent ,canActivate:[ManagerGuard]},
  
  { path: 'project-manager-reports', component: ProjectManagerReportComponent ,canActivate:[ManagerGuard]},
  // { path: 'manager-reports', component: ManagerReportsComponent ,canActivate:[ManagerGuard]},


  

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
