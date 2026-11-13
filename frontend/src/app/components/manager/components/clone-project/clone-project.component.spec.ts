import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneProjectComponent } from './clone-project.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CloneProjectComponent', () => {
  let component: CloneProjectComponent;
  let fixture: ComponentFixture<CloneProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CloneProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
