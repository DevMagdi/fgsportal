import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BmsApiService } from './bms-api.service';
import { BmsExportService } from './bms-export.service';
import { BmsLanguageService } from './bms-language.service';
import { BmsShellComponent } from './bms-shell.component';
import { ExecutiveDashboardComponent } from './dashboard/executive-dashboard.component';
import { BusinessUnitsComponent } from './units/business-units.component';
import { WeeklyPlansComponent } from './plans/weekly-plans.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { ProductTrackingComponent } from './products/product-tracking.component';

const routes: Routes = [{path:'',component:BmsShellComponent,children:[
  {path:'',pathMatch:'full',redirectTo:'dashboard'},
  {path:'dashboard',component:ExecutiveDashboardComponent},
  {path:'units',component:BusinessUnitsComponent},
  {path:'plans',component:WeeklyPlansComponent},
  {path:'opportunities',component:OpportunitiesComponent},
  {path:'products',component:ProductTrackingComponent},
]}];

@NgModule({
  declarations:[BmsShellComponent,ExecutiveDashboardComponent,BusinessUnitsComponent,WeeklyPlansComponent,OpportunitiesComponent,ProductTrackingComponent],
  imports:[CommonModule,FormsModule,ReactiveFormsModule,RouterModule.forChild(routes)],
  providers:[BmsApiService,BmsLanguageService,BmsExportService],
})
export class BmsModule {}
