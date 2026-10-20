import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportaionsComponent } from './transportaions.component';

describe('TransportaionsComponent', () => {
  let component: TransportaionsComponent;
  let fixture: ComponentFixture<TransportaionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportaionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportaionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
