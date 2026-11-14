import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ShellSessionService } from '../shell-session.service';

/** The post-sign-in announcement dialog, moved unchanged out of the retired navbar. */
@Component({
  selector: 'app-announcement-dialog',
  templateUrl: './announcement-dialog.component.html',
  styleUrls: ['./announcement-dialog.component.scss'],
})
export class AnnouncementDialogComponent {
  readonly newServerApi = environment.newServerApi;
  constructor(public session: ShellSessionService) {}

  acknowledge(): void {
    this.session.displayAnnounce = false;
    this.session.markAsView();
  }
}
