import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTransportationsComponent } from './pending-transportations.component';

describe('PendingTransportationsComponent', () => {
  let component: PendingTransportationsComponent;
  let fixture: ComponentFixture<PendingTransportationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingTransportationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingTransportationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
