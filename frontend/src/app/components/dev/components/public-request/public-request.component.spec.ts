import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicRequestComponent } from './public-request.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PublicRequestComponent', () => {
  let component: PublicRequestComponent;
  let fixture: ComponentFixture<PublicRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
