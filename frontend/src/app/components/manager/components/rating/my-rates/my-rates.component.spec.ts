import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRatesComponent } from './my-rates.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MyRatesComponent', () => {
  let component: MyRatesComponent;
  let fixture: ComponentFixture<MyRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ MyRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
