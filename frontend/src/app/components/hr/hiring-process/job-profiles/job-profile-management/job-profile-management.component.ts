import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { JobProfile, JobProfileSkill, JobProfileStatus, JobSkill } from 'src/app/interfaces/hr';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { HrService } from 'src/app/services/hr.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-job-profile-management',
  templateUrl: './job-profile-management.component.html',
  styleUrls: ['./job-profile-management.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class JobProfileManagementComponent implements OnInit {

  currentUser: User = this._auth.currentUser;

  JobProfileStatus=JobProfileStatus;
  jobSkills:JobSkill[];
  jobSkillsLoading=false;

  @Input() jobProfile: JobProfile;
  @Output() updateJobProfileList = new EventEmitter();
  
  addSkillDialog=false;
  jobProfileForm = new FormGroup({
    "hr_job_title": new FormControl(null, Validators.required),
    "description": new FormControl(null, Validators.required),
    "job_status": new FormControl(this.JobProfileStatus.ACTIVE, Validators.required),
    "job_skills_id": new FormControl(null, Validators.required),
    

  })
  constructor(
    private hrService: HrService,
    private _notify: NotificationService,
    private _auth: AuthApiService,
    private _db: DatabaseService,
    private loadingService:LoadingService

  ) { }

  ngOnInit(): void {
    this.getAllJobSkills();
    if (this.jobProfile) {
        
        this.jobProfileForm.patchValue({
         
          hr_job_title:this.jobProfile.hr_job_title,
          description:this.jobProfile.description,
          job_status:Number(this.jobProfile.job_status).toString(),
          
        });
      
    }
  }

  onSubmit() {
    
    this.jobProfileForm.markAllAsTouched();
    if (this.jobProfileForm.invalid) return;

    if (this.jobProfile) {

      this.updateJobProfile();
    } else {
      this.createJobProfile();
    }

  }

  createJobProfile() {
  
    this.loadingService.setLoading(true);

    let jobProfile:any = {
      hr_job_title: this.jobProfileForm.get('hr_job_title')?.value,
      description: this.jobProfileForm.get('description')?.value,
      job_status: this.jobProfileForm.get('job_status')?.value,
      job_skills_id:`[${(this.jobProfileForm.get('job_skills_id')?.value).toString()}]`
    }

    this.hrService.createJobProfile(jobProfile).subscribe({
      next: res => {

        if (res['status'] == ResStatus.CRUD) {

          this.updateJobProfileList.emit(res['data']);
          this._notify.openSnackbar(`job Profile created successfully`, SnackBarState.Success);

        }

    this.loadingService.setLoading(false);

      }, error: err => {

        this.loadingService.setLoading(false);

        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error);
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Job Profile At ${new Date().toLocaleString()}`,
          `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Job Profile At ${new Date().toLocaleString()}`,
          this.currentUser.key as string,
          this.currentUser.username,
          'Failed'
        ).subscribe()

      }
    })

  }
  updateJobProfile() {

    let jobProfile:any = {
      id: this.jobProfile.id,
      description: this.jobProfileForm.get('description')?.value,
      job_status: this.jobProfileForm.get('job_status')?.value,
      job_skills_id:`[${(this.jobProfileForm.get('job_skills_id')?.value).toString()}]`
    }
    // this.jobProfileForm.patchValue({
    //   job_skills_id:`[${(this.jobProfileForm.get('job_skills_id')?.value as Array<any>).toString()}]`
    // })

    if (this.jobProfile.hr_job_title !== this.jobProfileForm.get('hr_job_title')?.value) {
      jobProfile.hr_job_title= this.jobProfileForm.get('hr_job_title')?.value
    }

    this.loadingService.setLoading(true);


    this.hrService.updateJobProfile(jobProfile).subscribe({
      next: res => {

        if (res['status'] == ResStatus.CRUD) {

          this.updateJobProfileList.emit(res['data']);
          this._notify.openSnackbar(`job Profile updated successfully`, SnackBarState.Success);

        }

        this.loadingService.setLoading(false);


      }, error: err => {

        this.loadingService.setLoading(false);

        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error);

        this._db.createSystemLogs(
          `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To delete Job Profile with id ${jobProfile.id} At ${new Date().toLocaleString()}`,
          `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To delete Job Profile with id ${jobProfile.id} At ${new Date().toLocaleString()}`,
          this.currentUser.key as string,
          this.currentUser.username,
          'Failed'
        ).subscribe()

      }
    })

  }

  getAllJobSkills(){
    this.jobSkillsLoading = true;
    this.hrService.getAllJobSkills().subscribe({
      next: res => {
       
        this.jobSkillsLoading = false;
        if (res['status'] == ResStatus.CRUD) {
          this.jobSkills = res['data'];
        } else {
          this.jobSkills = [];
        }
        this.jobProfileForm.patchValue({
          job_skills_id:this.jobProfile.job_skills_id?.map(x=>(x.job_skill_id).toString())
          
        });
      }, error: err => {
      

      }
    })
  }

  updateJobSkillList(jobSkill:JobSkill){

    this.jobSkills.push(jobSkill);
    this.addSkillDialog=false;
    this.jobProfileForm.patchValue({
      job_skills_id:[...this.jobProfileForm.get('job_skills_id')?.value || [] as Array<string>,jobSkill.id] as string[]
    })
  
  }
}


