import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableDevComponent } from './available-dev.component';

describe('AvailableDevComponent', () => {
  let component: AvailableDevComponent;
  let fixture: ComponentFixture<AvailableDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
