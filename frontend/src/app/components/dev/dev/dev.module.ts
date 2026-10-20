import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevRoutingModule } from './dev-routing.module';
import { DevComponent } from '../components/dev/dev.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DevProjectsComponent } from '../components/dev-projects/dev-projects.component';
import { TimeSheetComponent } from '../components/time-sheet/time-sheet.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TransportaionsComponent } from '../components/transportaions/transportaions.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { PublicRequestComponent } from '../components/public-request/public-request.component';
import { SeniorReportApprovalComponent } from '../components/senior-report-approval/senior-report-approval.component';
import { RequestsComponent } from '../components/requests/requests.component';
import { SharedComponentsModule } from 'src/app/shared/shared-components.module';
import { DevReportsComponent } from '../components/dev-reports/dev-reports.component';
import { RejectedReportsComponent } from '../components/rejected-reports/rejected-reports.component';
import { HistoryComponent } from '../components/history/history.component';


@NgModule({
  declarations: [
    DevComponent,
    DevProjectsComponent,
    TimeSheetComponent,
    TransportaionsComponent,
    PublicRequestComponent,
    SeniorReportApprovalComponent,
    RequestsComponent,
    DevReportsComponent,
    RejectedReportsComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    DevRoutingModule,
    MatSidenavModule,
    FormsModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatMenuModule,
    MatProgressBarModule,
    AngularMaterialModule,
    SharedComponentsModule

  ],
  exports: [
    DevComponent,
    DevProjectsComponent
  ]
})
export class DevModule { }
