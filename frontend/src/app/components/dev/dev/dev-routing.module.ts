import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevGuard } from 'src/app/services/dev.guard';
import { ProjectDetailsComponent } from '../../project-details/project-details.component';
import { ProjectSubTasksComponent } from '../../project-sub-tasks/project-sub-tasks.component';
import { DevProjectsComponent } from '../components/dev-projects/dev-projects.component';
import { HistoryComponent } from '../components/history/history.component';
import { PendingReportsComponent } from '../../../shared/pending-reports/pending-reports.component';
import { PublicRequestComponent } from '../components/public-request/public-request.component';
import { RejectedReportsComponent } from '../components/rejected-reports/rejected-reports.component';
import { SeniorReportApprovalComponent } from '../components/senior-report-approval/senior-report-approval.component';
import { TimeSheetComponent } from '../components/time-sheet/time-sheet.component';
import { TransportaionsComponent } from '../components/transportaions/transportaions.component';
import { RequestsComponent } from '../components/requests/requests.component';
import { DevReportsComponent } from '../components/dev-reports/dev-reports.component';

const routes: Routes = [
  { path: 'myprojects', component: DevProjectsComponent, canActivate: [DevGuard] },
  { path: 'myprojects/:id', component: ProjectDetailsComponent, canActivate: [DevGuard] },
  { path: 'myprojects/:id/:subTasks', component: ProjectSubTasksComponent, canActivate: [DevGuard] },
  { path: 'timesheet', component: TimeSheetComponent, canActivate: [DevGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [DevGuard] },
  { path: 'rejected', component: RejectedReportsComponent, canActivate: [DevGuard] },
  { path: 'pending', component: PendingReportsComponent, canActivate: [DevGuard] },
  { path: 'reports', component: DevReportsComponent, canActivate: [DevGuard] },
  { path: 'transportaions', component: TransportaionsComponent, canActivate: [DevGuard] },
  { path: 'requests', component: RequestsComponent, canActivate: [DevGuard] },
  { path: 'reportsToApprove', component: SeniorReportApprovalComponent, canActivate: [DevGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevRoutingModule { }
