import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevReportsComponent } from './dev-reports.component';

describe('DevReportsComponent', () => {
  let component: DevReportsComponent;
  let fixture: ComponentFixture<DevReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
