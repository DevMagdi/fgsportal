import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowClientTicketsComponent } from './follow-client-tickets.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FollowClientTicketsComponent', () => {
  let component: FollowClientTicketsComponent;
  let fixture: ComponentFixture<FollowClientTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ FollowClientTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowClientTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
