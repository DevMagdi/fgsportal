import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverDueTasksComponent } from './over-due-tasks.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OverDueTasksComponent', () => {
  let component: OverDueTasksComponent;
  let fixture: ComponentFixture<OverDueTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ OverDueTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverDueTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
