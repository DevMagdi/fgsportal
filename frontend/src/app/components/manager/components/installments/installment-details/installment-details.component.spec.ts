import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentDetailsComponent } from './installment-details.component';

describe('InstallmentDetailsComponent', () => {
  let component: InstallmentDetailsComponent;
  let fixture: ComponentFixture<InstallmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
