import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingReportsComponent } from './pending-reports.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PendingReportsComponent', () => {
  let component: PendingReportsComponent;
  let fixture: ComponentFixture<PendingReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ PendingReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
