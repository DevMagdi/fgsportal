import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatesComponent } from './hiring-process/candidates/candidates.component';
import { JobProfilesComponent } from './hiring-process/job-profiles/job-profiles.component';
import { JobSkillsComponent } from './hiring-process/job-skills/job-skills.component';

const routes: Routes = [
  { path: '', redirectTo: 'hiring-process', pathMatch: 'full' },
  
  {
    path: 'hiring-process',
    children: [
      { path: '', redirectTo: 'candidates', pathMatch: 'full' },
      { path: 'candidates', component: CandidatesComponent },
      { path: 'job-profiles', component: JobProfilesComponent },
      { path: 'job-skills', component: JobSkillsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
