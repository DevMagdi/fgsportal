import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowClientTicketDetailsComponent } from './follow-client-ticket-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FollowClientTicketDetailsComponent', () => {
  let component: FollowClientTicketDetailsComponent;
  let fixture: ComponentFixture<FollowClientTicketDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ FollowClientTicketDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowClientTicketDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
