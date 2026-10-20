import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardRateFormComponent } from './standard-rate-form.component';

describe('StandardRateFormComponent', () => {
  let component: StandardRateFormComponent;
  let fixture: ComponentFixture<StandardRateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardRateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardRateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
