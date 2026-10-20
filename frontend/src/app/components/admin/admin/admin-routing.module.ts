import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerGuard } from 'src/app/services/manager.guard';
import { AdminVacationsComponent } from '../admin-panel/admin-vacations/admin-vacations.component';
import { DashBoardComponent } from '../admin-panel/dash-board/dash-board.component';
import { MonthlyTransportationSheetComponent } from '../admin-panel/monthly-transportation-sheet/monthly-transportation-sheet.component';
import { PendingTransportationsComponent } from '../admin-panel/pending-transportations/pending-transportations.component';
import { AnnouncementsComponent } from '../admin-panel/announcements/announcements.component';
import { TimeSheetComponent } from '../../dev/components/time-sheet/time-sheet.component';
import { UsersDataComponent } from '../admin-panel/users-data/users-data.component';

const routes: Routes = [
  { path: 'dashboard', component:DashBoardComponent,canActivate:[ManagerGuard]},
  { path: 'vacations', component:AdminVacationsComponent,canActivate:[ManagerGuard]},
  { path: 'pendingtransportations', component:PendingTransportationsComponent,canActivate:[ManagerGuard]},
  { path: 'transportationsheet', component:MonthlyTransportationSheetComponent,canActivate:[ManagerGuard]},
  { path: 'announces', component:AnnouncementsComponent,canActivate:[ManagerGuard]},
  { path: 'usersdata', component:UsersDataComponent,canActivate:[ManagerGuard]},
  // { path: 'timesheet', component:TimeSheetComponent,canActivate:[ManagerGuard]},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
