import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedLeadsComponent } from './closed-leads.component';

describe('ClosedLeadsComponent', () => {
  let component: ClosedLeadsComponent;
  let fixture: ComponentFixture<ClosedLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedLeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
