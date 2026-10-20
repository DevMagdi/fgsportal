import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowClientTicketsComponent } from './follow-client-tickets.component';

describe('FollowClientTicketsComponent', () => {
  let component: FollowClientTicketsComponent;
  let fixture: ComponentFixture<FollowClientTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
