import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdminTasksComponent } from './manage-admin-tasks.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManageAdminTasksComponent', () => {
  let component: ManageAdminTasksComponent;
  let fixture: ComponentFixture<ManageAdminTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ManageAdminTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdminTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
