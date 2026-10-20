import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicUsersPageComponent } from './public-users-page.component';

describe('PublicUsersPageComponent', () => {
  let component: PublicUsersPageComponent;
  let fixture: ComponentFixture<PublicUsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicUsersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
