import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVacationsComponent } from './admin-vacations.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminVacationsComponent', () => {
  let component: AdminVacationsComponent;
  let fixture: ComponentFixture<AdminVacationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ AdminVacationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVacationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
