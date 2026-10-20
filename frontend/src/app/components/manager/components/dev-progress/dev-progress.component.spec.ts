import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevProgressComponent } from './dev-progress.component';

describe('DevProgressComponent', () => {
  let component: DevProgressComponent;
  let fixture: ComponentFixture<DevProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
