import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialVacationsComponent } from './official-vacations.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('OfficialVacationsComponent', () => {
  let component: OfficialVacationsComponent;
  let fixture: ComponentFixture<OfficialVacationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [ OfficialVacationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficialVacationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
