import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { ChatGPTComponent } from './components/chat-gpt/chat-gpt.component';
// import { CommunityComponent } from './components/community/community.component';
// import { IssueDetailsComponent } from './components/community/issue-details/issue-details.component';
import { CrmMainComponent } from './components/crm/Components/crm-main/crm-main.component';
import { DevComponent } from './components/dev/components/dev/dev.component';
import { FollowClientTicketDetailsComponent } from './components/follow-client-tickets/follow-client-ticket-details/follow-client-ticket-details.component';
import { FollowClientTicketsComponent } from './components/follow-client-tickets/follow-client-tickets.component';
import { ForgetpassowrdComponent } from './components/forgetpassowrd/forgetpassowrd.component';
import { ManagerComponent } from './components/manager/components/manager/manager.component';
import { PublicRequestsApprovalComponent } from './components/manager/components/public-requests-approval/public-requests-approval.component';
import { NotesComponent } from './components/notes/notes.component';
import { NotificationPageComponent } from './components/notification-page/notification-page.component';
import { PublicUsersPageComponent } from './components/public-users-page/public-users-page.component';
import { SigninComponent } from './components/signin/signin.component';
import { SystemLogsComponent } from './components/system-logs/system-logs.component';
import { UnderMaintenanceComponent } from './components/under-maintenance/under-maintenance.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AuthGuardService } from './services/auth-guard.service';
import { CRMGuard } from './services/crm.guard';
import { DevGuard } from './services/dev.guard';
import { ManagerGuard } from './services/manager.guard';
import { ModuleGuard } from './services/module.guard';
import { ModuleDisabledComponent } from './components/module-disabled/module-disabled.component';
import { ModulesCardsComponent } from './components/modules-cards/modules-cards.component';
import { ModuleDetailsComponent } from './components/module-details/module-details.component';
import { TimeSheetComponent } from './components/dev/components/time-sheet/time-sheet.component';
import { GlobalTimeSheetComponent } from './components/global-time-sheet/global-time-sheet.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SupportReportsComponent } from './components/support-reports/support-reports.component';
import { LogoutComponent } from './components/logout/logout.component';

const routes: Routes = [
  // { path: '**', component: UnderMaintenanceComponent },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'forgetpassowrd', component: ForgetpassowrdComponent},
  {path: 'user/:id',component:UserDetailsComponent , canActivate:[AuthGuardService]},
  {path: 'users',component:PublicUsersPageComponent , canActivate:[AuthGuardService]},
  {path: 'notification',component:NotificationPageComponent , canActivate:[AuthGuardService]},
  // {path: 'community',component:CommunityComponent , canActivate:[AuthGuardService]},
  // {path: 'community/:id',component:IssueDetailsComponent , canActivate:[AuthGuardService]},
  {path: 'logs',component:SystemLogsComponent , canActivate:[ManagerGuard]},
  {path: 'notes',component:NotesComponent , canActivate:[AuthGuardService]},
  {path: 'my_work',component:GlobalTimeSheetComponent , canActivate:[AuthGuardService]},
  {path: 'publicReqsApply',component:PublicRequestsApprovalComponent , canActivate:[AuthGuardService]},
  {path: 'module-disabled', component: ModuleDisabledComponent, canActivate:[AuthGuardService]},
  {path: 'modules', component: ModulesCardsComponent, canActivate:[AuthGuardService]},
  {path: 'modules/:slug', component: ModuleDetailsComponent, canActivate:[AuthGuardService]},
  {path: 'tickets',component:FollowClientTicketsComponent , canActivate:[AuthGuardService, ModuleGuard], data: { module: 'ticketing' }},
  {path: 'tickets/:id',component:FollowClientTicketDetailsComponent, canActivate:[AuthGuardService, ModuleGuard], data: { module: 'ticketing' }},
  {path: 'support-reports',component:SupportReportsComponent, canActivate:[AuthGuardService, ModuleGuard], data: { module: 'ticketing' }},
  
  // {path: 'fgsGPT',component:ChatGPTComponent , canActivate:[AuthGuardService]},

  {
    path: 'manager',
    component: ManagerComponent,
    canActivate:[ManagerGuard, ModuleGuard],
    data: { module: 'projects' },
    loadChildren: () => import('./components/manager/manager/manager.module').then(m => m.ManagerModule)
  },
  {
    path: 'dev',
    component: DevComponent,
    canActivate:[DevGuard, ModuleGuard],
    data: { module: 'projects' },
    loadChildren: () => import('./components/dev/dev/dev.module').then(m => m.DevModule)
  },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate:[ManagerGuard, ModuleGuard],
    data: { module: 'admin' },
    loadChildren: () => import('./components/admin/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'CRM',
    component: CrmMainComponent,
    canActivate:[CRMGuard, ModuleGuard],
    data: { module: 'crm' },
    loadChildren: () => import('./components/crm/crm.module').then(m => m.CRMModule),
  },
  {
    path: 'hr',
    canActivate: [ModuleGuard],
    data: { module: 'hr' },
    loadChildren: () => import('./components/hr/hr.module').then(m => m.HrModule),
  },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
