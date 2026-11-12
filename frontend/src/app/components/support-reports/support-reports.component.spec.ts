import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportReportsComponent } from './support-reports.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SupportReportsComponent', () => {
  let component: SupportReportsComponent;
  let fixture: ComponentFixture<SupportReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ SupportReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
