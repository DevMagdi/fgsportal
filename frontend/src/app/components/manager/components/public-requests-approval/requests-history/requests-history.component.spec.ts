import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsHistoryComponent } from './requests-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RequestsHistoryComponent', () => {
  let component: RequestsHistoryComponent;
  let fixture: ComponentFixture<RequestsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ RequestsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
