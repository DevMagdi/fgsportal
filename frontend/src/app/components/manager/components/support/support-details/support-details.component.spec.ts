import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDetailsComponent } from './support-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SupportDetailsComponent', () => {
  let component: SupportDetailsComponent;
  let fixture: ComponentFixture<SupportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ SupportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
