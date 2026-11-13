import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenToWorkComponent } from './open-to-work.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OpenToWorkComponent', () => {
  let component: OpenToWorkComponent;
  let fixture: ComponentFixture<OpenToWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ OpenToWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenToWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
