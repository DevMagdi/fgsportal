import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Candidate, JobProfile } from 'src/app/interfaces/hr';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User, AccountRoles, Department } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { HrService } from 'src/app/services/hr.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-job-profiles',
  templateUrl: './job-profiles.component.html',
  styleUrls: ['./job-profiles.component.scss']
})
export class JobProfilesComponent implements OnInit {

  
  jobProfiles!: JobProfile[];
  selectedJobProfile: JobProfile;
  newServerApi = environment.newServerApi;
  currentUser: User = this._auth.currentUser;
  showJobProfileManagement = false;
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

  getAllJobProfiles() {
   
    this.loadingService.setLoading(true);

    this.hrService.getAllJobProfiles().subscribe({
      next: res => {
        this.loadingService.setLoading(false);

        if (res['status'] == ResStatus.CRUD) {
          this.jobProfiles = res['data'];
        } else if (res['status'] == ResStatus.Forbidden) {
          
          this._notify.openSnackbar(`Error, ${res['data']['message']}`, SnackBarState.Error);

          this._db.createSystemLogs(
            `${this.currentUser.username} Tried To Access jobProfiles Page At ${new Date().toLocaleString()}`,
            `${this.currentUser.key} Tried To Access jobProfiles Page At ${new Date().toLocaleString()}`,
            this.currentUser.key as string,
            this.currentUser.username,
            'Failed'
          ).subscribe(res => {
            this._notify.openSnackbar(`You Don't Have Permission To Access This Page`, SnackBarState.Warning, 10000)
            this.router.navigate(['/'])
          }, err => {
            this.router.navigate(['/'])
          })

        }else {
          this.jobProfiles = [];
        }

      }, error: err => {
        this.loadingService.setLoading(false);


        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error);
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while Accessing jobProfiles Page`,
          `${this.currentUser.key} Has Error while Accessing jobProfiles Page`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Failed'
        ).subscribe();

      }
    })
  }

  checkCurrentUserPermissions() {

    // || this.currentUser.department == Department.MANAGEMENT
    if (!!this.currentUser && (this.checkIfHasPerm(28))) {

      this.getAllJobProfiles();
    } else {

      this._db.createSystemLogs(
        `${this.currentUser.username} Tried To Access jobProfiles Page At ${new Date().toLocaleString()}`,
        `${this.currentUser.key} Tried To Access jobProfiles Page At ${new Date().toLocaleString()}`,
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

  openJobProfileManagement(jobProfile: JobProfile | 0) {
    this.showJobProfileManagement = true;
    this.selectedJobProfile = jobProfile as JobProfile;
  }


  updateJobProfileList(job_profile: JobProfile) {

    // let jobProfileIndex = this.jobProfiles.findIndex(x => x.id == job_profile.id);
    // if (jobProfileIndex != -1) {
    //   this.jobProfiles[jobProfileIndex] = job_profile;
    // } else {
    //   this.jobProfiles.push(job_profile);
    // }
    this.getAllJobProfiles()
    

    this.showJobProfileManagement = false;
  }

  deleteJobProfile(jobProfile: JobProfile) {
    this._notify.openDialog(
      'Delete Job Profile?',
      `Are you sure you want to delete This Job Profile?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.loadingService.setLoading(true);
          this.hrService.deleteJobProfile(jobProfile.id || '').subscribe({
            next: res => {
              if (res['status'] == ResStatus.CRUD) {

                this._notify.openSnackbar(`Job Profile Deleted Successfully`, SnackBarState.Success);
                this.jobProfiles = this.jobProfiles.filter(x => x.id != jobProfile.id);
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
