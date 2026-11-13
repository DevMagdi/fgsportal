import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsApprovalComponent } from './reports-approval.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReportsApprovalComponent', () => {
  let component: ReportsApprovalComponent;
  let fixture: ComponentFixture<ReportsApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ReportsApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
