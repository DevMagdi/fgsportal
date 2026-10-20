import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmMainComponent } from './crm-main.component';

describe('CrmMainComponent', () => {
  let component: CrmMainComponent;
  let fixture: ComponentFixture<CrmMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
