import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';

import { ModulesCardsComponent } from './modules-cards.component';
import { ModuleService, SystemModule } from 'src/app/services/module.service';

/**
 * Minimal ModuleService stub: it only needs the streams/methods the cards
 * component consumes.
 */
class ModuleServiceStub {
  loaded$ = new BehaviorSubject<boolean>(true);
  catalogue$ = new BehaviorSubject<SystemModule[]>([]);
  private enabled: string[] = ['core'];

  loadCatalogue() {
    return of(this.catalogue$.value);
  }

  isModuleEnabled(slug: string): boolean {
    return slug === 'core' || this.enabled.includes(slug);
  }

  setEnabled(slugs: string[]): void {
    this.enabled = slugs;
  }
}

describe('ModulesCardsComponent', () => {
  let component: ModulesCardsComponent;
  let fixture: ComponentFixture<ModulesCardsComponent>;
  let moduleService: ModuleServiceStub;
  let router: Router;

  const catalogue = (enabledSlugs: string[]): SystemModule[] =>
    ['core', 'crm', 'ticketing', 'projects', 'hr', 'admin'].map((slug, i) => ({
      id: i + 1,
      name: slug.toUpperCase(),
      slug,
      description: `${slug} description`,
      is_core: slug === 'core',
      is_active: true,
      is_enabled: slug === 'core' || enabledSlugs.includes(slug),
    }));

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ModulesCardsComponent],
        imports: [RouterTestingModule],
        providers: [{ provide: ModuleService, useClass: ModuleServiceStub }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulesCardsComponent);
    component = fixture.componentInstance;
    moduleService = TestBed.inject(ModuleService) as unknown as ModuleServiceStub;
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    spyOn(router, 'navigate');
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders one card for every module, with disabled cards dimmed and not hidden', () => {
    moduleService.setEnabled(['core', 'crm']);
    moduleService.catalogue$.next(catalogue(['crm']));
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.module-card');
    expect(cards.length).toBe(6);

    const disabledCards = fixture.nativeElement.querySelectorAll(
      '.module-card--disabled'
    );
    // ticketing, projects, hr, admin are disabled — still rendered, just dimmed.
    expect(disabledCards.length).toBe(4);

    const lockedBadges = fixture.nativeElement.querySelectorAll(
      '.module-card__locked-badge'
    );
    expect(lockedBadges.length).toBe(4);
  });

  it('keeps the core card enabled under every entitlement configuration', () => {
    moduleService.setEnabled(['core']);
    moduleService.catalogue$.next(catalogue([]));
    fixture.detectChanges();

    const coreCard = component.cards.find((c) => c.slug === 'core')!;
    expect(coreCard).toBeTruthy();
    expect(coreCard.isCore).toBeTrue();
    expect(coreCard.isEnabled).toBeTrue();

    const coreElement = fixture.nativeElement.querySelector(
      '.module-card--core'
    );
    expect(coreElement).toBeTruthy();
    expect(coreElement.classList.contains('module-card--disabled')).toBeFalse();
  });

  it('opens the module feature-cards page when an enabled card is clicked', () => {
    moduleService.setEnabled(['core', 'crm']);
    moduleService.catalogue$.next(catalogue(['crm']));
    fixture.detectChanges();

    const crmCard = component.cards.find((c) => c.slug === 'crm')!;
    component.onCardClick(crmCard);

    expect(router.navigate).toHaveBeenCalledOnceWith(['/modules', 'crm']);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('builds one card per slug using the shared module metadata', () => {
    moduleService.setEnabled(['core', 'crm']);
    moduleService.catalogue$.next(catalogue(['crm']));
    fixture.detectChanges();

    expect(component.cards.map((c) => c.slug)).toEqual([
      'core',
      'crm',
      'ticketing',
      'projects',
      'hr',
      'admin',
    ]);
    component.cards.forEach((card) => {
      expect(card.icon).toContain('bx ');
      expect(card.name.length).toBeGreaterThan(0);
      expect(card.description.length).toBeGreaterThan(0);
      // ModuleCard no longer carries a route: navigation is centralised
      // through onCardClick -> /modules/:slug.
      expect((card as unknown as Record<string, unknown>).route).toBeUndefined();
    });
  });

  it('sends disabled-card clicks to the module-disabled page instead of entering the module', () => {
    moduleService.setEnabled(['core']);
    moduleService.catalogue$.next(catalogue([]));
    fixture.detectChanges();

    const hrCard = component.cards.find((c) => c.slug === 'hr')!;
    expect(hrCard.isEnabled).toBeFalse();

    component.onCardClick(hrCard);

    // It must NOT navigate into the module route.
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledOnceWith(['/module-disabled'], {
      queryParams: { module: 'hr' },
    });
  });
});
