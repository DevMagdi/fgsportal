import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ResStatus } from 'src/app/interfaces/res-status';
import { DatabaseService } from 'src/app/services/database.service';
import { MyRatesComponent } from './my-rates.component';

describe('MyRatesComponent', () => {
  let component: MyRatesComponent;
  let fixture: ComponentFixture<MyRatesComponent>;
  let getMyRateHistory: jasmine.Spy;

  beforeEach(async () => {
    getMyRateHistory = jasmine.createSpy('getMyRateHistory').and.returnValue(
      of({ status: ResStatus.Success_But_Empty, data: [] })
    );
    await TestBed.configureTestingModule({
      declarations: [MyRatesComponent],
      providers: [{ provide: DatabaseService, useValue: { getMyRateHistory } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates and requests the current user rate history', () => {
    expect(component).toBeTruthy();
    expect(getMyRateHistory).toHaveBeenCalledTimes(1);
    expect(component.myPrevRates).toEqual([]);
  });
});
