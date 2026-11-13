import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationDetailsComponent } from './organization-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrganizationDetailsComponent', () => {
  let component: OrganizationDetailsComponent;
  let fixture: ComponentFixture<OrganizationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ OrganizationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
