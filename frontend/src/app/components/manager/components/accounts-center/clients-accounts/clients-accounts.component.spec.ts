import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsAccountsComponent } from './clients-accounts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ClientsAccountsComponent', () => {
  let component: ClientsAccountsComponent;
  let fixture: ComponentFixture<ClientsAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ClientsAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
