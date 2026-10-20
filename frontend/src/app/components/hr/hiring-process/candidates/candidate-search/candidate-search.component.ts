import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Candidate, CandidateFilter, JobProfile, JobSkill } from 'src/app/interfaces/hr';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { HrService } from 'src/app/services/hr.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-candidate-search',
  templateUrl: './candidate-search.component.html',
  styleUrls: ['./candidate-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CandidateSearchComponent implements OnInit {


  jobProfiles: JobProfile[] = [];
  jobProfilesLoading = true;

  jobSkills: JobSkill[] = [];
  jobSkillsLoading = true;


  maxGraduatedYear = new Date().getFullYear() + 4;
  minGraduatedYear = new Date().getFullYear() - 40;

  resetFilter=false;


  @Input() filterObj!: CandidateFilter;
  @Output() onFilterCandidates = new EventEmitter<CandidateFilter>()

  candidateForm = new FormGroup({
    "first_name": new FormControl(null,),
    "last_name": new FormControl(null,),
    "email": new FormControl(null),
    "phone_number": new FormControl(null,),
    "job_title_id": new FormControl(null,),
    "job_skills_id": new FormControl(null,),
    "graduated_year": new FormControl(null, [Validators.max(this.maxGraduatedYear), Validators.min(this.minGraduatedYear)]),
    "experience": new FormControl(null,),

  })

  constructor(
    private hrService: HrService,
    private _notify: NotificationService,
    private _auth: AuthApiService,
    private _db: DatabaseService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.getAllJobProfiles();
    this.getAllJobSkills();
    if (this.filterObj) {  
      for (const key in this.filterObj) {
        if (this.filterObj.hasOwnProperty(key)) {
          this.resetFilter=true;          
      }
        
      }    
            
        let skillsArray= this.filterObj!.job_skills_id ? JSON.parse( this.filterObj!.job_skills_id) : null;
        this.candidateForm.patchValue({...this.filterObj,
          job_skills_id: skillsArray ? skillsArray.map(x=>x.toString()) : null,
          
          job_title_id:this.filterObj.job_title_id ? JSON.parse(this.filterObj.job_title_id) : null,
        })
        
      
      
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

      }, error: err => {
        this.jobSkillsLoading = false;

      }
    })
  }
  getAllJobSkills() {
    this.jobSkillsLoading = true;
    this.hrService.getAllJobSkills().subscribe({
      next: res => {
        this.jobSkillsLoading = false;
        if (res['status'] == ResStatus.CRUD) {
          this.jobSkills = res['data'];
         
        } else {
          this.jobSkills = [];
        }

      }, error: err => {
        this.jobSkillsLoading = false;

      }
    })
  }
  
  filterCandidates() {

    let candidateObj = this.candidateForm.value;

    for (const key in candidateObj) {
      if (Object.prototype.hasOwnProperty.call(candidateObj, key)) {
        const element = candidateObj[key];
        if (!element) {
          delete candidateObj[key]
        }
        
        
      }
    }
    candidateObj.job_title_id? candidateObj.job_title_id = `[${candidateObj.job_title_id.toString()}]` : null;
    candidateObj.job_skills_id ? candidateObj.job_skills_id = `[${candidateObj.job_skills_id}]` : null;

    this.onFilterCandidates.emit(candidateObj);

  }
}
