import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ActivityStatus, ActivityTypes, LeadsAndContacts, LeadsAndContactsActivity } from 'src/app/interfaces/leadsAndContacts';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  currentUser: User;
  activityLoader: boolean = false;
  activities: LeadsAndContactsActivity[] = [];
  ActivityTypesEnum = ActivityTypes;
  DepartmentEnum = Department;
  AccountPositionEnum = AccountPositions;
  newActivityForm: FormGroup = new FormGroup({
    'type_id': new FormControl(ActivityTypes.Call),
    'comment': new FormControl(null),
    'start_date': new FormControl(null, Validators.required),
    'end_date': new FormControl(null, Validators.required),
    'lead_id': new FormControl(null, Validators.required),
    'status': new FormControl(ActivityStatus.Pending)
  })

  sidebarDisplay = false;
  myContactLeads: LeadsAndContacts[] = [];
  constructor(private _db: DatabaseService,
    private _auth: AuthApiService,
    private _notify: NotificationService,) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user => {
      this.currentUser = user;
      this.getMyActivities();
    })
  }

  getMyActivities() {
    this.activityLoader = true;
    this._db.getMyPendingActivity().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.activities = res['data'];
        this.activities.forEach(a => a.to_date = new Date(a.to_date));
        this.activityLoader = false;
      } else {
        this.activities = []
        this.activityLoader = false;
      }
    }, err => {
      this.activityLoader = false;
      this.activities = []
    })
  }


  getMyContactLeads() {
    this.activityLoader = true;
    this.myContactLeads = [];
    // this.currentUser.department == Department.Business_Development && 
    if (this.currentUser.department == Department.MANAGEMENT || this.currentUser.accPosition == AccountPositions.MANAGER) {
      this._db.getAllLeads().subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myContactLeads = res['data']
        } else {
          this.myContactLeads = [];
          // this.activityLoader = false;
        }


        this._db.getAllContacts().subscribe(con => {
          if (con['status'] == ResStatus.CRUD) {
            const cons = con['data']
            if (cons.length > 0) {
              cons.map(c => this.myContactLeads.push(c))
            }
            this.activityLoader = false;
          } else {
            this.activityLoader = false;
          }
        }, err => {
          console.log(err);
          this.activityLoader = false;
        })


      }, err => {
        console.log(err);
        this.activityLoader = false;
        this.myContactLeads = [];
      })
    } else if (this.currentUser.department == Department.Business_Development && this.currentUser.accRole == AccountRoles.SALES) {
      this._db.getMyLeads().subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myContactLeads = res['data']
          // this.activityLoader = false;

        } else {
          this.myContactLeads = [];
          // this.activityLoader = false;

        }

        this._db.getAllContacts().subscribe(con => {
          if (con['status'] == ResStatus.CRUD) {
            const cons = con['data']
            if (cons.length > 0) {
              cons.map(c => this.myContactLeads.push(c))
            }
            this.activityLoader = false;
          } else {
            this.activityLoader = false;
          }
        }, err => {
          console.log(err);
          this.activityLoader = false;
        })
      }, err => {
        console.log(err);
        this.activityLoader = false;
        this.myContactLeads = [];
      })
    } else if (this.currentUser.department == Department.Business_Development && this.currentUser.accRole == AccountRoles.MARKITING) {
      this._db.getMyLeads().subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myContactLeads = res['data']
          // this.activityLoader = false;

        } else {
          // this.myContactLeads = [];
          this.activityLoader = false;

        }

        this._db.getAllContacts().subscribe(con => {
          if (con['status'] == ResStatus.CRUD) {
            const cons = con['data']
            if (cons.length > 0) {
              cons.map(c => this.myContactLeads.push(c))
            }
            this.activityLoader = false;
          } else {
            this.activityLoader = false;
          }
        }, err => {
          console.log(err);
          this.activityLoader = false;
        })
      }, err => {
        console.log(err);
        this.activityLoader = false;
        this.myContactLeads = [];
      })
    }
  }

  openAddActivityForm() {
    this.sidebarDisplay = true
    this.getMyContactLeads();
  }
  markAsDone(activity: LeadsAndContactsActivity) {
    this.activityLoader = true;
    // activity.activity_status_id = ActivityStatus.Done
    console.log(activity);
    
    switch (activity.activity_type_id.toString()) {
      case ActivityTypes.Call:
        activity.activity_status_id = ActivityStatus.Answered
        break;
      case ActivityTypes.Meeting:
        activity.activity_status_id = ActivityStatus.Completed
        break;
      default:
        activity.activity_status_id = ActivityStatus.Done
        break;
    }
    this._db.updateLeadAndContactActivity(activity).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getMyActivities();
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


  getTimeColor(date) {
    if (new Date(date) < new Date()) {
      return 'rgb(249, 72, 57)';
    } else if (this._db.getDateTimeFormatted(this.getDateAfter('hours')) >= this._db.getDateTimeFormatted(new Date(date))) {
      return 'rgb(1, 119, 55)';
    } else if (new Date(date) > new Date()) {
      return 'rgb(101, 110, 122)';
    } else {
      return '#000'
    }
  }


  getDateAfter(addHours: string) {
    let mydate = new Date()
    switch (addHours) {
      case 'hour':
        mydate = new Date(mydate.setHours(mydate.getHours() + 1))
        break;
      case 'hours':
        mydate = new Date(mydate.setHours(mydate.getHours() + 3))
        break;
      case 'tomorrow':
        mydate = new Date(mydate.setDate(mydate.getDate() + 1))
        break;
      case 'week':
        mydate = new Date(mydate.setDate(mydate.getDate() + 7))
        break;
    }
    return mydate;
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
      lead_sub_status_id: this.myContactLeads.find(l => l.id == this.newActivityForm.get(['lead_id'])?.value)?.lead_sub_status_id
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
        this.getMyActivities();
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

  clear(table: Table) {
    table.clear();
  }

  activityTypeChanged(type: any) {
    console.log(type);
    let activityType = type.value as ActivityTypes
    switch (activityType) {
      // case ActivityTypes.Call:
      //   this.newActivityForm.patchValue({
      //     status: ActivityStatus.Pending
      //   })
      //   break;
      // case ActivityTypes.Meeting:
      //   this.newActivityForm.patchValue({
      //     status: ActivityStatus.Scheduled
      //   })
      //   break;
      default:
        this.newActivityForm.patchValue({
          status: ActivityStatus.Pending
        })
        break;
    }

    console.log(this.newActivityForm.value);

  }
}
