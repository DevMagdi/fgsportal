import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BmsLanguageService } from './bms-language.service';

@Component({ selector:'app-bms-shell', templateUrl:'./bms-shell.component.html', styleUrls:['./bms-shared.scss'] })
export class BmsShellComponent implements OnDestroy {
  direction:'ltr'|'rtl' = this.lang.direction;
  private subscription = this.lang.language$.subscribe(() => { this.direction = this.lang.direction; document.documentElement.dir = this.direction; });
  constructor(public lang: BmsLanguageService) {}
  ngOnDestroy(): void { this.subscription.unsubscribe(); document.documentElement.dir = 'ltr'; }
}
