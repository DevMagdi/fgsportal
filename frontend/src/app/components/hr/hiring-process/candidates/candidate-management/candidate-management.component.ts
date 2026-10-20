import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Candidate, JobProfile, JobSkill } from 'src/app/interfaces/hr';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { HrService } from 'src/app/services/hr.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-management',
  templateUrl: './candidate-management.component.html',
  styleUrls: ['./candidate-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CandidateManagementComponent implements OnInit {

  currentUser: User = this._auth.currentUser;


  @Input() candidate: Candidate;
  @Output() updateCandidateList = new EventEmitter();
  selectedCandidate!:Candidate;

  jobProfiles: JobProfile[] = [];
  jobProfilesLoading = true;

  maxGraduatedYear = new Date().getFullYear() + 4;
  minGraduatedYear = new Date().getFullYear() - 40;

  newServerApi = environment.newServerApi;
  file: File;

  jobSkills: JobSkill[] = [];

  // separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedSkills: JobSkill[] = [];
  filteredSkills: Observable<JobSkill[]>;
  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  showCandidateDetails=false;

  candidateForm = new FormGroup({
    "first_name": new FormControl(null, Validators.required),
    "last_name": new FormControl(null, Validators.required),
    "email": new FormControl(null, [Validators.required, Validators.email]),
    "phone_number": new FormControl(null, Validators.required),
    "job_title_id": new FormControl(null, Validators.required),
    "job_skills_id": new FormControl(null, Validators.required),
    "file_name": new FormControl(null, Validators.required),
    "graduated_year": new FormControl(null,
      [Validators.required, Validators.max(this.maxGraduatedYear), Validators.min(this.minGraduatedYear)]),
    "experience": new FormControl(null, Validators.required),
    "address": new FormControl(null),
    "note": new FormControl(null),
  })

  constructor(
    private hrService: HrService,
    private _notify: NotificationService,
    private _auth: AuthApiService,
    private _db: DatabaseService,
    private loadingService: LoadingService
  ) {

    this.filteredSkills = this.candidateForm.get('job_skills_id')!.valueChanges.pipe(
      startWith(null),
      map(
        (skill_title: string | null) => {
          // this.selectedSkills = [...new Set(this.selectedSkills)];

          let setObj = new Map(
            this.selectedSkills.map((obj) => {
              return [JSON.stringify(obj), obj];
            })
          );
          this.selectedSkills = Array.from(setObj.values());

          return (skill_title ? this._filter(skill_title) : this.jobSkills)
        }
      ),
    );
  }

  ngOnInit(): void {
    this.getAllJobProfiles();

    if (this.candidate) {

      this.candidateForm.patchValue({
        ...this.candidate,
        job_title_id: this.candidate.Job_title.map(x => (x.job_title_id)),
        // job_skills_id: this.candidate?.job_skills_id?.map(x => (x.job_skill_id)),

      });

      this.selectedSkills=this.candidate.job_skills_id!.map(x=>{
        return {id:x.job_skill_id,job_skill:x.hr_job_title} as JobSkill;
      })


    }

    this.getAllSkills();
  }

  //main logic 
  onSubmit() {

    this.candidateForm.patchValue({
      job_skills_id: this.selectedSkills.map(x => (x.id))
    })
    this.candidateForm.markAllAsTouched();

    if (!!this.candidateForm.get('graduated_year')?.errors &&
      (!!this.candidateForm.get('graduated_year')?.errors!['min'] || !!this.candidateForm.get('graduated_year')?.errors!['max'])) {

      this.candidateForm.get('graduated_year')?.setErrors(
        { graduated_year_range: `Graduated Year range must be between ${this.minGraduatedYear} and ${this.maxGraduatedYear} ` });

    }

    if (this.candidateForm.invalid) return;


    if (this.candidate) {

      this.updateCandidate();
    } else {
      this.createCandidate();
    }

  }

  createCandidate() {
    const formData = new FormData();
    formData.append('job_title_id', `[${this.candidateForm.get('job_title_id')?.value}]`);
    formData.append('job_skills_id', `[${this.candidateForm.get('job_skills_id')?.value}]`);

    for (const key in this.candidateForm.value) {
      if (key != 'job_title_id' && key != 'job_skills_id') {

        formData.append(key, this.candidateForm.get(key)?.value);
      }

    }
    this.loadingService.setLoading(true);

    this.hrService.createCandidate(formData).subscribe({
      next: res => {
        if (res['status'] == ResStatus.CRUD) {

          this.updateCandidateList.emit(res['data']);
          this._notify.openSnackbar(`Candidate created successfully`, SnackBarState.Success);

        }
        this.loadingService.setLoading(false);


      }, error: err => {

        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error);
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Candidate At ${new Date().toLocaleString()}`,
          `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Create Candidate At ${new Date().toLocaleString()}`,
          this.currentUser.key as string,
          this.currentUser.username,
          'Failed'
        ).subscribe();
        this.loadingService.setLoading(false);


      }
    })

  }

  updateCandidate() {

    const formData = new FormData();
    formData.append('id', this.candidate.id);
    formData.append('job_title_id', `[${this.candidateForm.get('job_title_id')?.value}]`);
    formData.append('job_skills_id', `[${this.candidateForm.get('job_skills_id')?.value}]`);

    for (const key in this.candidateForm.value) {
      if (key != 'job_title_id' && key != 'job_skills_id') {
        if (this.candidate[key] != this.candidateForm.get(key)?.value) {
          formData.append(key, this.candidateForm.get(key)?.value);
        }
      }

    }

    this.loadingService.setLoading(true);

    this.hrService.updateCandidate(formData).subscribe({
      next: res => {
        if (res['status'] == ResStatus.CRUD) {

          this.updateCandidateList.emit(res['data']);
          this._notify.openSnackbar(`Candidate updated successfully`, SnackBarState.Success);

        }
        this.loadingService.setLoading(false);


      }, error: err => {

        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error);
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Update Candidate At ${new Date().toLocaleString()}`,
          `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Update Candidate At ${new Date().toLocaleString()}`,
          this.currentUser.key as string,
          this.currentUser.username,
          'Failed'
        ).subscribe();
        this.loadingService.setLoading(false);


      }
    })


  }

  uploadFile(event: any) {

    this.file = event.target.files[0];
    if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(this.file.type)) {

      this.candidateForm.get('file_name')?.setValue(this.file);

    } else {

      this._notify.openSnackbar(`please upload pdf or word file`, SnackBarState.Warning, 10000);
    }



  }

