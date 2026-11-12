import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveComponent } from './incentive.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IncentiveComponent', () => {
  let component: IncentiveComponent;
  let fixture: ComponentFixture<IncentiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ IncentiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
