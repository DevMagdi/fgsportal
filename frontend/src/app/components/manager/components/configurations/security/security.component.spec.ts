import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityComponent } from './security.component';
import { AccordionModule } from 'primeng/accordion';

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionModule],
      declarations: [ SecurityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
