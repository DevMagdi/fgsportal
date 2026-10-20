import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamadanConfigComponent } from './ramadan-config.component';

describe('RamadanConfigComponent', () => {
  let component: RamadanConfigComponent;
  let fixture: ComponentFixture<RamadanConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RamadanConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RamadanConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
