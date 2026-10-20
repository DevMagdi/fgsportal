import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateMyEmpsComponent } from './rate-my-emps.component';

describe('RateMyEmpsComponent', () => {
  let component: RateMyEmpsComponent;
  let fixture: ComponentFixture<RateMyEmpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateMyEmpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateMyEmpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
