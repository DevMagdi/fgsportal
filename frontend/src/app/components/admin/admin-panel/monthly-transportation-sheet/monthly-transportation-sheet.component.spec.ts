import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyTransportationSheetComponent } from './monthly-transportation-sheet.component';

describe('MonthlyTransportationSheetComponent', () => {
  let component: MonthlyTransportationSheetComponent;
  let fixture: ComponentFixture<MonthlyTransportationSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyTransportationSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyTransportationSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
