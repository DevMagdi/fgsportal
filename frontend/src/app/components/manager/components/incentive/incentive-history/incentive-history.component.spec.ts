import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveHistoryComponent } from './incentive-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IncentiveHistoryComponent', () => {
  let component: IncentiveHistoryComponent;
  let fixture: ComponentFixture<IncentiveHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ IncentiveHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
