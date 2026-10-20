import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicRequestComponent } from './public-request.component';

describe('PublicRequestComponent', () => {
  let component: PublicRequestComponent;
  let fixture: ComponentFixture<PublicRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
