import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRMGuard } from 'src/app/services/crm.guard';
import { CrmMainComponent } from './Components/crm-main/crm-main.component';
import { LeadsComponent } from './Components/leads/leads.component';
import { CampaignsComponent } from './Components/campaigns/campaigns.component';
import { ContactsComponent } from './Components/contacts/contacts.component';
import { AccountDetailsComponent } from './Components/account-details/account-details.component';
import { PocRequestsComponent } from './Components/poc-requests/poc-requests.component';
import { ActivitiesComponent } from './Components/activities/activities.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { ManagerGuard } from 'src/app/services/manager.guard';
import { AccountsComponent } from './Components/accounts/accounts.component';
import { OpportunityComponent } from './Components/opportunity/opportunity.component';
import { OrganizationDetailsComponent } from './Components/accounts/organization-details/organization-details.component';
import { ClosedLeadsComponent } from './Components/closed-leads/closed-leads.component';
import { PublicRequestComponent } from '../dev/components/public-request/public-request.component';
import { CrmReportsComponent } from './Components/crm-reports/crm-reports.component';
import { Department } from 'src/app/interfaces/user';
import { DepartmentGuard } from '../../services/department.guard';

const reportsAllowedDepartments: Department[] = [
  // Department.Business_Development,
  Department.MANAGEMENT,
  // Department.ADMINSTRATION
];

const routes: Routes = [
  { path: '/', component:CrmMainComponent,canActivate:[CRMGuard]},
  { path: 'leads', component:LeadsComponent,canActivate:[CRMGuard]},
  { path: 'contacts', component:ContactsComponent,canActivate:[CRMGuard]},
  { path: 'campaigns', component:CampaignsComponent,canActivate:[CRMGuard]},
  { path: 'leads/:id', component:AccountDetailsComponent,canActivate:[CRMGuard]},
  { path: 'activities', component:ActivitiesComponent,canActivate:[CRMGuard]},
  { path: 'poc-requests', component:PocRequestsComponent,canActivate:[CRMGuard]},
  { path: 'accounts', component:AccountsComponent,canActivate:[CRMGuard]},
  { path: 'accounts/:id', component:OrganizationDetailsComponent,canActivate:[CRMGuard]},
  { path: 'opportunity', component:OpportunityComponent,canActivate:[CRMGuard]},
  { path: 'closed', component:ClosedLeadsComponent,canActivate:[CRMGuard]},
  { path: 'dashboard', component:DashboardComponent,canActivate:[ManagerGuard]},
  { path: 'requests', component: PublicRequestComponent, canActivate:[CRMGuard] },
  { path: 'reports', component: CrmReportsComponent, canActivate:[DepartmentGuard], data: { allowedDepartments: reportsAllowedDepartments } },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CRMRoutingModule { }
