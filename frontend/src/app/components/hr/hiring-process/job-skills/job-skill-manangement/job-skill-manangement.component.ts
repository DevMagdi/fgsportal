import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { JobSkill } from 'src/app/interfaces/hr';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { HrService } from 'src/app/services/hr.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-job-skill-manangement',
  templateUrl: './job-skill-manangement.component.html',
  styleUrls: ['./job-skill-manangement.component.scss']
})
export class JobSkillManangementComponent implements OnInit {

 
  currentUser: User = this._auth.currentUser;

 
  jobSkills:JobSkill[];
  jobSkillsLoading=false;

  @Input() jobSkill: JobSkill;
  @Input() inJobProfileComponent=false;
  @Output() updateJobSkillList = new EventEmitter();
  
  jobSkillForm = new FormGroup({
    "job_skill": new FormControl(null, Validators.required),

  })
  
  constructor(
    private hrService: HrService,
    private _notify: NotificationService,
    private _auth: AuthApiService,
    private _db: DatabaseService,
    private loadingService:LoadingService

  ) { }

  ngOnInit(): void {
 
    if (this.jobSkill) {
        
        this.jobSkillForm.patchValue(this.jobSkill);
      
    }
  }

  onSubmit() {
    
    if (this.jobSkillForm.invalid) return;

    if (this.jobSkill) {

      this.updateJobSkill();
    } else {
      this.createJobSkill();
    }

  }

  createJobSkill() {
  
    this.loadingService.setLoading(true);

    this.hrService.createJobSkill(this.jobSkillForm.value).subscribe({
      next: res => {

        if (res['status'] == ResStatus.CRUD) {

          this.updateJobSkillList.emit(res['data']);
          this._notify.openSnackbar(`job Skill created successfully`, SnackBarState.Success);

        }

    this.loadingService.setLoading(false);

      }, error: err => {

        this.loadingService.setLoading(false);

        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error);
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Job Skill At ${new Date().toLocaleString()}`,
          `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Job Skill At ${new Date().toLocaleString()}`,
          this.currentUser.key as string,
          this.currentUser.username,
          'Failed'
        ).subscribe()

      }
    })

  }
  updateJobSkill() {

    let jobSkill:JobSkill = {
      id: this.jobSkill.id,
    }

    if (this.jobSkill.job_skill !== this.jobSkillForm.get('job_skill')?.value) {
      jobSkill.job_skill= this.jobSkillForm.get('job_skill')?.value
      this.loadingService.setLoading(true);
  
      this.hrService.updateJobSkill(jobSkill).subscribe({
        next: res => {
  
          if (res['status'] == ResStatus.CRUD) {
  
            this.updateJobSkillList.emit(res['data']);
            this._notify.openSnackbar(`job Skill updated successfully`, SnackBarState.Success);
  
          }
  
          this.loadingService.setLoading(false);
  
  
        }, error: err => {
  
          this.loadingService.setLoading(false);
  
          this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error);
  
          this._db.createSystemLogs(
            `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
           trying To delete Job Skill with id ${jobSkill.id} At ${new Date().toLocaleString()}`,
            `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
           trying To delete Job Skill with id ${jobSkill.id} At ${new Date().toLocaleString()}`,
            this.currentUser.key as string,
            this.currentUser.username,
            'Failed'
          ).subscribe()
  
        }
      })
    }else{
      this._notify.openSnackbar(`No changes made`, SnackBarState.Info);
       
    }


  }


}