//existed candidate

  goToExistedCandidate(key: string) {

    let existCandidate = { [key]: this.candidateForm.get(key)?.value };
    this.loadingService.setLoading(true);
    this.hrService.GetCandidateDetailsDuplicate(existCandidate).subscribe({
      next: res => {

        if (res['status'] == ResStatus.CRUD) {

          // this.existCandidate.emit(res['data']);
          this.selectedCandidate=res['data'];
          this.showCandidateDetails=true;

        }
        this.loadingService.setLoading(false);

      }, error: err => {
        this.loadingService.setLoading(false);
        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error);
        this._db.createSystemLogs(
          `${this.currentUser.username} Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Get Candidate Details Duplicate of ${this.candidateForm.get(key)?.value} At ${new Date().toLocaleString()}`,
          `${this.currentUser.key}  Has Error ${JSON.stringify(err['error']['data'])} while
         trying To Get Candidate Details Duplicate of ${this.candidateForm.get(key)?.value} At ${new Date().toLocaleString()}`,
          this.currentUser.key as string,
          this.currentUser.username,
          'Failed'
        ).subscribe()


      }
    })

  }

  checkExistedCandidate(key: string) {

    let existCandidate = { [key]: this.candidateForm.get(key)?.value };
    if (!this.candidateForm.get(key)?.errors ) {
      if (!this.candidate || (this.candidate[key] != this.candidateForm.get(key)?.value)) {

        this.hrService.checkCandidateData(existCandidate).subscribe({
          next: res => {

            if (res['status'] == ResStatus.CRUD) {

            }

          }, error: err => {

            this.candidateForm.get(key)?.setErrors({ ...this.candidateForm.get(key)?.errors, 'exist': err['error']['data'][key] });

          }
        })
      }
    }
  }

  //job profile

  getAllJobProfiles() {
    this.jobProfilesLoading = true;
    this.hrService.getAllJobProfiles().subscribe({
      next: res => {
        this.jobProfilesLoading = false;
        if (res['status'] == ResStatus.CRUD) {
          this.jobProfiles = res['data'];
        } else {
          this.jobProfiles = [];
        }
        if (this.candidate) {

          this.candidateForm.patchValue({
            job_title_id: this.candidate.Job_title.map(x => (x.job_title_id)),

          });
        }
      }, error: err => {
        this.jobProfilesLoading = false;

      }
    })
  }

  onChangeJobTitle(selectedJobProfile: any) {
    let jobTitle = this.jobProfiles.find(x => x.id == selectedJobProfile.itemValue);

    let skills = jobTitle?.job_skills_id?.map(x => {
      return { id: x.job_skill_id, job_skill: x.hr_job_title }
    }) as JobSkill[];

    if (selectedJobProfile.value.includes(selectedJobProfile.itemValue)) {
      this.selectedSkills.push(...skills);
    } else {

      // const results = this.selectedSkills.filter(({ id: id1 }) => !skills.some(({ id: id2 }) => id2 === id1));

      this.selectedSkills = this.selectedSkills.filter(x => !skills.some(s => s.id === x.id));
    }


    let setObj = new Map(
      this.selectedSkills.map((obj) => {
        return [JSON.stringify(obj), obj];
      })
    );
    this.selectedSkills = Array.from(setObj.values());


  }


  //skills chips operations

  getAllSkills() {
    this.hrService.getAllJobSkills().subscribe({
      next: res => {

        if (res['status'] == ResStatus.CRUD) {
          this.jobSkills = res['data'];


        }

      }, error: err => {

      }
    })
  }

  addSkill(event: MatChipInputEvent): void {

    // const value = (event.value || '').trim();

    // // this.selectedSkills.push(value);
    // // if (this.jobSkills.find(x=>x.job_skill==value)) {
    // // }else{
    // //   this._notify.openSnackbar('there is no matches skills',SnackBarState.Error)
    // // }

    // event.chipInput!.clear();
    // this.candidateForm.get('job_skills_id')!.setValue(null);
  }

  removeSkill(index: number): void {
    // const index = this.selectedSkills.findIndex(x => x.id == skill_title.id);

    // if (index >= 0) {
      this.selectedSkills.splice(index, 1);
    // }
  }

  selectingSkill(event: MatAutocompleteSelectedEvent): void {
    let skill = this.jobSkills.find(x => x.job_skill == event.option.viewValue) as JobSkill;
    if (!this.selectedSkills.find(x=>x.id==skill.id)) {
      
      this.selectedSkills.push(skill);
    }
    this.skillInput.nativeElement.value = '';
    this.candidateForm.get('job_skills_id')!.setValue(null);
    // this.filteredSkills =of(this.jobSkills);
  }

  private _filter(skill: string): JobSkill[] {

    const filterValue = skill.toString().toLowerCase();
    return this.jobSkills.filter(skill => skill.job_skill?.toLowerCase()?.includes(filterValue)) || this.jobSkills;
  }

}
