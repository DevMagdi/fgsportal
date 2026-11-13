import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityComponent } from './opportunity.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OpportunityComponent', () => {
  let component: OpportunityComponent;
  let fixture: ComponentFixture<OpportunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ OpportunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
