import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalTimeSheetComponent } from './global-time-sheet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GlobalTimeSheetComponent', () => {
  let component: GlobalTimeSheetComponent;
  let fixture: ComponentFixture<GlobalTimeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ GlobalTimeSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
