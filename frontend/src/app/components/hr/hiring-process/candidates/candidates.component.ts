import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { Candidate, CandidateFilter } from 'src/app/interfaces/hr';
import { ResStatus } from 'src/app/interfaces/res-status';
import { HrService } from 'src/app/services/hr.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit {

  isLoading = false;
  candidates!: Candidate[];
  selectedCandidate: Candidate;
  newServerApi = environment.newServerApi;
  currentUser: User = this._auth.currentUser;
  showCandidateManagement = false;
  showCandidateDetails = false;
  userPerms = this._auth.userPerms;
  showSearchDialog = false;
  filterObj!: CandidateFilter;
  resetFilter = false;

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

  getAllRecruitmentRequests(filterObj) {
   
    this.loadingService.setLoading(true);

    this.hrService.getAllRecruitmentRequests(filterObj).subscribe({
      next: res => {
       
    this.loadingService.setLoading(false);

        if (res['status'] == ResStatus.CRUD) {
          this.candidates = res['data'];

          filterObj&& Object.keys(filterObj!)?.length>0 ? this.resetFilter=true : this.resetFilter=false;

        } else if (res['status'] == ResStatus.Forbidden) {

          this._notify.openSnackbar(`Error, ${res['data']['message']}`, SnackBarState.Error);

          this._db.createSystemLogs(
            `${this.currentUser.username} Tried To Access candidates Page At ${new Date().toLocaleString()}`,
            `${this.currentUser.key} Tried To Access candidates Page At ${new Date().toLocaleString()}`,
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
          this.candidates = [];
        }

      }, error: err => {
        this.isLoading = false;
        this.loadingService.setLoading(false);

        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error)
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while Accessing Candidates Page`,
          `${this.currentUser.key} Has Error while Accessing Candidates Page`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Failed'
        ).subscribe()

      }
    })
  }

  checkCurrentUserPermissions() {

    if (!!this.currentUser && this.checkIfHasPerm(34)) {

      this.getAllRecruitmentRequests(this.filterObj);
    } else {

      this._db.createSystemLogs(
        `${this.currentUser.username} Tried To Access Candidates Page At ${new Date().toLocaleString()}`,
        `${this.currentUser.key} Tried To Access Candidates Page At ${new Date().toLocaleString()}`,
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

  openCandidateManagement(candidate: Candidate | 0) {
    this.showCandidateManagement = true;
    this.selectedCandidate = candidate as Candidate;
  }

  openCandidateDetails(candidate: Candidate | 0) {
    this.showCandidateDetails = true;
    this.selectedCandidate = candidate as Candidate;
  }
  deleteCandidate(candidate: Candidate) {
    this._notify.openDialog(
      'Delete Candidate?',
      `Are you sure you want to delete This Candidate?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {

          this.loadingService.setLoading(true);
          this.hrService.deleteCandidate(candidate.id || '').subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {

              this._notify.openSnackbar(`Candidate Deleted Successfully`, SnackBarState.Success);
              this.candidates = this.candidates.filter(x => x.id != candidate.id);
            }
          this.loadingService.setLoading(false);

          },error=>{

            this.loadingService.setLoading(false);

          }
        )

        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }

  updateCandidateList(candidate: Candidate) {

    let candidateIndex = this.candidates.findIndex(x => x.id == candidate.id);
    if (candidateIndex != -1) {
      this.candidates[candidateIndex] = candidate;
    } else {
      this.candidates.push(candidate);
    }

    this.showCandidateManagement = false;
  }

  // existedCandidate(candidate: Candidate){
  //   this.showCandidateManagement=false;
  //   this.showCandidateDetails=true;
  //   this.selectedCandidate = candidate as Candidate;

  // }
  checkIfHasPerm(perm_id) {

    const checking = this.userPerms.find(p => p.permission_id == perm_id)
    if (!!checking) {
      return true;
    } else {
      return false;
    }
  }
  onFilterCandidates(filterObj: CandidateFilter) {
    this.showSearchDialog = false;
    for (const key in filterObj) {
      const element = filterObj[key];
      if (!element) {
        delete filterObj[key]
      }

    }

    this.filterObj = filterObj;
    this.getAllRecruitmentRequests(filterObj);

  }

  onResetFilter() {

    for (const key in this.filterObj) {
      delete this.filterObj[key]

    }

    this.getAllRecruitmentRequests(this.filterObj);

  }
}
