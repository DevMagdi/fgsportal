import { SharedComponentsModule } from 'src/app/shared/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';
import { DashBoardComponent } from '../admin-panel/dash-board/dash-board.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { DevMonthlyProgressComponent } from '../admin-panel/dash-board/dev-monthly-progress/dev-monthly-progress.component';
import { PendingVacationRequestsComponent } from '../admin-panel/admin-vacations/pending-vacation-requests/pending-vacation-requests.component';
import { FormsModule } from '@angular/forms';
import { PendingTransportationsComponent } from '../admin-panel/pending-transportations/pending-transportations.component';
import { MonthlyTransportationSheetComponent } from '../admin-panel/monthly-transportation-sheet/monthly-transportation-sheet.component';
import { AdminVacationsComponent } from '../admin-panel/admin-vacations/admin-vacations.component';
import { AnnouncementsComponent } from '../admin-panel/announcements/announcements.component';
import { OfficialVacationsComponent } from '../admin-panel/admin-vacations/official-vacations/official-vacations.component';
import { UsersDataComponent } from '../admin-panel/users-data/users-data.component';


@NgModule({
  declarations: [
    AdminPanelComponent,
    DashBoardComponent,
    DevMonthlyProgressComponent,
    PendingVacationRequestsComponent,
    PendingTransportationsComponent,
    MonthlyTransportationSheetComponent,
    AdminVacationsComponent,
    AnnouncementsComponent,
    OfficialVacationsComponent,
    UsersDataComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularMaterialModule,
    FormsModule,
    SharedComponentsModule
  ]
})
export class AdminModule { }
