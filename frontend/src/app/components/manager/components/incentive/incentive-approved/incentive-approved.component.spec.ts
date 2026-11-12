import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveApprovedComponent } from './incentive-approved.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IncentiveApprovedComponent', () => {
  let component: IncentiveApprovedComponent;
  let fixture: ComponentFixture<IncentiveApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ IncentiveApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
