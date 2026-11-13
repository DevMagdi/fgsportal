import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationsComponent } from './configurations.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccordionModule } from 'primeng/accordion';

describe('ConfigurationsComponent', () => {
  let component: ConfigurationsComponent;
  let fixture: ComponentFixture<ConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionModule, HttpClientTestingModule],
      declarations: [ ConfigurationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
