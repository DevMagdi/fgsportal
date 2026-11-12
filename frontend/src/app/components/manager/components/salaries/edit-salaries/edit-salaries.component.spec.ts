import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalariesComponent } from './edit-salaries.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditSalariesComponent', () => {
  let component: EditSalariesComponent;
  let fixture: ComponentFixture<EditSalariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ EditSalariesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSalariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
