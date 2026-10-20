import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CRMRoutingModule } from './crm-routing.module';
import { CrmMainComponent } from './Components/crm-main/crm-main.component';
import { CampaignsComponent } from './Components/campaigns/campaigns.component';
import { LeadsComponent } from './Components/leads/leads.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ContactsComponent } from './Components/contacts/contacts.component';
import { FormsModule } from '@angular/forms';
import { AccountDetailsComponent } from './Components/account-details/account-details.component';
import { PocRequestsComponent } from './Components/poc-requests/poc-requests.component';
import { AccountsComponent } from './Components/accounts/accounts.component';
import { ActivitiesComponent } from './Components/activities/activities.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { OpportunityComponent } from './Components/opportunity/opportunity.component';
import { OrganizationDetailsComponent } from './Components/accounts/organization-details/organization-details.component';
import { LeadCostDetailsFormComponent } from './Components/lead-cost-details-form/lead-cost-details-form.component';
import { ClosedLeadsComponent } from './Components/closed-leads/closed-leads.component';
import { SharedComponentsModule } from 'src/app/shared/shared-components.module';
import { ActivityFormComponent } from './Components/accounts/organization-details/activity-form/activity-form.component';
import { CrmReportsComponent } from './Components/crm-reports/crm-reports.component';
import { ContactLeadReportComponent } from './Components/crm-reports/contact-lead-report/contact-lead-report.component';

import { ActivitiesReportComponent } from './Components/crm-reports/activities-report/activities-report.component';
import { ActivityDetailsViewComponent } from './Components/crm-reports/activities-report/activity-details-view/activity-details-view.component';
import { ContactLeadDetailsViewComponent } from './Components/crm-reports/contact-lead-report/contact-lead-details-view/contact-lead-details-view.component';


@NgModule({
  declarations: [
    CrmMainComponent,
    CampaignsComponent,
    LeadsComponent,
    ContactsComponent,
    AccountDetailsComponent,
    PocRequestsComponent,
    AccountsComponent,
    ActivitiesComponent,
    DashboardComponent,
    OpportunityComponent,
    OrganizationDetailsComponent,
    LeadCostDetailsFormComponent,
    ClosedLeadsComponent,
    ActivityFormComponent,
    CrmReportsComponent,
    ContactLeadReportComponent,
    ActivitiesReportComponent,
    ActivityDetailsViewComponent,
    ContactLeadDetailsViewComponent
  ],
  imports: [
    CommonModule,
    CRMRoutingModule,
    FormsModule,
    AngularMaterialModule,
    SharedComponentsModule
  ]
})
export class CRMModule { }
