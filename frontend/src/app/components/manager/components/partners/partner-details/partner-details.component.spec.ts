import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDetailsComponent } from './partner-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PartnerDetailsComponent', () => {
  let component: PartnerDetailsComponent;
  let fixture: ComponentFixture<PartnerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ PartnerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
