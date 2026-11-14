import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResStatus } from '../../interfaces/res-status';
import { OpenToWork } from '../../interfaces/user';
import { AuthApiService } from '../../services/auth-api.service';
import { DatabaseService } from '../../services/database.service';

/**
 * "Open To Work" modal of technical-team members, moved unchanged out of the
 * retired navbar. The sidebar button opens it through the same Bootstrap
 * `data-bs-target="#openToWork"` hook and calls {@link getMyOpenToWork}.
 */
@Component({
  selector: 'app-open-to-work',
  templateUrl: './open-to-work.component.html',
  styleUrls: ['./open-to-work.component.scss'],
})
export class OpenToWorkDialogComponent {
  myOpenToWork: OpenToWork[] = [];
  myOpenToWorkLoading = false;
  newOpenToWorkForm: FormGroup = new FormGroup({
    'from': new FormControl(null, Validators.required),
    'to': new FormControl(null, Validators.required),
  });

  constructor(private _auth: AuthApiService, private _db: DatabaseService) {}

  getMyOpenToWork(): void {
    this.myOpenToWorkLoading = true;
    this._auth.getAllOpenToWork().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.myOpenToWork = res['data'];
        this.myOpenToWorkLoading = false;
      } else {
        this.myOpenToWork = [];
        this.myOpenToWorkLoading = false;
      }
    }, _err => {
      this.myOpenToWork = [];
      this.myOpenToWorkLoading = false;
    });
  }

  createOpenToWork(): void {
    this.myOpenToWorkLoading = true;
    const newOpenToWork: OpenToWork = {
      from_date_time: this._db.getDateTimeFormatted(this.newOpenToWorkForm.get(['from'])?.value),
      to_date_time: this._db.getDateTimeFormatted(this.newOpenToWorkForm.get(['to'])?.value),
    };
    this._auth.openToWork(newOpenToWork.from_date_time, newOpenToWork.to_date_time).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getMyOpenToWork();
        this.myOpenToWorkLoading = false;
      }
    }, _err => {
      this.myOpenToWorkLoading = false;
    });
  }

  deactivateOpenToWork(open: OpenToWork): void {
    this.myOpenToWorkLoading = true;
    this._auth.updateToWork(open.id || '', '0').subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getMyOpenToWork();
        this.myOpenToWorkLoading = false;
      }
    }, _err => {
      this.myOpenToWorkLoading = false;
    });
  }
}
