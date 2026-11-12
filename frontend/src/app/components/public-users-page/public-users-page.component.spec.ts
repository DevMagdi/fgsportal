import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicUsersPageComponent } from './public-users-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PublicUsersPageComponent', () => {
  let component: PublicUsersPageComponent;
  let fixture: ComponentFixture<PublicUsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
