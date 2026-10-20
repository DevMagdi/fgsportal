import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrRoutingModule } from './hr-routing.module';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedComponentsModule } from 'src/app/shared/shared-components.module';
import { CandidateManagementComponent } from './hiring-process/candidates/candidate-management/candidate-management.component';
import { CandidatesComponent } from './hiring-process/candidates/candidates.component';
import { JobProfilesComponent } from './hiring-process/job-profiles/job-profiles.component';
import { JobProfileManagementComponent } from './hiring-process/job-profiles/job-profile-management/job-profile-management.component';
import { CandidateDetailsComponent } from './hiring-process/candidates/candidate-details/candidate-details.component';
import { JobSkillsComponent } from './hiring-process/job-skills/job-skills.component';
import { JobSkillManangementComponent } from './hiring-process/job-skills/job-skill-manangement/job-skill-manangement.component';
import {MatChipsModule} from '@angular/material/chips';
import { CandidateSearchComponent } from './hiring-process/candidates/candidate-search/candidate-search.component';


@NgModule({
  declarations: [
    CandidatesComponent,
    CandidateManagementComponent,
    JobProfilesComponent,
    JobProfileManagementComponent,
    CandidateDetailsComponent,
    JobSkillsComponent,
    JobSkillManangementComponent,
    CandidateSearchComponent,
  ],
  imports: [
    CommonModule,
    HrRoutingModule,
    AngularMaterialModule,
    FormsModule,
    SharedComponentsModule,
    MatChipsModule
  ]
})
export class HrModule { }
