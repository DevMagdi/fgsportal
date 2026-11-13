import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackBarState, SnackbarComponent, SnackbarData } from './snackbar.component';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;
  const data: SnackbarData = { state: SnackBarState.Info, message: 'Saved.' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MatIconModule],
      declarations: [SnackbarComponent],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: data },
        { provide: MatSnackBarRef, useValue: { dismiss: jasmine.createSpy('dismiss') } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the injected message and matching state icon', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain(data.message);
    expect(fixture.nativeElement.querySelector('.mat-icon.info')).toBeTruthy();
  });
});
