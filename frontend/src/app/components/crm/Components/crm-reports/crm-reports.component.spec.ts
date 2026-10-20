import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmReportsComponent } from './crm-reports.component';

describe('CrmReportsComponent', () => {
  let component: CrmReportsComponent;
  let fixture: ComponentFixture<CrmReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
