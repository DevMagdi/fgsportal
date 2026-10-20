import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInstallmentsComponent } from './all-installments.component';

describe('AllInstallmentsComponent', () => {
  let component: AllInstallmentsComponent;
  let fixture: ComponentFixture<AllInstallmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllInstallmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllInstallmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
