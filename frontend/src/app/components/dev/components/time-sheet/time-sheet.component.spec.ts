import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetComponent } from './time-sheet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TimeSheetComponent', () => {
  let component: TimeSheetComponent;
  let fixture: ComponentFixture<TimeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ TimeSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
