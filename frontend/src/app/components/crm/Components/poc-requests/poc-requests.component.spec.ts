import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocRequestsComponent } from './poc-requests.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PocRequestsComponent', () => {
  let component: PocRequestsComponent;
  let fixture: ComponentFixture<PocRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ PocRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PocRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
