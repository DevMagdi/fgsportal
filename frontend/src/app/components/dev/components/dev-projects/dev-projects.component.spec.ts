import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevProjectsComponent } from './dev-projects.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DevProjectsComponent', () => {
  let component: DevProjectsComponent;
  let fixture: ComponentFixture<DevProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ DevProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
