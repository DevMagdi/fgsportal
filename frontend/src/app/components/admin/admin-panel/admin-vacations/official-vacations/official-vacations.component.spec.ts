import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialVacationsComponent } from './official-vacations.component';

describe('OfficialVacationsComponent', () => {
  let component: OfficialVacationsComponent;
  let fixture: ComponentFixture<OfficialVacationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
