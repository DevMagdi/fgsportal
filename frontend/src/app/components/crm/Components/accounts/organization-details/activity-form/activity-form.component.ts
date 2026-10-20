import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ActivityStatus, ActivityTypes, LeadsAndContacts, LeadsAndContactsActivity } from 'src/app/interfaces/leadsAndContacts';
import { ResStatus } from 'src/app/interfaces/res-status';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit {

  newActivityForm: FormGroup = new FormGroup({
    'type_id': new FormControl(ActivityTypes.Call),
    'comment': new FormControl(null),
    'start_date': new FormControl(null, Validators.required),
    'end_date': new FormControl(null, Validators.required),
    'lead_id': new FormControl(null, Validators.required),
    'status': new FormControl(ActivityStatus.Pending)

  });
  @Input() leads: LeadsAndContacts[] = [];
  @Output() closeForm = new EventEmitter<boolean>();
  @Output() onAddActivity = new EventEmitter<boolean>();
  ActivityTypesEnum = ActivityTypes;
  activityLoader = false;

  constructor(private _db: DatabaseService, private _notify: NotificationService) { }

  ngOnInit(): void {
  }


  getSelectedActivity(selectedActivity) {
    let activityName = ''
    switch (selectedActivity) {
      case ActivityTypes.Call:
        activityName = 'Call'
        break;
      case ActivityTypes.Deadline:
        activityName = 'Deadline'
        break;
      case ActivityTypes.Lunch:
        activityName = 'Lunch'
        break;
      case ActivityTypes.Meeting:
        activityName = 'Meeting'
        break;
      case ActivityTypes.Notes:
        activityName = 'Notes'
        break;
      case ActivityTypes.Other:
        activityName = 'Other'
        break;
      case ActivityTypes.Task:
        activityName = 'Task'
        break;
    }

    return activityName;

  }

  addActivity() {
    this.activityLoader = true;

    const newActivity: LeadsAndContactsActivity = {
      activity_status_id: this.newActivityForm.get(['status'])?.value,
      activity_type_id: this.newActivityForm.get(['type_id'])?.value,
      comment: this.newActivityForm.get(['comment'])?.value,
      from_date: this._db.getDateTimeFormatted(this.newActivityForm.get(['start_date'])?.value),
      to_date: this._db.getDateTimeFormatted(this.newActivityForm.get(['end_date'])?.value),
      contact_lead_id: this.newActivityForm.get(['lead_id'])?.value,
      lead_sub_status_id: this.leads.find(l => l.id == this.newActivityForm.get(['lead_id'])?.value)?.lead_sub_status_id
    }

    if (!newActivity.comment) {
      newActivity.comment = this.getSelectedActivity(this.newActivityForm.get(['type_id'])?.value)
    }


    this._db.createLeadAndContactActivity(newActivity).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.newActivityForm.patchValue({
          'type_id': ActivityTypes.Call,
          'comment': this.getSelectedActivity(ActivityTypes.Call),
          'start_date': null,
          'end_date': null,
          'status': null
        })

        this.onAddActivity.emit(true);
        this.closeForm.emit(true);
        this.activityLoader = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.activityLoader = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.activityLoader = false;
    })

  }
}
