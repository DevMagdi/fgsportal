import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsCenterComponent } from './accounts-center.component';
import { AccordionModule } from 'primeng/accordion';

describe('AccountsCenterComponent', () => {
  let component: AccountsCenterComponent;
  let fixture: ComponentFixture<AccountsCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionModule],
      declarations: [ AccountsCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
