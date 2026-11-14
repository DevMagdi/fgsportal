import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BmsUiModule } from './bms-ui.module';

@Component({
  template: `
    <button id="opener" (click)="open = true">open</button>
    <app-bms-side-panel [open]="open" heading="Edit unit" closeLabel="Close" (closed)="open = false">
      <input id="first"><button id="last" type="button">save</button>
    </app-bms-side-panel>`,
})
class HostComponent { open = false; }

describe('BmsSidePanelComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  const query = (selector: string): HTMLElement => fixture.nativeElement.querySelector(selector);

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [HostComponent], imports: [BmsUiModule] });
    fixture = TestBed.createComponent(HostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });
  afterEach(() => fixture.nativeElement.remove());

  it('renders nothing while closed', () => {
    expect(query('[role="dialog"]')).toBeNull();
  });

  it('opens as a labelled modal dialog, focuses the first field and returns focus on close', fakeAsync(() => {
    query('#opener').focus();
    query('#opener').click();
    fixture.detectChanges(); tick();
    const dialog = query('[role="dialog"]');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('Edit unit');
    expect(document.activeElement).toBe(query('#first'));

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges(); tick();
    expect(query('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(query('#opener'));
  }));

  it('closes from the backdrop and the close button', () => {
    fixture.componentInstance.open = true; fixture.detectChanges();
    query('.bms-panel-backdrop').click(); fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
    fixture.componentInstance.open = true; fixture.detectChanges();
    query('.bms-panel-close').click(); fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it('lets go of the focused field before it closes on Escape, so the field is not blurred mid-render', fakeAsync(() => {
    query('#opener').focus();
    query('#opener').click();
    fixture.detectChanges();
    tick();
    const field = query('#first');
    expect(document.activeElement).toBe(field);

    let blurredWhileAttached = false;
    field.addEventListener('blur', () => blurredWhileAttached = document.contains(field));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(blurredWhileAttached).toBe(true);

    fixture.detectChanges();
    tick();
    expect(query('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(query('#opener'));
  }));
});
