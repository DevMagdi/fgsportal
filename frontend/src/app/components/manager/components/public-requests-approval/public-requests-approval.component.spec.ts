import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicRequestsApprovalComponent } from './public-requests-approval.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PublicRequestsApprovalComponent', () => {
  let component: PublicRequestsApprovalComponent;
  let fixture: ComponentFixture<PublicRequestsApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ PublicRequestsApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicRequestsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
