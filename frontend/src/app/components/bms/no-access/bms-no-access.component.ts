import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BmsAccessService } from '../bms-access.service';
import { BmsLanguageService } from '../bms-language.service';

/**
 * Shown when an authenticated user holds no BMS ability at all (BRD section 3,
 * requirement 5). Explains the situation instead of looping back to sign-in.
 */
@Component({
  selector: 'app-bms-no-access',
  templateUrl: './bms-no-access.component.html',
  styleUrls: ['../bms-shared.scss'],
})
export class BmsNoAccessComponent implements OnInit {
  loading = true;

  constructor(public lang: BmsLanguageService, private access: BmsAccessService, private router: Router) {}

  ngOnInit(): void {
    this.access.reset();
    this.access.abilities().subscribe(can => {
      this.loading = false;
      const landing = this.access.firstLanding();
      if (can.length > 0 && landing !== '/bms/no-access') {
        this.router.navigateByUrl(landing, { replaceUrl: true });
      }
    });
  }

  retry(): void {
    this.loading = true;
    this.access.reset();
    this.ngOnInit();
  }
}
