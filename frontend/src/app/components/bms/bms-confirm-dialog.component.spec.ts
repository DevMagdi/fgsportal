import { BmsConfirmDialogComponent, BmsConfirmDialogData } from './bms-confirm-dialog.component';

describe('BmsConfirmDialogComponent', () => {
  it('accepts a complete dialog configuration for non-destructive actions', () => {
    const data: BmsConfirmDialogData = {
      title: 'Assign role', message: 'Continue?', confirmLabel: 'Assign', cancelLabel: 'Cancel', destructive: false,
    };
    const component = new BmsConfirmDialogComponent(data);
    expect(component.data).toBe(data);
    expect(component.data.destructive).toBeFalse();
  });

  it('keeps destructive state explicit for revocation and deactivation prompts', () => {
    const data: BmsConfirmDialogData = {
      title: 'Revoke access', message: 'Remove access?', confirmLabel: 'Revoke', cancelLabel: 'Cancel', destructive: true,
    };
    const component = new BmsConfirmDialogComponent(data);
    expect(component.data.destructive).toBeTrue();
  });
});
