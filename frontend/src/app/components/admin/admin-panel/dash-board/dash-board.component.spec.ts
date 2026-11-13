import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashBoardComponent } from './dash-board.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashBoardComponent', () => {
  let component: DashBoardComponent;
  let fixture: ComponentFixture<DashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ DashBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
