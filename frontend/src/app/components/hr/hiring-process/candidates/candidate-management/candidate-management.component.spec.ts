import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { HrService } from 'src/app/services/hr.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CandidateManagementComponent } from './candidate-management.component';

describe('CandidateManagementComponent', () => {
  let component: CandidateManagementComponent;
  let fixture: ComponentFixture<CandidateManagementComponent>;
  let getAllJobProfiles: jasmine.Spy;
  let getAllJobSkills: jasmine.Spy;

  beforeEach(async () => {
    getAllJobProfiles = jasmine.createSpy('getAllJobProfiles').and.returnValue(
      of({ status: ResStatus.Success_But_Empty, data: [] })
    );
    getAllJobSkills = jasmine.createSpy('getAllJobSkills').and.returnValue(
      of({ status: ResStatus.Success_But_Empty, data: [] })
    );
    await TestBed.configureTestingModule({
      imports: [AngularMaterialModule, FormsModule, MatChipsModule, NoopAnimationsModule, RouterTestingModule],
      declarations: [CandidateManagementComponent],
      providers: [
        { provide: HrService, useValue: { getAllJobProfiles, getAllJobSkills } },
        { provide: AuthApiService, useValue: { currentUser: {} } },
        { provide: DatabaseService, useValue: {} },
        { provide: NotificationService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates and loads the empty job-profile and skill catalogues', () => {
    expect(component).toBeTruthy();
    expect(getAllJobProfiles).toHaveBeenCalledTimes(1);
    expect(getAllJobSkills).toHaveBeenCalledTimes(1);
    expect(component.jobProfiles).toEqual([]);
    expect(component.jobSkills).toEqual([]);
  });
});
