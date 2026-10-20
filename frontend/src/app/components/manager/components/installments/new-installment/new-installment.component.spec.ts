import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInstallmentComponent } from './new-installment.component';

describe('NewInstallmentComponent', () => {
  let component: NewInstallmentComponent;
  let fixture: ComponentFixture<NewInstallmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewInstallmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInstallmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
