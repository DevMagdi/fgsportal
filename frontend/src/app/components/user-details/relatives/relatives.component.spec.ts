import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativesComponent } from './relatives.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RelativesComponent', () => {
  let component: RelativesComponent;
  let fixture: ComponentFixture<RelativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ RelativesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
