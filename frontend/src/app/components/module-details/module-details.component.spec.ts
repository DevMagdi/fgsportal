import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

import { ModuleDetailsComponent } from './module-details.component';
import { ModulePagesService } from 'src/app/services/module-pages.service';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { ModulePage } from 'src/app/services/module-pages.registry';

class ModulePagesServiceStub {
  enabled = true;
  pages: ModulePage[] = [];

  isModuleEnabled(): boolean {
    return this.enabled;
  }

  pagesFor(): ModulePage[] {
    return this.pages;
  }
}

class AuthApiServiceStub {
  user = new BehaviorSubject<unknown>(null);
  currentUser = null;
  userPerms = [];
}

const crmPages: ModulePage[] = [
  { title: 'Insights', icon: 'bx bx-trending-up', route: '/CRM/dashboard' },
  { title: 'Activities', icon: 'bx bx-calendar-event', route: '/CRM/activities' },
  {
    title: 'Installments',
    icon: 'bx bx-money',
    route: ['/manager/installments', 't'],
  },
];

describe('ModuleDetailsComponent', () => {
  let currentSlug = 'crm';
  let pagesService: ModulePagesServiceStub;
  let router: Router;

  const configure = () => {
    TestBed.configureTestingModule({
      declarations: [ModuleDetailsComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ModulePagesService, useClass: ModulePagesServiceStub },
        { provide: AuthApiService, useClass: AuthApiServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => currentSlug } },
          },
        },
      ],
    });
  };

  describe('with an enabled module', () => {
    let component: ModuleDetailsComponent;
    let fixture: ComponentFixture<ModuleDetailsComponent>;

    beforeEach(
      waitForAsync(() => {
        currentSlug = 'crm';
        configure();
        TestBed.compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(ModuleDetailsComponent);
      component = fixture.componentInstance;
      pagesService = TestBed.inject(ModulePagesService) as unknown as ModulePagesServiceStub;
      router = TestBed.inject(Router);
      pagesService.pages = crmPages;
      spyOn(router, 'navigateByUrl');
      spyOn(router, 'navigate');
    });

    it('creates the component with the route slug', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(component.slug).toBe('crm');
    });

    it('renders one card per visible module page with the right titles', () => {
      fixture.detectChanges();

      const cards = fixture.nativeElement.querySelectorAll('.module-page-card');
      expect(cards.length).toBe(3);
      expect(
        fixture.nativeElement.querySelector('.card-title').textContent.trim()
      ).toBe('Insights');
    });

    it('binds string and array routes as router links', () => {
      fixture.detectChanges();

      const links = fixture.nativeElement.querySelectorAll('.module-page-card');
      expect(links[0].getAttribute('ng-reflect-router-link')).toContain('/CRM/dashboard');
      // Array router links are serialised with commas by the testing renderer.
      expect(links[2].getAttribute('ng-reflect-router-link')).toContain(
        '/manager/installments'
      );
    });

    it('shows the empty state when the user has no feature permission', () => {
      pagesService.pages = [];
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('.module-page-card').length).toBe(0);
      expect(
        fixture.nativeElement.querySelector('.module-details').textContent
      ).toContain('No features available');
    });

    it('navigates back to the modules dashboard', () => {
      fixture.detectChanges();
      component.backToModules();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/modules');
    });
  });

  describe('redirects', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('redirects an unknown slug back to the modules dashboard', () => {
      currentSlug = 'nope';
      configure();
      const r = TestBed.inject(Router);
      spyOn(r, 'navigateByUrl');

      TestBed.createComponent(ModuleDetailsComponent).detectChanges();

      expect(r.navigateByUrl).toHaveBeenCalledWith('/modules');
    });

    it('redirects a disabled module to the module-disabled page', () => {
      currentSlug = 'hr';
      configure();
      TestBed.overrideProvider(ModulePagesService, {
        useValue: {
          isModuleEnabled: () => false,
          pagesFor: () => [],
        },
      });
      const r = TestBed.inject(Router);
      spyOn(r, 'navigate');

      TestBed.createComponent(ModuleDetailsComponent).detectChanges();

      expect(r.navigate).toHaveBeenCalledOnceWith(['/module-disabled'], {
        queryParams: { module: 'hr', returnUrl: '/modules' },
      });
    });
  });
});
