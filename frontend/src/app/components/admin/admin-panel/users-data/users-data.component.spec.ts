import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDataComponent } from './users-data.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UsersDataComponent', () => {
  let component: UsersDataComponent;
  let fixture: ComponentFixture<UsersDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ UsersDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
