import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'primeng/accordion';
import { AccountsCenterComponent } from './accounts-center.component';

@Component({ selector: 'app-clients-accounts', template: '' })
class ClientsAccountsStubComponent {}

describe('AccountsCenterComponent', () => {
  let component: AccountsCenterComponent;
  let fixture: ComponentFixture<AccountsCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionModule, NoopAnimationsModule],
      declarations: [AccountsCenterComponent, ClientsAccountsStubComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the accordion and its client-account content slot', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('p-accordion')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-clients-accounts')).toBeTruthy();
  });
});
