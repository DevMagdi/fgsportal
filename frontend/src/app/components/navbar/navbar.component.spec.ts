import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireDatabase } from '@angular/fire/database';

import { NavbarComponent } from './navbar.component';
import { NotificationService } from 'src/app/services/notification.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { DatabaseService } from 'src/app/services/database.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [NavbarComponent],
      providers: [
        { provide: AngularFireDatabase, useValue: { list: () => ({}), object: () => ({}) } },
        { provide: NotificationService, useValue: { openSnackbar: () => {} } },
        { provide: MessagingService, useValue: {} },
        { provide: DatabaseService, useValue: { gettime: () => ({}) } },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes module entitlement checks for the menu', () => {
    expect(component.isModuleEnabled('core')).toBeTrue();
    expect(component.isModuleEnabled('crm')).toBeFalse();
  });
});
