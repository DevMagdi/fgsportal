import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLogsComponent } from './system-logs.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SystemLogsComponent', () => {
  let component: SystemLogsComponent;
  let fixture: ComponentFixture<SystemLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ SystemLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
