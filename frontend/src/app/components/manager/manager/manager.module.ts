import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { CreateUserComponent } from '../components/create-user/create-user.component';
import { ProjectsComponent } from '../components/projects/projects.component';
import { ManagerComponent } from '../components/manager/manager.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportsComponent } from '../components/reports/reports.component';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
// import {MatIconModule} from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedComponentsModule } from 'src/app/shared/shared-components.module';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ProjectReportComponent } from '../components/allReports/project-report/project-report.component';
import { ClosedProjectsComponent } from '../components/allReports/closed-projects/closed-projects.component';
import { SalariesComponent } from '../components/salaries/salaries.component';
import { EditSalariesComponent } from '../components/salaries/edit-salaries/edit-salaries.component';
import { MonthlySalariesComponent } from '../components/salaries/monthly-salaries/monthly-salaries.component';
import { ProjectCostComponent } from '../components/project-cost/project-cost.component';
import { IncentiveComponent } from '../components/incentive/incentive.component';
import { IncentiveRequestsComponent } from '../components/incentive/incentive-requests/incentive-requests.component';
import { IncentiveApprovedComponent } from '../components/incentive/incentive-approved/incentive-approved.component';
import { IncentiveHistoryComponent } from '../components/incentive/incentive-history/incentive-history.component';
import { ApprovedSalariesComponent } from '../components/salaries/approved-salaries/approved-salaries.component';
import { PublicRequestsApprovalComponent } from '../components/public-requests-approval/public-requests-approval.component';
import { RequestsHistoryComponent } from '../components/public-requests-approval/requests-history/requests-history.component';
import { ConfigurationsComponent } from '../components/configurations/configurations.component';
import { RamadanConfigComponent } from '../components/configurations/ramadan-config/ramadan-config.component';
import { UserPermissionsComponent } from '../components/configurations/user-permissions/user-permissions.component';
import { SecurityComponent } from '../components/configurations/security/security.component';
import { AccountsCenterComponent } from '../components/accounts-center/accounts-center.component';
import { ClientsAccountsComponent } from '../components/accounts-center/clients-accounts/clients-accounts.component';
import { SupportComponent } from '../components/support/support.component';
import { SupportDetailsComponent } from '../components/support/support-details/support-details.component';
import { VacationReportComponent } from '../components/allReports/vacation-report/vacation-report.component';
import { LicenseComponent } from '../components/license/license.component';
import { LicenseDetailsComponent } from '../components/license/license-details/license-details.component';
import { PartnersComponent } from '../components/partners/partners.component';
import { PartnerDetailsComponent } from '../components/partners/partner-details/partner-details.component';
import { OrgChartComponent } from '../components/org-chart/org-chart.component';
import { OpenToWorkComponent } from '../components/open-to-work/open-to-work.component';
import { RatingComponent } from '../components/rating/rating.component';
import { RatingConfigComponent } from '../components/rating/rating-config/rating-config.component';
import { RateUserComponent } from '../components/rating/rate-user/rate-user.component';
import { MyRatesComponent } from '../components/rating/my-rates/my-rates.component';
import { RateMyEmpsComponent } from '../components/rating/rate-my-emps/rate-my-emps.component';
import { PublicReportsComponent } from '../components/public-reports/public-reports.component';
import { EmpWeeklyReportsComponent } from '../components/public-reports/emp-weekly-reports/emp-weekly-reports.component';
import { ManageAdminTasksComponent } from '../components/manage-admin-tasks/manage-admin-tasks.component';
import { DevProgressComponent } from '../components/dev-progress/dev-progress.component';
import { InstallmentsComponent } from '../components/installments/installments.component';
import { NewInstallmentComponent } from '../components/installments/new-installment/new-installment.component';
import { InstallmentDetailsComponent } from '../components/installments/installment-details/installment-details.component';
import { AllInstallmentsComponent } from '../components/installments/all-installments/all-installments.component';
import { DialogModule } from 'primeng/dialog';
import { CloneProjectComponent } from '../components/clone-project/clone-project.component';
import { AvailableDevComponent } from '../components/available-dev/available-dev.component';
import { ProjectManagerReportComponent } from '../components/project-manager-report/project-manager-report.component';
import { ManageReportComponent } from '../components/project-manager-report/manage-report/manage-report.component';
import { ManagerReportsComponent } from '../components/manager-reports/manager-reports.component';
import { ShowReportComponent } from '../components/project-manager-report/show-report/show-report.component';
import { ReportsTableComponent } from '../components/project-manager-report/reports-table/reports-table.component';
import { ContractSupportCostComponent } from '../components/support/support-details/contract-support-cost/contract-support-cost.component';


@NgModule({
  declarations: [
    CreateUserComponent,
    ProjectsComponent,
    ManagerComponent,
    ReportsComponent,
    ProjectReportComponent,
    ClosedProjectsComponent,
    SalariesComponent,
    EditSalariesComponent,
    MonthlySalariesComponent,
    // ProjectCostComponent,
    IncentiveComponent,
    IncentiveRequestsComponent,
    IncentiveApprovedComponent,
    IncentiveHistoryComponent,
    ApprovedSalariesComponent,
    PublicRequestsApprovalComponent,
    RequestsHistoryComponent,
    ConfigurationsComponent,
    RamadanConfigComponent,
    UserPermissionsComponent,
    SecurityComponent,
    AccountsCenterComponent,
    ClientsAccountsComponent,
    SupportComponent,
    SupportDetailsComponent,
    VacationReportComponent,
    LicenseComponent,
    LicenseDetailsComponent,
    PartnersComponent,
    PartnerDetailsComponent,
    OrgChartComponent,
    OpenToWorkComponent,
    RatingComponent,
    RatingConfigComponent,
    RateUserComponent,
    MyRatesComponent,
    RateMyEmpsComponent,
    PublicReportsComponent,
    EmpWeeklyReportsComponent,
    ManageAdminTasksComponent,
    DevProgressComponent,
    InstallmentsComponent,
    NewInstallmentComponent,
    InstallmentDetailsComponent,
    AllInstallmentsComponent,
    CloneProjectComponent,
    AvailableDevComponent,
    ProjectManagerReportComponent,
    ManageReportComponent,
    ManagerReportsComponent,
    ShowReportComponent,
    ReportsTableComponent,
    ContractSupportCostComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    // BrowserAnimationsModule,
    MatSidenavModule,
    FormsModule,
    MatTabsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTableModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    NgxPaginationModule,
    NgbModule,
    MatButtonModule,
    // MatIconModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatListModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SharedComponentsModule,
    AngularMaterialModule,
    DialogModule,


  ],
  exports: [
    CreateUserComponent,
    ProjectsComponent,
    ManagerComponent,
    MatTabsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTableModule,
    MatExpansionModule,
    MatPaginatorModule,
    NgbModule,
    MatButtonModule,
    // MatIconModule,
    MatRippleModule,
    PartnerDetailsComponent
  ]
})
export class ManagerModule { }

/*
                  _  
   /\     /\/\   |_| 
__/--\__ /    \  |  \
*/

/*
 <*)
  ||______
   (______}
     |  |
     ^  ^
*/