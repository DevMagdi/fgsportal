import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionsComponent } from './user-permissions.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccordionModule } from 'primeng/accordion';

describe('UserPermissionsComponent', () => {
  let component: UserPermissionsComponent;
  let fixture: ComponentFixture<UserPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionModule, HttpClientTestingModule],
      declarations: [ UserPermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
