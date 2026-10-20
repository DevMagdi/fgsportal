import { SupportReportsComponent } from './components/support-reports/support-reports.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { SigninComponent } from './components/signin/signin.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { ManagerModule } from './components/manager/manager/manager.module';
import { CommonModule } from '@angular/common';


// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ManagerModule } from './components/manager/manager/manager.module';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';

import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { DialogComponent } from './components/dialog/dialog.component';
// import { HistoryComponent } from './components/dev/components/history/history.component';
import { ProjectSubTasksComponent } from './components/project-sub-tasks/project-sub-tasks.component';
import { ReportsApprovalComponent } from './components/manager/components/reports-approval/reports-approval.component';
import { RejectedReportsComponent } from './components/dev/components/rejected-reports/rejected-reports.component';
import { PendingReportsComponent } from './shared/pending-reports/pending-reports.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AngularMaterialModule } from './angular-material.module';
import { UserAnnualLeaveComponent } from './components/user-details/user-annual-leave/user-annual-leave.component';
import { MyProjectsAndTasksComponent } from './components/user-details/my-projects-and-tasks/my-projects-and-tasks.component';
import { RelativesComponent } from './components/user-details/relatives/relatives.component';



import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { MessagingService } from "./services/messaging.service";
import { AsyncPipe } from "../../node_modules/@angular/common";
import { NotificationPageComponent } from './components/notification-page/notification-page.component';
import { OverDueTasksComponent } from './components/user-details/over-due-tasks/over-due-tasks.component';
import { PublicUsersPageComponent } from './components/public-users-page/public-users-page.component';
// import { CommunityComponent } from './components/community/community.component';
// import { IssueDetailsComponent } from './components/community/issue-details/issue-details.component';
import { SystemLogsComponent } from './components/system-logs/system-logs.component';
import { FollowClientTicketsComponent } from './components/follow-client-tickets/follow-client-tickets.component';
import { FollowClientTicketDetailsComponent } from './components/follow-client-tickets/follow-client-ticket-details/follow-client-ticket-details.component';
import { UnderMaintenanceComponent } from './components/under-maintenance/under-maintenance.component';
import { ForgetpassowrdComponent } from './components/forgetpassowrd/forgetpassowrd.component';
import { ChatGPTComponent } from './components/chat-gpt/chat-gpt.component';
import { StandardRateFormComponent } from './components/standard-rate-form/standard-rate-form.component';
import { NotesComponent } from './components/notes/notes.component';
import { GlobalTimeSheetComponent } from './components/global-time-sheet/global-time-sheet.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ModuleDisabledComponent } from './components/module-disabled/module-disabled.component';
import { SharedComponentsModule } from './shared/shared-components.module';
import { ProjectCostComponent } from './components/manager/components/project-cost/project-cost.component';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';



@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    LogoutComponent,
    NavbarComponent,
    ProjectDetailsComponent,
    SnackbarComponent,
    DialogComponent,
    // HistoryComponent,
    ProjectSubTasksComponent,
    ReportsApprovalComponent,
    // RejectedReportsComponent,
    // PendingReportsComponent,
    UserDetailsComponent,
    UserAnnualLeaveComponent,
    MyProjectsAndTasksComponent,
    RelativesComponent,
    NotificationPageComponent,
    OverDueTasksComponent,
    PublicUsersPageComponent,
    // CommunityComponent,
    // IssueDetailsComponent,
    SystemLogsComponent,
    FollowClientTicketsComponent,
    FollowClientTicketDetailsComponent,
    UnderMaintenanceComponent,
    ForgetpassowrdComponent,
    ChatGPTComponent,
    StandardRateFormComponent,
    NotesComponent,
    GlobalTimeSheetComponent,
    PageNotFoundComponent,
    ModuleDisabledComponent,
    ProjectCostComponent,
    SupportReportsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    ManagerModule,
    CommonModule,
    AngularMaterialModule,

    AngularFireDatabaseModule,
    AngularFireMessagingModule,
    // Angular Material 

    BrowserAnimationsModule,
    SharedComponentsModule,
    MenuModule,
    TooltipModule,
    ChartModule

  ],
  exports: [
    ProjectDetailsComponent,
    AngularMaterialModule,

  ],
  providers: [MessagingService, AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
