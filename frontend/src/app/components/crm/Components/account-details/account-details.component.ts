import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ActivityStatus, ActivityTypes, CloseLeadSubStatus, Contacts, Labels, LeadsAndContacts, LeadsAndContactsActivity, LeadsAndContactsSubStatus, LeadsAndContactsTypes, PocRequests, PocRequestStatus, ProcessDetails, RequestForPocPriority, RequestForPocStatus, RFPRequests, RFPRequestStatus } from 'src/app/interfaces/leadsAndContacts';
import { Products } from 'src/app/interfaces/products';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Department, MobileNumber, Partner, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DurationCalculationService } from 'src/app/services/duration-calculation.service';
import { ProjectStructure, ProjectTeam, Status } from 'src/app/interfaces/project';
import { CurrencyModule } from 'src/app/interfaces/currency.module';
import { Campaign } from 'src/app/interfaces/campaign';


@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
  CurrencyList = CurrencyModule.CurrencyList;

  @ViewChild('modalCenter2') modal;

  AccountRoles = AccountRoles;
  currentUser: User;
  currentLeadDetails: LeadsAndContacts;
  leadDetailsLoading: boolean = false;
  leadActivities: LeadsAndContactsActivity[] = [];
  newValue: string | number | Date = '';
  salesTeam: User[] = [];
  products: Products[] = [];
  contactPhones: MobileNumber[] = [{ phone: '', phone_type: 'Work' }];
  allPartners: Partner[] = [];
  myPersonContacts: Contacts[] = [];
  items: MenuItem[];
  activeItem: MenuItem;
  contactTypes: LeadsAndContactsTypes[] = [];
  AccountRoleEnum = AccountRoles;
  contactSubStatus: LeadsAndContactsSubStatus[] = [];
  filteredOptions: Observable<Partner[]> | undefined;
  lables: Labels[] = [];
  CloseLeadSubStatusEnum = CloseLeadSubStatus;
  editLeadName: boolean = false;
  editOwner: boolean = false;
  editCost: boolean = false;
  editProduct: boolean = false;
  editAddress: boolean = false;
  editEmail: boolean = false;
  editContact: boolean = false;
  phoneEditMode: boolean = false;
  editPartner: boolean = false;
  editType: boolean = false;
  editLabels: boolean = false;
  editDate: boolean = false;
  editACD: boolean = false;
  editCampaign: boolean = false;
  editNotes: boolean = false;
  costDetailsFormOpened: boolean = false;

  newOrgAdded: boolean = false;
  addNewOrgnization: boolean = false;

  changePartnerForm: FormGroup = new FormGroup({
    'partner_id': new FormControl(null)
  })

  /* =========== Activity Section  =============== */
  phoneOnEditMode: boolean[] = [];
  openNotesForm: boolean = false;
  openActivityForm: boolean = true;
  newActivityForm: FormGroup = new FormGroup({
    'type_id': new FormControl(ActivityTypes.Call),
    'comment': new FormControl(null),
    'start_date': new FormControl(null),
    'end_date': new FormControl(null),
    'status': new FormControl(ActivityStatus.Pending),

    'activity_day_date': new FormControl(null),
    'activity_start_date': new FormControl(null),
    'activity_end_date': new FormControl(null),
    'duration': new FormControl(null),
    'description': new FormControl(null),
  })
  myLeadActivites: LeadsAndContactsActivity[] = [];
  ActivityStatusEnum = ActivityStatus;
  ActivityTypesEnum = ActivityTypes;
  departmentEnum = Department;
  AccountPositionsEnum = AccountPositions;
  pocRequestStatusEnum = PocRequestStatus;
  plannedActivity: LeadsAndContactsActivity[] = [];
  doneActivity: LeadsAndContactsActivity[] = [];
  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    // ['blockquote', 'code-block'],
    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    // [{ 'font': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    // [{ 'header': 1 }, { 'header': 2 }],               // custom button values

    ['clean']                                         // remove formatting button
  ];
  quillOPT = {
    toolbar: this.toolbarOptions
  }
  activityToEdit: LeadsAndContactsActivity | undefined;
  contactLoader: boolean = false;
  activityOnEditMOde: boolean = false;

  /* Attach Section */
  leadAttaches: any[] = [];
  newServerApi = environment.newServerApi;


  /* request POC Section */

  requestPOCForm: FormGroup = new FormGroup({
    'product_id': new FormControl(null, Validators.required),
    'title': new FormControl(null, Validators.required),
    'description': new FormControl(null),
    'contact_lead_id': new FormControl(null),
    'request_poc_status_id': new FormControl(null),
    'request_poc_priority_id': new FormControl(null, Validators.required),
    'process': new FormArray([
      new FormGroup({
        process_title: new FormControl('', Validators.required),
        process_description: new FormControl(''),
        process_department: new FormControl('', Validators.required)
      })
    ]),
  })

  process = this.requestPOCForm.get('process') as FormArray;

  requestForPocStatus: RequestForPocStatus[] = [];
  requestForPocPriority: RequestForPocPriority[] = [];

  pocRequests: PocRequests[] = [];
  activeIndex: number = 0;

  requestForPOCAttaches: File[] = [];
  // urls: string[];
  buttonsItems: MenuItem[] = [];


  /* request POC Action Section */


  // pocrequestToTakeAction:PocRequests;
  PocRequestStatusEnum = PocRequestStatus;
  requestPOCActionForm: FormGroup = new FormGroup({
    'request_poc_id': new FormControl(null),
    'request_poc_status_id': new FormControl(null),
    'request_poc_priority_id': new FormControl(null),
    'comment': new FormControl(null, Validators.required),
    'poc': new FormGroup({
      'title': new FormControl(null),
      'desc': new FormControl(null),
      'duration': new FormControl(null),
      'start_date': new FormControl(null),
      'end_date': new FormControl({ value: null, disabled: true }),
      'budget': new FormControl(null),
      'type': new FormControl(null),
      'partner': new FormControl(null),
      'pm': new FormControl(null),
      'ba': new FormControl(null),
      'tl': new FormControl(null),
      'devs': new FormControl(null),
    })
  })

  action: string = '';
  allUsers: User[] = [];
  devs: User[] = [];
  PMs: User[] = [];
  BAs: User[] = [];
  TLeads: User[] = [];
  filteredContacts: any[];
  allCampaign: Campaign[] = [];

  /* request RFP Section */

  requestRFPForm: FormGroup = new FormGroup({
    'title': new FormControl(null, Validators.required),
    'comment': new FormControl(null),
    'approval_ids': new FormControl(null, Validators.required)
  })

  requestForRFPAttaches: File[] = [];
  rfpRequests: RFPRequests[] = [];
  myRFPConfigList: User[] = [];

  requestRFPActionForm: FormGroup = new FormGroup({
    'request_rfp_id': new FormControl(null),
    'request_rfp_status_id': new FormControl(null),
    'comment': new FormControl(null, Validators.required),
    'assignTo': new FormControl(null),
    'action': new FormControl(null)
  })
  RFPRequestStatusEnum = RFPRequestStatus;
  constructor(private _db: DatabaseService,
    private _auth: AuthApiService,
    private _notify: NotificationService,
    private route: ActivatedRoute,
    private dCalc: DurationCalculationService,
    private _router: Router) { }

  ngOnInit(): void {
    this.items = [
      {
        icon: 'pi pi-pencil',
        command: () => {
          // this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
        }
      },
      {
        icon: 'pi pi-refresh',
        command: () => {
          //this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
        }
      },
      {
        icon: 'pi pi-trash',
        command: () => {
          //this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
        }
      },
      {
        icon: 'pi pi-upload',
        routerLink: ['/fileupload']
      },
      {
        icon: 'pi pi-external-link',
        url: 'http://angular.io'
      }
    ];
    this.route.queryParams.subscribe(params => {
      this.activeIndex = params['active'];
    });

    this._auth.user.subscribe(user => {
      this.currentUser = user;

      this.getCurrentLeadDetails();
    })

    this.items = [
      { label: 'Notes', icon: 'pi pi-fw pi-book' },
      { label: 'Activity', icon: 'pi pi-fw pi-calendar-plus' },
      { label: 'Attach', icon: 'pi pi-fw pi-paperclip' },
    ];
    this.activeItem = this.items[0]
  }

  getLeadSubStatusByStatus() {
    this._db.getLeadAndContactSubStatus('3').subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.contactSubStatus = res['data']
        setTimeout(() => {
          if (this.currentLeadDetails.status_id == '3') {
            this.selectSteps(this.contactSubStatus.findIndex(s => s.id == this.currentLeadDetails.lead_sub_status_id))
          } else if (this.currentLeadDetails.status_id == '4') {
            this.selectSteps(this.contactSubStatus.findIndex(s => s.id == this.currentLeadDetails.prev_lead_sub_status_id))
          }
        }, 500);
      } else {
        this.contactSubStatus = [];
      }
    }, err => {
      this.contactSubStatus = [];
    })
  }

  selectSteps(index) {
    const cont = document.getElementById('stepsContainer')
    if (!!cont) {
      for (let i = 0; i < cont.children.length; i++) {
        if (i <= index) {
          cont.children[i].classList.add('active')
        } else {
          cont.children[i].classList.remove('active')
        }
      }
    }
  }

  editLeadSubstatus(status_id) {
    this.newValue = status_id
    if (status_id == '6') {
      this.openRequestForPOCModal();
      document.getElementById('openPocReqBTN')?.click()
      this.newValue = '6'
      this.saveEditLead('lead_sub_status_id');
    } else if (status_id == '7') {
      this.getMyRFPConfigList();
      document.getElementById('openRFPReqBTN')?.click();
      this.newValue = '7'
      this.saveEditLead('lead_sub_status_id');
    } else {

      this.saveEditLead('lead_sub_status_id')
    }





  }

  openEditCurrentLeadDetails(editedField: string) {
    this.cancelEdit();
    switch (editedField) {

      case 'campaign_id':
        this.getAllCampaigns();
        this.editCampaign = true;
        this.newValue = this.currentLeadDetails.campagin_id || '';

        break;
      case 'title':
        this.editLeadName = true;
        this.newValue = this.currentLeadDetails.title;
        break;
      case 'sales_id':

        this.editOwner = true;
        this.newValue = this.currentLeadDetails.sales_id || '';
        this.getSalesTeam()
        break;
      case 'cost':
        this.editCost = true;
        this.newValue = this.currentLeadDetails.cost || 0;
        break;
      case 'product_id':
        this.editProduct = true;
        this.newValue = this.currentLeadDetails.product_id || '';
        this.getAllProducts();
        break;
      // case 'address':
      //   this.editAddress= true;
      //   this.newValue = this.currentLeadDetails.address || '';
      //   break;
      // case 'email':
      //   this.editEmail= true;
      //   this.newValue = this.currentLeadDetails.email || '';
      //   break;
      case 'partner':
        this.getAllPartners();
        this.editPartner = true;
        this.changePartnerForm.patchValue({
          'partner_id': this.currentLeadDetails.partner_id
        })
        break;

      case 'contact_id':
        this.getMyOrgContacts();
        this.editContact = true;
        break;
      case 'type':
        this.getAllTypes();
        this.editType = true;
        this.newValue = this.currentLeadDetails.lead_type_id || '';
        break;
      case 'labels':
        this.getAllLabels();
        this.editLabels = true;
        break;
      case 'expected_close_date':
        this.editDate = true;
        this.newValue = this.currentLeadDetails.expected_close_date ? this._db.getDateFormattedYearMonthDay(this.currentLeadDetails.expected_close_date) : '';
        break;
      case 'notes':
        this.editNotes = true;
        this.newValue = this.currentLeadDetails.notes || '';
        break;

      case 'actual_closing_date':
        this.editACD = true;
        this.newValue = this.currentLeadDetails.actual_closing_date ? this._db.getDateFormattedYearMonthDay(this.currentLeadDetails.actual_closing_date) : '';
        break;
    }
  }


  getAllLabels() {
    this._db.getAllLables().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.lables = res['data']
      }
    })
  }


  getSalesTeam() {
    this._auth.getUserByFilter(Department.Business_Development, AccountRoles.SALES).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.salesTeam = res['data']
      }
    })
  }

  getAllTypes() {
    this._db.getAllContactAndLeadTypes().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.contactTypes = res['data']
      }
    })
  }

  getAllProducts() {
    this._db.getAllProducts().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.products = res['data']
      }
    })
  }


  cancelEdit() {
    this.newValue = '';
    this.editLeadName = false;
    this.editOwner = false;
    this.editCost = false;
    this.editProduct = false;
    this.editAddress = false;
    this.editEmail = false;
    this.editContact = false;
    this.phoneOnEditMode = [];
    this.editPartner = false;
    this.editType = false;
    this.editLabels = false;
    this.editDate = false;
    this.editACD = false;
    this.editNotes = false;
    this.leadDetailsLoading = false;
    this.editCampaign = false;
  }

  saveEditLead(editedField: string) {
    this.leadDetailsLoading = true;

    let editParams: { [k: string]: any } = {}
    switch (editedField) {
      case 'campaign_id':
        editParams.campagin_id = this.newValue;
        break;
      case 'title':
        editParams.title = this.newValue;
        break;
      case 'label':
        editParams.label = this.currentLeadDetails.label;
        break;
      case 'sales_id':
        editParams.sales_id = this.newValue;
        break;
      // case 'email':
      //   editParams.email = this.newValue;
      //   break;
      // case 'phone':
      //   editParams.phone = this.currentLeadDetails.phone;
      //   break;
      case 'partner_id':
        editParams.partner_id = this.changePartnerForm.get(['partner_id'])?.value.id;
        break;

      case 'contact_id':
        editParams.contact_id = this.newValue['id'];
        break;
      case 'lead_sub_status_id':
        editParams.lead_sub_status_id = this.newValue;
        break;
      case 'product_id':
        editParams.product_id = this.newValue;
        break;
      case 'lead_type_id':
        editParams.lead_type_id = this.newValue;
        break;
      case 'address':
        editParams.address = this.newValue;
        break;
      case 'cost':
        editParams.cost = this.newValue;
        editParams.currency = this.currentLeadDetails.currency;
        break;
      case 'notes':
        editParams.notes = this.newValue;
        break;
      case 'expected_close_date':
        editParams.expected_close_date = this._db.getDateFormatted(new Date(this.newValue));
        break;
      case 'actual_closing_date':
        editParams.actual_closing_date = this._db.getDateFormatted(new Date(this.newValue));
        break;
    }
    this._db.updateContactLead(this.currentLeadDetails.id || '', editParams).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getCurrentLeadDetails();
        this.cancelEdit();
      } else {
        this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`, SnackBarState.Warning, 5000)
        this.leadDetailsLoading = false;

      }
    }, err => {
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)
      this.leadDetailsLoading = false;

    })
  }


  getCurrentLeadPOCRequests() {
    this._db.getPocRequestsByLeadID(this.currentLeadDetails.id || '').subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.pocRequests = res['data'];
      } else {
        this.pocRequests = [];
      }
    }, err => {
      this.pocRequests = [];
    })
  }

  getCurrentLeadDetails() {
    this.leadDetailsLoading = true;
    const leadID = this.route.snapshot.params.id;
    this._db.getContactByID(leadID).subscribe(res => {
      this.leadDetailsLoading = false;
      if (res['status'] == ResStatus.CRUD) {
        this.currentLeadDetails = res['data'];
        this.getContactActivities();
        this.getLeadSubStatusByStatus();
        this.getCurrentLeadPOCRequests();
        this.getRFPRequestsByLeadID();
        if (this.currentUser.accRole == AccountRoles.SALES && this.currentUser.accPosition != AccountPositions.MANAGER) {
          if (this.currentUser.key != this.currentLeadDetails.sales_id) {
            this._notify.openSnackbar(`You Don't Have permission to access this lead details`, SnackBarState.Warning)
            this._router.navigate(['/'])
          }
        }
        this._db.getLeadAndContactActivity(this.currentLeadDetails.id || '').subscribe(res => {
          if (res['status'] == ResStatus.CRUD) {
            this.leadActivities = res['data']
          } else {
            this.leadActivities = []
          }
        }, err => {
          this.leadActivities = []
        })
      } else {
        this.leadActivities = []
      }
    }, err => {
      this.leadDetailsLoading = false;
      this.leadActivities = []
    })
  }

  getContactActivities() {
    this._db.getLeadAndContactActivity(this.currentLeadDetails.id || '').subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.myLeadActivites = res['data'];
        //sort by date desc
        this.myLeadActivites.sort((a, b) => {
          return new Date(b.from_date || '').getTime() - new Date(a.from_date || '').getTime();
        })
        this.doneActivity = this.myLeadActivites.filter(a => a.activity_status_id == ActivityStatus.Done)
        this.doneActivity.push({
          activity_status_id: ActivityStatus.Done,
          activity_type_id: ActivityTypes.Other,
          comment: `${this.currentLeadDetails.user_creator_name} → Lead created`,
          contact_lead_id: this.currentLeadDetails.id || '',
          from_date: this.currentLeadDetails.created_at || '',
          to_date: this.currentLeadDetails.created_at || '',
        })
        this.plannedActivity = this.myLeadActivites.filter(a => a.activity_status_id == ActivityStatus.Pending)
      } else {
        this.doneActivity = [{
          activity_status_id: ActivityStatus.Done,
          activity_type_id: ActivityTypes.Other,
          comment: `${this.currentLeadDetails.user_creator_name} → Lead created`,
          contact_lead_id: this.currentLeadDetails.id || '',
          from_date: this.currentLeadDetails.created_at || '',
          to_date: this.currentLeadDetails.created_at || '',
        }];
        this.plannedActivity = [];
      }
    }, err => {
    })
  }



  getCurrentLeadAttaches() {
    this.leadDetailsLoading = true;
    this._db.getLeadAttaches(this.currentLeadDetails.id || '').subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.leadAttaches = res['data']
        this.leadDetailsLoading = false;
      } else {
        this.leadAttaches = []
        this.leadDetailsLoading = false;
      }
    }, err => {
      this.leadAttaches = []
      this.leadDetailsLoading = false;
    })
  }

  editPhone(i) {
    this.phoneOnEditMode[i] = !this.phoneOnEditMode[i]
  }

  addPhone() {
    if (!!this.currentLeadDetails.phone) {
      this.currentLeadDetails.phone?.push({ phone: '', phone_type: 'Work' })
    } else {
      this.currentLeadDetails.phone = [{ phone: '', phone_type: 'Work' }]
    }
    this.phoneOnEditMode.push(false)
  }

  deletePhone(index) {
    this.currentLeadDetails.phone?.splice(index, 1)
    this.saveEditLead('phone')
  }


  selectActiveTab(tab) {
    this.activeItem = tab.activeItem
    if (this.activeItem.label == 'Attach') {
      this.getCurrentLeadAttaches();
    }
  }

  addQuickNote() {
    this.leadDetailsLoading = true;

    const newActivity: LeadsAndContactsActivity = {
      activity_status_id: ActivityStatus.Done,
      activity_type_id: ActivityTypes.Notes,
      comment: this.newActivityForm.get(['comment'])?.value,
      from_date: this._db.getDateTimeFormatted(new Date()),
      to_date: this._db.getDateTimeFormatted(new Date()),
      contact_lead_id: this.currentLeadDetails.id || '',
      lead_sub_status_id: this.currentLeadDetails.lead_sub_status_id
    }

    if (!newActivity.comment) {
      this.leadDetailsLoading = false;
      return this._notify.openSnackbar('Please Write A Note', SnackBarState.Warning)
    }

    this._db.createLeadAndContactActivity(newActivity).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.newActivityForm.patchValue({
          'type_id': ActivityTypes.Call,
          'comment': '',
          'start_date': null,
          'end_date': null,
          'status': null
        })
        this.getContactActivities();
        this.leadDetailsLoading = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      }
    }, err => {
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.leadDetailsLoading = false;
    })

  }


  addQuickActivity(addHours: string) {
    this.leadDetailsLoading = true;

    const newActivity: LeadsAndContactsActivity = {
      activity_status_id: ActivityStatus.Pending,
      activity_type_id: this.newActivityForm.get(['type_id'])?.value,
      comment: this.newActivityForm.get(['comment'])?.value,
      from_date: this._db.getDateTimeFormatted(this.getDateAfter(addHours)),
      to_date: this._db.getDateTimeFormatted(this.getDateAfter(addHours)),
      contact_lead_id: this.currentLeadDetails.id || '',
      lead_sub_status_id: this.currentLeadDetails.lead_sub_status_id
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
        this.getContactActivities();
        this.leadDetailsLoading = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.leadDetailsLoading = false;
    })

  }

  addActivity() {


    console.log(this.newActivityForm.value);

    this.leadDetailsLoading = true;

    const newActivity: LeadsAndContactsActivity = {
      activity_status_id: this.newActivityForm.get(['status'])?.value,
      activity_type_id: this.newActivityForm.get(['type_id'])?.value,
      comment: this.newActivityForm.get(['comment'])?.value,
      from_date: this._db.getDateTimeFormatted(this.newActivityForm.get(['start_date'])?.value),
      to_date: this._db.getDateTimeFormatted(this.newActivityForm.get(['end_date'])?.value),
      contact_lead_id: this.currentLeadDetails.id || '',
      lead_sub_status_id: this.currentLeadDetails.lead_sub_status_id,


    }

    // if (this.newActivityForm.get(['status'])?.value == true) {
    //   if (this.newActivityForm.get(['type_id'])?.value == ActivityTypes.Call) {
    //     newActivity.activity_status_id = ActivityStatus.Answered;

    //   } else {

    //     newActivity.activity_status_id = ActivityStatus.Done;

    //   }

    // } else {
    //   if (this.newActivityForm.get(['type_id'])?.value == ActivityTypes.Call) {
    //     newActivity.activity_status_id = ActivityStatus.NotAnswered;

    //   }
    //   else if (this.newActivityForm.get(['type_id'])?.value == ActivityTypes.Meeting && newActivity.activity_status_id == ActivityStatus.Pending) {

    //     newActivity.activity_status_id = ActivityStatus.Cancelled;
    //   }

    // }

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
          'status': null,
          'activity_start_date': null,
          'activity_end_date': null,
          'duration': null,
          'description': null
        })
        this.getContactActivities();
        this.leadDetailsLoading = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.leadDetailsLoading = false;
    })

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



  getSelectedActivity(selectedActivity) {
    let activityName = ''
    switch (selectedActivity) {
      case ActivityTypes.Call:
        activityName = 'Call'
        break;
      case ActivityTypes.SendEmail:
        activityName = 'Send Email'
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

  markAsDone(activity: LeadsAndContactsActivity) {
    this.leadDetailsLoading = true;
    activity.activity_status_id = ActivityStatus.Done
    this._db.updateLeadAndContactActivity(activity).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getContactActivities();
        this.leadDetailsLoading = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.leadDetailsLoading = false;
    })
  }

  markAsUnDone(activity: LeadsAndContactsActivity) {
    this.leadDetailsLoading = true;
    if (activity.activity_type_id != ActivityTypes.Call && activity.activity_type_id != ActivityTypes.Meeting) {
      activity.activity_status_id = ActivityStatus.Pending;
      activity.activity_status_name = 'Pending';

    }
    else {
      if (activity.activity_type_id == ActivityTypes.Call) {
        activity.activity_status_id = ActivityStatus.NotAnswered;
        activity.activity_status_name = 'Not Answered';

      }
      if (activity.activity_type_id == ActivityTypes.Meeting) {
        activity.activity_status_id = ActivityStatus.Cancelled;
        activity.activity_status_name = 'Cancelled';

      }
    }
    this._db.updateLeadAndContactActivity(activity).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getContactActivities();
        this.leadDetailsLoading = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.leadDetailsLoading = false;
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

  displayFn(partner: Partner): string {
    return partner && partner.partner_name ? partner.partner_name : '';
  }

  getFromHTML(e) {
    if (!!e.option.value) {
      this.changePartnerForm.patchValue({
        'partner_id': e.option.value
      })
    }
  }

  private _filter(title: string): Partner[] {
    const filterValue = title.toLowerCase();
    const filteredData = this.allPartners.filter(option => option.partner_name.toLowerCase().includes(filterValue));
    if (filteredData.length == 0) {
      this.addNewOrgnization = true;
    } else {
      this.addNewOrgnization = false;
    }
    return this.allPartners.filter(option => option.partner_name.toLowerCase().includes(filterValue));
  }


  getAllCampaigns() {
    this._db.getAllCampaigns().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.allCampaign = res['data']
      }
    })
  }


  getAllPartners() {
    this._db.getAllPartners(true).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.allPartners = res['data']
        this.filteredOptions = this.changePartnerForm.get(['partner_id'])?.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' || typeof value === 'undefined' ? value : value.partner_name),
          map(partner_name => partner_name ? this._filter(partner_name) : this.allPartners.slice())
        );
      }
    })
  }


  addPartner(partner_name) {
    const part: Partner = {
      'partner_name': partner_name,
      'is_org': true
    }
    this._db.createPartner(part).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this._db.getAllPartners(true).subscribe(allRes => {
          if (allRes['status'] == ResStatus.CRUD) {
            this.allPartners = allRes['data']
            this.changePartnerForm.patchValue({
              'partner_id': res['data']
            })
            this.newOrgAdded = true;
            this.addNewOrgnization = false;
          }
        })
      }
    })
  }

  /* ======================================= Close Lead Section ======================================== */



  won() {
    this.currentLeadDetails.lead_sub_status_id = CloseLeadSubStatus.WON
    this.newValue = this.currentLeadDetails.lead_sub_status_id
    this.saveEditLead('lead_sub_status_id')
  }

  lost() {
    this._notify.openDialog(
      'Mark As Lost?',
      `Are you sure you want to Mark As Lost?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.currentLeadDetails.lead_sub_status_id = CloseLeadSubStatus.LOST
          this.newValue = this.currentLeadDetails.lead_sub_status_id
          this.saveEditLead('lead_sub_status_id')
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });

  }

  convertToLead() {
    this._notify.openDialog(
      'Convert To Lead?',
      `Are you sure you want to Convert To Lead?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.currentLeadDetails.lead_sub_status_id = '4'
          this.newValue = this.currentLeadDetails.lead_sub_status_id
          this.saveEditLead('lead_sub_status_id')
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });

  }

  archive() {
    this.currentLeadDetails.lead_sub_status_id = CloseLeadSubStatus.Archive
    this.newValue = this.currentLeadDetails.lead_sub_status_id
    this.saveEditLead('lead_sub_status_id')
  }

  reopen() {
    this.currentLeadDetails.lead_sub_status_id = this.currentLeadDetails.prev_lead_sub_status_id;
    this.newValue = this.currentLeadDetails.lead_sub_status_id ? this.currentLeadDetails.lead_sub_status_id : '';
    this.saveEditLead('lead_sub_status_id')
  }

  /* ======================================= File Attach Section ======================================== */
  myUploader(event) {
    this.leadDetailsLoading = true;
    const fd: FormData = new FormData()
    fd.append('contact_lead_id', this.currentLeadDetails.id || '');
    if (!!event.files && event.files.length > 0) {
      for (let file of event.files) {
        fd.append('contact_lead_attach[]', file);
      }
    }
    this._db.uploadContactLeadAttach(fd).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getCurrentLeadAttaches();
        this.leadDetailsLoading = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.leadDetailsLoading = false;
    })
  }


  deleteAttach(attach: any) {
    this.leadDetailsLoading = true;

    this._db.deleteLeadAttaches(attach.id).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getCurrentLeadAttaches();
        this.leadDetailsLoading = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.leadDetailsLoading = false;
    })
  }


  /* ======================================= Request For POC Section ======================================== */



  addProcess() {
    const newG = new FormGroup({
      process_title: new FormControl('', Validators.required),
      process_description: new FormControl(''),
      process_department: new FormControl('', Validators.required)
    })
    this.process.push(newG);
  }

  delProcess(i) {
    this.process.removeAt(i);
  }

  openRequestForPOCModal() {
    this.leadDetailsLoading = true;
    this.getRequestForPOCStatus();
    this.getRequestForPOCPriority();
    this.getAllProducts();

  }

  getRequestForPOCStatus() {
    this._db.getRequestForPOCStatus().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.requestForPocStatus = res['data']
      } else {
        this.requestForPocStatus = []
      }
    }, err => {
      console.log(err);
      this.requestForPocStatus = []
    })
  }

  getRequestForPOCPriority() {
    this._db.getRequestForPOCPriority().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.requestForPocPriority = res['data']
        this.leadDetailsLoading = false;
      } else {
        this.requestForPocStatus = []
        this.leadDetailsLoading = false;
      }
    }, err => {
      console.log(err);
      this.requestForPocStatus = []
      this.leadDetailsLoading = false;

    })

  }

  imagesupload(event: any) {
    this.requestForPOCAttaches = [];
    if (event.target.files) {
      // this.urls = [];
      for (let i = 0; i < event.target.files.length; i++) {
        this.requestForPOCAttaches.push(event.target.files[i])
        var reader = new FileReader()
        reader.readAsDataURL(event.target.files[i])
        // reader.onload = (event: any) => {
        //   // this.urls.push(event.target.result);
        // }
      }
    }
  }

  deleteIMG(i) {
    this.requestForPOCAttaches.splice(i, 1)
  }

  requestForPOC() {
    this.leadDetailsLoading = true;

    const fd: FormData = new FormData()
    fd.append('contact_lead_id', this.currentLeadDetails.id || '');
    fd.append('request_poc_title', this.requestPOCForm.get(['title'])?.value);
    fd.append('description', this.requestPOCForm.get(['description'])?.value);
    fd.append('product_id', this.requestPOCForm.get(['product_id'])?.value);
    fd.append('request_poc_status_id', PocRequestStatus.Pending_On_CEO);
    fd.append('request_poc_priority_id', this.requestPOCForm.get(['request_poc_priority_id'])?.value);

    if (!!this.requestForPOCAttaches && this.requestForPOCAttaches.length > 0) {
      for (let file of this.requestForPOCAttaches) {
        fd.append('request_poc_attach[]', file);
      }
    }

    if (!!this.requestPOCForm.get(['process'])?.value && this.requestPOCForm.get(['process'])?.value.length > 0) {
      for (let poc of this.requestPOCForm.get(['process'])?.value) {
        const newP: ProcessDetails = {
          'process_title': poc.process_title,
          'process_description': poc.process_description,
          'process_department': poc.process_department,
        }
        fd.append('request_poc_process[]', JSON.stringify(newP));
      }
    }

    this._db.createRequestForPOC(fd).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.requestPOCForm.reset();
        this.requestForPOCAttaches = [];
        // this.urls = [];
        this.leadDetailsLoading = false;
        this.newValue = '6'
        this.saveEditLead('lead_sub_status_id')
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      }
    }, err => {
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.leadDetailsLoading = false;
    })
  }

  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.label === o2.label : o2 === o2;
  }


  /* ======================================= Action On Request For POC Section ======================================== */

  openActionForm(req: PocRequests, myaction: string) {
    this.action = myaction;
    this.requestPOCActionForm.patchValue({
      'request_poc_id': req.id,
      'request_poc_priority_id': req.request_poc_priority_id
    })

    if (this.action == 'approve') {
      this.requestPOCActionForm.controls['poc'].patchValue({
        'title': req.request_poc_title,
        'desc': req.description,
        'budget': this.currentLeadDetails.cost,
        'type': '1',
        'partner': this.currentLeadDetails.partner_id
      })

      this.getAllPartners();

      this._auth.getAllUsers().subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.allUsers = res['data']
          this.getPms();
          this.getDevs();
          this.gettechLeads();
        }
      })
    }


  }


  requestPOCAction() {
    this.leadDetailsLoading = true;

    const fd: FormData = new FormData()
    fd.append('request_poc_id', this.requestPOCActionForm.get(['request_poc_id'])?.value);
    fd.append('request_poc_priority_id', this.requestPOCActionForm.get(['request_poc_priority_id'])?.value);
    fd.append('comment', this.requestPOCActionForm.get(['comment'])?.value);
    if (!!this.requestForPOCAttaches && this.requestForPOCAttaches.length > 0) {
      for (let file of this.requestForPOCAttaches) {
        fd.append('poc_action_attach[]', file);
      }
    }

    switch (this.action) {
      case 'sendToCTO':
        fd.append('request_poc_status_id', PocRequestStatus.Pending_On_CTO);
        break;
      case 'sendToCEO':
        fd.append('request_poc_status_id', PocRequestStatus.Pending_On_CEO);
        break;
      case 'Re-Edit':
        fd.append('request_poc_status_id', PocRequestStatus.Re_Edit);
        break;
      case 'reject':
        fd.append('request_poc_status_id', PocRequestStatus.Rejected);
        break;
      case 'approve':
        fd.append('request_poc_status_id', PocRequestStatus.Approved);


        fd.append('contact_lead_id', this.currentLeadDetails.id || '');
        fd.append('project_title', this.requestPOCActionForm.controls['poc'].get(['title'])?.value);
        fd.append('partner_id', this.requestPOCActionForm.controls['poc'].get(['partner'])?.value);
        fd.append('project_status_id', Status.SCHEDULED);
        fd.append('project_start_date', `${this._db.getDateFormatted(this.requestPOCActionForm.controls['poc'].get(['start_date'])?.value)}`);
        fd.append('project_end_date', `${this._db.getDateFormatted(this.requestPOCActionForm.controls['poc'].get(['end_date'])?.value)}`);
        fd.append('project_duration', this.requestPOCActionForm.controls['poc'].get(['duration'])?.value);



        let projectTeam: ProjectTeam[] = [];


        if (!!this.requestPOCActionForm.controls['poc'].get(['pm'])?.value) {
          const pmStructure: ProjectTeam = {
            user_team_id: this.requestPOCActionForm.controls['poc'].get(['pm'])?.value,
            project_structure_id: ProjectStructure.Project_Manager
          }
          projectTeam.push(pmStructure)
        }

        if (!!this.requestPOCActionForm.controls['poc'].get(['tl'])?.value) {
          const pmStructure: ProjectTeam = {
            user_team_id: this.requestPOCActionForm.controls['poc'].get(['tl'])?.value,
            project_structure_id: ProjectStructure.Tech_Lead
          }
          projectTeam.push(pmStructure)
        }

        if (!!this.requestPOCActionForm.controls['poc'].get(['ba'])?.value) {
          const bas = this.requestPOCActionForm.controls['poc'].get(['ba'])?.value;
          for (let i in bas) {
            const pmStructure: ProjectTeam = {
              user_team_id: bas[i],
              project_structure_id: ProjectStructure.Analysis
            }
            projectTeam.push(pmStructure)
          }
        }


        if (!!this.requestPOCActionForm.controls['poc'].get(['devs'])?.value) {
          const devs = this.requestPOCActionForm.controls['poc'].get(['devs'])?.value;
          for (let i in devs) {
            const pmStructure: ProjectTeam = {
              user_team_id: devs[i],
              project_structure_id: ProjectStructure.Developer
            }
            projectTeam.push(pmStructure)
          }
        }

        if (!!projectTeam && projectTeam.length > 0) {
          fd.append('project_team', JSON.stringify(projectTeam));
        }

        break;
    }



    if (this.action == 'approve') {
      this._db.ApprovePOCRequest(fd).subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.requestPOCForm.reset();
          this.requestPOCActionForm.reset();
          this.requestForPOCAttaches = [];
          this.leadDetailsLoading = false;
          this.getCurrentLeadPOCRequests();
        } else {
          this._notify.openSnackbar('Error', SnackBarState.Error)
          this.leadDetailsLoading = false;
        }
      }, err => {
        console.log(err);
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      })
    } else {

      this._db.POCRequestAction(fd).subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.requestPOCForm.reset();
          this.requestPOCActionForm.reset();
          this.requestForPOCAttaches = [];
          this.leadDetailsLoading = false;
          this.getCurrentLeadPOCRequests();
        } else {
          this._notify.openSnackbar('Error', SnackBarState.Error)
          this.leadDetailsLoading = false;
        }
      }, err => {
        console.log(err);
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      })
    }

  }

  getPms() {
    this.PMs = this.allUsers.filter(u => u.accPosition == AccountPositions.MANAGER)
  }
  getDevs() {
    this.devs = this.allUsers.filter(u => u.department == Department.TECHNICAL_TEAM)
    this.BAs = this.allUsers.filter(u => u.department == Department.TECHNICAL_TEAM)
  }

  gettechLeads() {
    this.TLeads = this.allUsers.filter(u => u.department == Department.TECHNICAL_TEAM && u.accPosition == AccountPositions.Team_Leader)
  }

  endDateCalculation() {
    const startDate = this.requestPOCActionForm.controls['poc'].get(['start_date'])?.value
    const duration = this.requestPOCActionForm.controls['poc'].get(['duration'])?.value
    this.requestPOCActionForm.controls['poc'].patchValue({
      'end_date': this.dCalc.projectEndDateCalculation(startDate, duration)
    })
  }




  closeContact(lead_sub_status_id: string) {
    this.leadDetailsLoading = true;
    let editParams: { [k: string]: any } = {}

    switch (lead_sub_status_id) {
      case ('11'):
        editParams.lead_sub_status_id = CloseLeadSubStatus.Archive;
        break;
      case ('12'):
        editParams.lead_sub_status_id = CloseLeadSubStatus.Not_Interested;
        break;
      case ('14'):
        editParams.lead_sub_status_id = CloseLeadSubStatus.Disqualified;
        break;
    }


    this._db.updateContactLead(this.currentLeadDetails.id || '', editParams).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getCurrentLeadDetails();
        this.leadDetailsLoading = false;
      } else {
        this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`, SnackBarState.Warning, 5000)
        this.leadDetailsLoading = false;
      }
    }, err => {
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)
      this.leadDetailsLoading = false;
    })
  }


  updatePocRequest(req: PocRequests) {
    this.getAllProducts();
    this.getRequestForPOCPriority();
    this.requestPOCForm.patchValue({
      'product_id': req.product_id,
      'title': req.request_poc_title,
      'description': req.description,
      'request_poc_priority_id': req.request_poc_priority_id
    })
  }

  deletePocRequest(req: PocRequests) {

  }


  deleteContact() {
    this.leadDetailsLoading = true;

    this._db.deleteContactLead(this.currentLeadDetails.id || '').subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.leadDetailsLoading = false;
        this._router.navigate(['/CRM/leads'])
      } else {
        this.leadDetailsLoading = false;
        this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`, SnackBarState.Warning, 5000)
      }
    }, err => {
      this.leadDetailsLoading = false;

      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)
    })
  }

  getColor(request_poc_status_id) {
    switch (request_poc_status_id) {
      case PocRequestStatus.Approved:
        return '#0f0'
      case PocRequestStatus.Pending_On_CEO:
        return 'rgb(108, 117, 125)'
      case PocRequestStatus.Pending_On_CTO:
        return 'rgb(108, 117, 125)'
      case PocRequestStatus.Re_Edit:
        return 'rgb(108, 117, 125)'
      case PocRequestStatus.Rejected:
        return '#f00'
      default:
        return '#000'
    }
  }

  deleteActivity(act: LeadsAndContactsActivity) {
    this.leadDetailsLoading = true;
    this._notify.openDialog(
      'Delete Activity?',
      `Are you sure you want to delete This Activity?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deleteActivity(act.id || '').subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this.getContactActivities()
              this.leadDetailsLoading = false;
              this._notify.openSnackbar(`Request Deleted Successfully`, SnackBarState.Success)
            } else {
              this.leadDetailsLoading = false;
            }
          })
        } else {
          this.leadDetailsLoading = false;
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }

  editActivity(act: LeadsAndContactsActivity) {
    this.activityOnEditMOde = true;
    this.openActivityForm = true;
    this.activeItem = this.items[1];
    this.activityToEdit = act;
    console.log(act.activity_start_date);

    this.newActivityForm.patchValue({
      'type_id': act.activity_type_id.toString(),
      'comment': act.comment,
      'start_date': this._db.getDateTimeFormattedForInputs(act.from_date),
      'end_date': this._db.getDateTimeFormattedForInputs(act.to_date),
      'status': act.activity_status_id.toString(),


    })

    if (act.activity_type_id == ActivityTypes.Call || act.activity_type_id == ActivityTypes.Meeting) {
      console.log(act, this.newActivityForm.value);
      this.newActivityForm.patchValue({
        'activity_day_date': this._db.getDateFormattedYearMonthDay(act.activity_start_date || act.from_date) || null,
        'activity_start_date': this._db.getTimeFormatted(act.activity_start_date || act.from_date) || null,
        'activity_end_date': act.activity_end_date ? this._db.getDateTimeFormattedForInputs(act.activity_end_date) : null,
        'duration': act.activity_type_id == ActivityTypes.Meeting ? act.duration : 0,
        'description': act.description
      })
    }

  }

  saveEditActivity() {

    this.leadDetailsLoading = true;


    if (this.activityToEdit) {
      let activity_start_date = `${this.newActivityForm.get('activity_day_date')?.value}T${this.newActivityForm.get('activity_start_date')?.value}`;
      let endDateTime = this._db.addDurationToTime(
        activity_start_date,
        this.newActivityForm.get('duration')?.value || 0
      )

      console.log(activity_start_date, endDateTime);


      this.activityToEdit.activity_status_id = this.newActivityForm.get(['status'])?.value;
      this.activityToEdit.activity_type_id = this.newActivityForm.get(['type_id'])?.value;
      this.activityToEdit.comment = this.newActivityForm.get(['comment'])?.value;
      this.activityToEdit.from_date = this._db.getDateTimeFormatted(this.newActivityForm.get(['start_date'])?.value);
      this.activityToEdit.to_date = this._db.getDateTimeFormatted(this.newActivityForm.get(['end_date'])?.value);
      this.activityToEdit.contact_lead_id = this.currentLeadDetails.id || '';
      this.activityToEdit.lead_sub_status_id = this.currentLeadDetails.lead_sub_status_id;

      //new fields for calls and meetings
      if (this.activityToEdit.activity_type_id == ActivityTypes.Call || this.activityToEdit.activity_type_id == ActivityTypes.Meeting) {

        this.activityToEdit.activity_start_date = this._db.getDateTimeFormatted(activity_start_date)
        this.activityToEdit.activity_end_date = this._db.getDateTimeFormatted(endDateTime)
        this.activityToEdit.duration = this.newActivityForm.get(['duration'])?.value;
        this.activityToEdit.description = this.newActivityForm.get(['description'])?.value;
      }

      console.log(this.activityToEdit);



      if (!this.activityToEdit.comment) {
        this.activityToEdit.comment = this.getSelectedActivity(this.newActivityForm.get(['type_id'])?.value)
      }

      this._db.updateLeadAndContactActivity(this.activityToEdit).subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.newActivityForm.patchValue({
            'type_id': ActivityTypes.Call,
            'comment': this.getSelectedActivity(ActivityTypes.Call),
            'start_date': null,
            'end_date': null,
            'status': null
          })
          this.getContactActivities();
          this.leadDetailsLoading = false;
          this.activityOnEditMOde = false;
          this.activityToEdit = undefined;

        } else {
          this._notify.openSnackbar('Error', SnackBarState.Error)
          this.leadDetailsLoading = false;
        }
      }, err => {
        console.log(err);
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      })
    }
  }

  submitSaveActivityForm() {
    if (!this.newActivityForm.get('start_date')?.value || !this.newActivityForm.get('end_date')?.value) {
      this._notify.openSnackbar('Start Date and End Date are required', SnackBarState.Warning, 5000)
      return;
    }

    if (this.activityOnEditMOde == true) {
      this.saveEditActivity()
    } else {
      this.addActivity();
    }
  }


  getMyOrgContacts() {
    this.leadDetailsLoading = true;
    if (this.currentUser.department == Department.MANAGEMENT || this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER) {
      this._db.getOrgContact(this.currentLeadDetails.partner_id || '').subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myPersonContacts = res['data'];
          this.leadDetailsLoading = false;
        } else {
          this.myPersonContacts = []
          this.leadDetailsLoading = false;
        }
      }, err => {
        this.myPersonContacts = []
        this.leadDetailsLoading = false;
      })
    } else {
      this._db.getMyOrgContact(this.currentLeadDetails.partner_id || '').subscribe(res => {
        console.log(res);
        if (res['status'] == ResStatus.CRUD) {
          this.myPersonContacts = res['data'];
          this.leadDetailsLoading = false;
        } else {
          this.myPersonContacts = []
          this.leadDetailsLoading = false;
        }
      }, err => {
        this.myPersonContacts = []
        this.leadDetailsLoading = false;
      })
    }
  }

  filterContacts(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.myPersonContacts.length; i++) {
      let country = this.myPersonContacts[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredContacts = filtered;
  }

  /* ======================================= Request For RFP Section ======================================== */

  getMyRFPConfigList() {
    if (this.currentUser.department == Department.Business_Development && this.currentUser.accPosition != AccountPositions.MANAGER) {
      this._auth.getUserByFilter(Department.Business_Development, undefined, AccountPositions.MANAGER).subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myRFPConfigList = res['data'];
        } else {
          this.myRFPConfigList = []
        }
      }, err => {
        this.myRFPConfigList = []
      })
    } else if (this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER) {
      this._auth.getUserByFilter(Department.MANAGEMENT, AccountRoles.CEO).subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myRFPConfigList = res['data'];
        } else {
          this.myRFPConfigList = []
        }
      }, err => {
        this.myRFPConfigList = []
      })
    } else if (this.currentUser.department == Department.MANAGEMENT) {
      this._auth.getUserByFilter(Department.Business_Development).subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myRFPConfigList = res['data'];
          this._auth.getUserByFilter(Department.MANAGEMENT).subscribe(res2 => {
            if (res2['status'] == ResStatus.CRUD) {
              const myres2 = res2['data'];
              myres2.map(r => this.myRFPConfigList.push(r))
            } else {
              this.myRFPConfigList = []
            }
          }, err2 => {
            this.myRFPConfigList = []
          })
        } else {
          this.myRFPConfigList = []
        }
      }, err => {
        this.myRFPConfigList = []
      })
    }

  }

  requestForRFP() {
    this.leadDetailsLoading = true;

    const fd: FormData = new FormData()
    fd.append('contact_lead_id', this.currentLeadDetails.id || '');
    fd.append('request_rfp_title', this.requestRFPForm.get(['title'])?.value);
    // fd.append('request_rfp_status_id', this.requestRFPForm.get(['comment'])?.value);


    fd.append('approval_ids', this.requestRFPForm.get(['approval_ids'])?.value);


    if (!!this.requestRFPForm.get(['comment'])?.value) {
      fd.append('comment', this.requestRFPForm.get(['comment'])?.value);
    }

    // if(!!this.requestRFPForm.get(['approval_ids'])?.value){
    //   const approvalARR = this.requestRFPForm.get(['approval_ids'])?.value;
    //   for (let u of approvalARR) {
    //     fd.append('approval_ids[]', u);
    //   }
    // }

    if (!!this.requestForRFPAttaches && this.requestForRFPAttaches.length > 0) {
      for (let file of this.requestForRFPAttaches) {
        fd.append('request_rfp_attach[]', file);
      }
    }

    this._db.createRFPRequest(fd).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.requestRFPForm.reset();
        this.requestForRFPAttaches = [];
        this.leadDetailsLoading = false;
        this.newValue = '7'
        this.saveEditLead('lead_sub_status_id')
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.leadDetailsLoading = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.leadDetailsLoading = false;
    })
  }


  RFPimagesupload(event: any) {
    this.requestForRFPAttaches = [];
    if (event.target.files) {
      // this.urls = [];
      for (let i = 0; i < event.target.files.length; i++) {
        this.requestForRFPAttaches.push(event.target.files[i])
        var reader = new FileReader()
        reader.readAsDataURL(event.target.files[i])
      }
    }
  }

  RFPdeleteIMG(i) {
    this.requestForRFPAttaches.splice(i, 1)
  }


  getRFPRequestsByLeadID() {
    this._db.getRFPRequestsByLeadID(this.currentLeadDetails.id || '').subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.rfpRequests = res['data'];
      } else {
        this.rfpRequests = [];
      }
    }, err => {
      this.rfpRequests = [];
    })
  }

  openRFPActionForm(req: RFPRequests, myaction: boolean) {
    this.getMyRFPConfigList();
    this.requestRFPActionForm.patchValue({
      'request_rfp_id': req.id,
      'action': myaction
    })
  }
  requestRFPAction() {
    if (this.requestRFPActionForm.get(['action'])?.value == true) {
      if (this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER) {
        this._db.actionONRFPRequests(this.requestRFPActionForm.get(['request_rfp_id'])?.value, RFPRequestStatus.Pending, this.requestRFPActionForm.get(['assignTo'])?.value.join(','), this.requestRFPActionForm.get(['comment'])?.value).subscribe(res => {
          this.getRFPRequestsByLeadID();
          this.requestRFPActionForm.reset();
        })
      } else if (this.currentUser.department == Department.MANAGEMENT) {
        this._db.actionONRFPRequests(this.requestRFPActionForm.get(['request_rfp_id'])?.value, RFPRequestStatus.Approved, undefined, this.requestRFPActionForm.get(['comment'])?.value).subscribe(res => {
          this.getRFPRequestsByLeadID();

          this.requestRFPActionForm.reset();
        })
      }
    } else {
      this._db.actionONRFPRequests(this.requestRFPActionForm.get(['request_rfp_id'])?.value, RFPRequestStatus.Rejected, undefined, this.requestRFPActionForm.get(['comment'])?.value).subscribe(res => {
        this.getRFPRequestsByLeadID();
        this.requestRFPActionForm.reset();
      })
    }
  }


  ifForMe(req: RFPRequests) {
    const pen = req.pending
    const me = pen?.find(u => u == this.currentUser.key)
    if (!!me) {
      return true;
    } else {
      return false;
    }
  }


  getColorForRFP(rfp_status_id) {
    switch (rfp_status_id) {
      case RFPRequestStatus.Approved:
        return '#0f0'
      case RFPRequestStatus.Pending:
        return 'rgb(108, 117, 125)'
      case RFPRequestStatus.Rejected:
        return '#f00'
      default:
        return '#000'
    }
  }
  receiveData(data: LeadsAndContacts) {
    this.currentLeadDetails = data;
  }

  activityTypeChanged(type: any) {
    console.log(type);
    let activityType = type.value as ActivityTypes
    switch (activityType) {
      case ActivityTypes.Call:
        this.newActivityForm.patchValue({
          status: this.ActivityStatusEnum.Pending
        })
        break;
      case ActivityTypes.Meeting:
        this.newActivityForm.patchValue({
          status: this.ActivityStatusEnum.Scheduled
        })
        break;
      default:
        this.newActivityForm.patchValue({
          status: this.ActivityStatusEnum.Pending
        })
        break;
    }

    console.log(this.newActivityForm.value);


  }
}
