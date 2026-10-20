import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { JobSkill } from 'src/app/interfaces/hr';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User, AccountRoles, Department } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { HrService } from 'src/app/services/hr.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-job-skills',
  templateUrl: './job-skills.component.html',
  styleUrls: ['./job-skills.component.scss']
})
export class JobSkillsComponent implements OnInit {

 
  jobSkills!: JobSkill[];
  selectedJobSkill: JobSkill;
  newServerApi = environment.newServerApi;
  currentUser: User = this._auth.currentUser;
  showJobSkillManagement = false;
  userPerms=this._auth.userPerms;

  constructor(
    private hrService: HrService,
    private _notify: NotificationService,
    private _auth: AuthApiService,
    private _db: DatabaseService,
    private router: Router,
    private loadingService:LoadingService

  ) { }

  ngOnInit(): void {
    this.checkCurrentUserPermissions();

  }

  getAllJobSkills() {
   
    this.loadingService.setLoading(true);

    this.hrService.getAllJobSkills().subscribe({
      next: res => {
        this.loadingService.setLoading(false);

        if (res['status'] == ResStatus.CRUD) {
          this.jobSkills = res['data'];


        } else if (res['status'] == ResStatus.Forbidden) {
          
          this._db.createSystemLogs(
            `${this.currentUser.username} Tried To Access JobSkills Page At ${new Date().toLocaleString()}`,
            `${this.currentUser.key} Tried To Access JobSkills Page At ${new Date().toLocaleString()}`,
            this.currentUser.key as string,
            this.currentUser.username,
            'Failed'
          ).subscribe(res => {
            this._notify.openSnackbar(`You Don't Have Permission To Access This Page`, SnackBarState.Warning, 10000)
            this.router.navigate(['/'])
          }, err => {
            this.router.navigate(['/'])
          })

        } else {
          this.jobSkills = [];
        }

      }, error: err => {
        this.loadingService.setLoading(false);


        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error);
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while Accessing JobSkills Page`,
          `${this.currentUser.key} Has Error while Accessing JobSkills Page`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Failed'
        ).subscribe();

      }
    })
  }

  checkCurrentUserPermissions() {

    if (!!this.currentUser && this.checkIfHasPerm(31)) {

      this.getAllJobSkills();
    } else {

      this._db.createSystemLogs(
        `${this.currentUser.username} Tried To Access JobSkills Page At ${new Date().toLocaleString()}`,
        `${this.currentUser.key} Tried To Access JobSkills Page At ${new Date().toLocaleString()}`,
        this.currentUser.key as string,
        this.currentUser.username,
        'Failed'
      ).subscribe(res => {
        this._notify.openSnackbar(`You Don't Have Permission To Access This Page`, SnackBarState.Warning, 10000)
        this.router.navigate(['/'])
      }, err => {
        this.router.navigate(['/'])
      })
    }

  }

  openJobSkillManagement(jobSkill: JobSkill | 0) {
    this.showJobSkillManagement = true;
    this.selectedJobSkill = jobSkill as JobSkill;
  }


  updateJobSkillList(job_Skill: any) {

    // let jobSkillIndex = this.JobSkills.findIndex(x => x.id == job_Skill.id);
    // if (jobSkillIndex != -1) {
    //   this.JobSkills[jobSkillIndex] = job_Skill;
    // } else {
    //   this.JobSkills.push(job_Skill);
    // }
    this.getAllJobSkills()
    

    this.showJobSkillManagement = false;
  }

  deleteJobSkill(jobSkill: JobSkill) {
    this._notify.openDialog(
      'Delete Job Skill?',
      `Are you sure you want to delete This Job Skill?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.loadingService.setLoading(true);
          this.hrService.deleteJobSkill(jobSkill.id.toString()).subscribe({
            next: res => {
              if (res['status'] == ResStatus.CRUD) {

                this._notify.openSnackbar(`Job Skill Deleted Successfully`, SnackBarState.Success);
                this.jobSkills = this.jobSkills.filter(x => x.id != jobSkill.id);
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
          }
          )
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }

  checkIfHasPerm(perm_id){
    
    const checking = this.userPerms.find(p=>p.permission_id == perm_id)
    if(!!checking){
      return true;
    }else{
      return false;
    }
  }
}
