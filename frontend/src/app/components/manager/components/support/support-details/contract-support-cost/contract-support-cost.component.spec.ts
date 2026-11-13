import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractSupportCostComponent } from './contract-support-cost.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContractSupportCostComponent', () => {
  let component: ContractSupportCostComponent;
  let fixture: ComponentFixture<ContractSupportCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ContractSupportCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractSupportCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
