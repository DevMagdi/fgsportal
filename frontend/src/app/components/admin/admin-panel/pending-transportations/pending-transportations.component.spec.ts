import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTransportationsComponent } from './pending-transportations.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PendingTransportationsComponent', () => {
  let component: PendingTransportationsComponent;
  let fixture: ComponentFixture<PendingTransportationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
