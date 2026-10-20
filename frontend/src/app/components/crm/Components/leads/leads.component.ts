import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivityStatus, ActivityTypes, CloseLeadSubStatus, Contacts, Currency, Labels, LeadsAndContacts, LeadsAndContactsActivity, LeadsAndContactsStatus, LeadsAndContactsSubStatus, LeadsAndContactsTypes } from 'src/app/interfaces/leadsAndContacts';
import { Products } from 'src/app/interfaces/products';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Department, MobileNumber, OrganizationTypes, Partner, PartnerIndustry, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { map, startWith } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { CurrencyModule } from 'src/app/interfaces/currency.module';
import { Campaign } from 'src/app/interfaces/campaign';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit {
  CurrencyList = CurrencyModule.CurrencyList;
  filteredCurrency: any[];

  @ViewChild('mymodal') modal;

  AccountRoles = AccountRoles;
  salesTeam: User[] = [];
  contactStatus: LeadsAndContactsStatus[] = [];
  contactSubStatus: LeadsAndContactsSubStatus[] = [];
  contactTypes: LeadsAndContactsTypes[] = [];
  allCampaign: Campaign[] = [];
  products: Products[] = [];
  lables: Labels[] = [];

  openFormLoading: boolean = false;
  sidebarDisplay: boolean = false;
  contactToShow: LeadsAndContacts;
  myContacts: LeadsAndContacts[] = [];
  personContacts: Contacts[] = [];

  currentUser: User;

  filteredOptions: Observable<Partner[]> | undefined;
  allPartners: Partner[] = [];

  addNewOrgnization: boolean = false;
  newOrgAdded: boolean = false;
  subStatusLoading: boolean = false;
  emailOnEditMode: boolean = false;
  addLead = false;
  newContactForm: FormGroup = new FormGroup({
    'campaign_id': new FormControl(null),
    'partner_id': new FormControl(null),
    'sales_id': new FormControl(null),
    // 'status_id':new FormControl(null),
    'substatus_id': new FormControl(1, Validators.required),
    'contact_id': new FormControl(null, Validators.required),
    'type_id': new FormControl(null, Validators.required),
    'product_id': new FormControl(null),
    'title': new FormControl(null, Validators.required),
    'notes': new FormControl(null, Validators.required),
    'cost': new FormControl(null),
    'labels': new FormControl(null),
    'selectedCurrency': new FormControl(this.CurrencyList[0]),
  })

  newLeadForm: FormGroup = new FormGroup({
    'campaign_id': new FormControl(null),
    'lead_sub_status_id': new FormControl(null),
    'contact_lead_id': new FormControl(null),
    'partner_id': new FormControl(null),
    'sales_id': new FormControl(null),
    'type_id': new FormControl(null, Validators.required),
    'product_id': new FormControl(null),
    'title': new FormControl(null, Validators.required),
    // 'address':new FormControl(null),
    // 'phone':new FormControl(null),
    'notes': new FormControl(null, Validators.required),
    'cost': new FormControl(null),
    // 'Email':new FormControl(null),
    'labels': new FormControl(null),
    'expected_close_date': new FormControl(new Date()),
    'selectedCurrency': new FormControl(null),
  })

  // contactPhones:MobileNumber[] = [{phone:'',phone_type:'Work'}];
  departmentEnum = Department;
  AccountPositionsEnum = AccountPositions;
  CloseLeadSubStatusEnum = CloseLeadSubStatus;

  nameOnEditMode: boolean = false;
  labelOnEditMode: boolean = false;
  salesOnEditMode: boolean = false;
  phoneOnEditMode: boolean[] = [];
  organizationOnEditMode: boolean = false;
  productOnEditMode: boolean = false;
  typeOnEditMode: boolean = false;
  addressOnEditMode: boolean = false;
  costOnEditMode: boolean = false;
  notesOnEditMode: boolean = false;
  contactOnEditMode: boolean = false;
  campaignOnEditMode: boolean = false;

  myLeadActivites: LeadsAndContactsActivity[] = [];
  ActivityStatusEnum = ActivityStatus;
  ActivityTypesEnum = ActivityTypes;
  plannedActivity: LeadsAndContactsActivity[] = [];
  doneActivity: LeadsAndContactsActivity[] = [];
  items: MenuItem[];
  activeItem: MenuItem;
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
  activityOnEditMOde: boolean = false;
  activityToEdit: LeadsAndContactsActivity | undefined;
  contactLoader: boolean = false;
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
  openNotesForm: boolean = false;
  openActivityForm: boolean = true;

  allSales: User[] = [];

  newPartnerForm: FormGroup = new FormGroup({
    'partner_name': new FormControl(null, Validators.required),
    'partner_address': new FormControl(null),
    'partner_description': new FormControl(null),
    'partner_photoURL': new FormControl(null),
    'industry': new FormControl(null, Validators.required),
    'email': new FormControl(null),
    'phone': new FormControl(null),
    'country': new FormControl(this.CurrencyList[0].countryCode),
    'organize_type_id': new FormControl(null),
    'website': new FormControl(null),
    'sales_id': new FormControl(null),
  })
  partnerIndustry: PartnerIndustry[] = [];
  newPartnerFormopened: boolean = false;

  allView: boolean = true;
  archiveView: boolean = false;


  myPersonContacts: Contacts[] = [];
  filteredContacts: any[];

  contactLoading: boolean = false;
  newContactFormopened: boolean = false;

  newPersonContactForm: FormGroup = new FormGroup({
    'name': new FormControl(null, Validators.required),
    'partner_id': new FormControl(null, Validators.required),
    'email': new FormControl(null),
    'address': new FormControl(null),
    'title': new FormControl(null),
    'phones': new FormArray([
      new FormGroup({
        'phone': new FormControl(null, Validators.required),
        'phone_type': new FormControl(null, Validators.required),
        'extend': new FormControl(null),
      })
    ])
  })
  phones = this.newPersonContactForm.get('phones') as FormArray;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.Egypt,
    CountryISO.UnitedStates,
  ];

  organizationTypes: OrganizationTypes[] = [];
  costDetailsFormOpened: boolean = false;

  constructor(private _db: DatabaseService,
    private _auth: AuthApiService,
    private _notify: NotificationService) { }


  ngOnInit(): void {

    // console.log(this.c.EGP);

    this.items = [
      { label: 'Notes', icon: 'pi pi-fw pi-book' },
      { label: 'Activity', icon: 'pi pi-fw pi-calendar-plus' },
      // {label: 'Email', icon: 'pi pi-fw pi-envelope'},
    ];
    this.activeItem = this.items[0]

    this._auth.user.subscribe(user => {
      this.currentUser = user;
      this.getMyContacts();
      this.getContactStatus();
    })
  }
  filterCurrency(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.CurrencyList.length; i++) {
      let country = this.CurrencyList[i];
      if (country.currencyName.toLowerCase().indexOf(query.toLowerCase()) == 0 || country.currencyCode.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredCurrency = filtered;
  }

  getAllOrganizationTypes() {
    this._db.getAllOrganizationTypes().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.organizationTypes = res['data']
      } else {
        this.organizationTypes = [];
      }
    }, err => {
      this.organizationTypes = [];
    })
  }

  getMyOrgContacts() {
    this.contactLoading = true;
    if (this.currentUser.department == Department.MANAGEMENT || this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER) {
      this._db.getOrgContact(this.newContactForm.get(['partner_id'])?.value.id).subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myPersonContacts = res['data'];
          this.contactLoading = false;
        } else {
          this.myPersonContacts = []
          this.contactLoading = false;
        }
      }, err => {
        this.myPersonContacts = []
        this.contactLoading = false;
      })
    } else {
      this._db.getMyOrgContact(this.newContactForm.get(['partner_id'])?.value.id).subscribe(res => {
        console.log(res);
        if (res['status'] == ResStatus.CRUD) {
          this.myPersonContacts = res['data'];
          this.contactLoading = false;
        } else {
          this.myPersonContacts = []
          this.contactLoading = false;
        }
      }, err => {
        this.myPersonContacts = []
        this.contactLoading = false;
      })
    }
  }



  addQuickNote() {
    this.contactLoader = true;

    const newActivity: LeadsAndContactsActivity = {
      activity_status_id: ActivityStatus.Done,
      activity_type_id: ActivityTypes.Notes,
      comment: this.newActivityForm.get(['comment'])?.value,
      from_date: this._db.getDateTimeFormatted(new Date()),
      to_date: this._db.getDateTimeFormatted(new Date()),
      contact_lead_id: this.contactToShow.id || '',
      lead_sub_status_id: this.contactToShow.lead_sub_status_id
    }

    if (!newActivity.comment) {
      this.contactLoader = false;
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
        this.contactLoader = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.contactLoader = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.contactLoader = false;
    })

  }


  addQuickActivity(addHours: string) {
    this.contactLoader = true;

    const newActivity: LeadsAndContactsActivity = {
      activity_status_id: ActivityStatus.Pending,
      activity_type_id: this.newActivityForm.get(['type_id'])?.value,
      comment: this.newActivityForm.get(['comment'])?.value,
      from_date: this._db.getDateTimeFormatted(this.getDateAfter(addHours)),
      to_date: this._db.getDateTimeFormatted(this.getDateAfter(addHours)),
      contact_lead_id: this.contactToShow.id || '',
      lead_sub_status_id: this.contactToShow.lead_sub_status_id
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
        this.contactLoader = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.contactLoader = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.contactLoader = false;
    })

  }

  addActivity() {
    this.contactLoader = true;

    const newActivity: LeadsAndContactsActivity = {
      activity_status_id: this.newActivityForm.get(['status'])?.value,
      activity_type_id: this.newActivityForm.get(['type_id'])?.value,
      comment: this.newActivityForm.get(['comment'])?.value,
      from_date: this._db.getDateTimeFormatted(this.newActivityForm.get(['start_date'])?.value),
      to_date: this._db.getDateTimeFormatted(this.newActivityForm.get(['end_date'])?.value),
      contact_lead_id: this.contactToShow.id || '',
      lead_sub_status_id: this.contactToShow.lead_sub_status_id

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
          'status': null
        })
        this.getContactActivities();
        this.contactLoader = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.contactLoader = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.contactLoader = false;
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

  getMyArchivedContacts() {
    // isLead
    this._db.getContactLeadByStatus(CloseLeadSubStatus.Archive).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.myContacts = res['data']
        this.contactLoader = false;
      } else {
        this.myContacts = [];
        this.contactLoader = false;
      }
    }, err => {
      this.myContacts = [];
      this.contactLoader = false;
    })
    // if(this.currentUser.department == Department.MANAGEMENT|| this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER){

    // }else{
    // }
  }

  getMyContacts() {
    this.contactLoader = true;
    if (this.currentUser.department == Department.MANAGEMENT || this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER) {
      this._db.getAllContacts().subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myContacts = res['data']
          this.myContacts.forEach(a => a.next_action_date = new Date(a.next_action_date ? a.next_action_date : new Date()));
          this.contactLoader = false;
        } else {
          this.myContacts = [];
          this.contactLoader = false;

        }
      }, err => {
        console.log(err);
        this.contactLoader = false;
        this.myContacts = [];
      })
    } else if (this.currentUser.department == Department.Business_Development && this.currentUser.accRole == AccountRoles.SALES) {
      this._db.getMyContacts().subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myContacts = res['data']
          this.contactLoader = false;

        } else {
          this.myContacts = [];
          this.contactLoader = false;

        }
      }, err => {
        console.log(err);
        this.contactLoader = false;
        this.myContacts = [];
      })
    } else if (this.currentUser.department == Department.Business_Development && this.currentUser.accRole == AccountRoles.MARKITING) {
      this._db.getMyContacts().subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myContacts = res['data']
          this.contactLoader = false;

        } else {
          this.myContacts = [];
          this.contactLoader = false;

        }
      }, err => {
        console.log(err);
        this.contactLoader = false;
        this.myContacts = [];
      })
    } else {
      this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms => {
        if (perms['status'] == ResStatus.CRUD) {
          const userPerms = perms['data'];
          const checking = userPerms.find(p => p.permission_id == 15)
          if (!!checking) {
            this._db.getAllContacts().subscribe(res => {
              if (res['status'] == ResStatus.CRUD) {
                this.myContacts = res['data']
                this.myContacts.forEach(a => a.next_action_date = new Date(a.next_action_date ? a.next_action_date : new Date()));
                this.contactLoader = false;
              } else {
                this.myContacts = [];
                this.contactLoader = false;

              }
            }, err => {
              console.log(err);
              this.contactLoader = false;
              this.myContacts = [];
            })
          }
        }
      }, err => {
        console.log(err);
      })
    }

  }

  showContactDetails(contact: LeadsAndContacts) {
    this.sidebarDisplay = true;
    this.contactToShow = contact;
    // if(!!this.contactToShow.phone){
    //   this.contactToShow.phone.map(p=>this.phoneOnEditMode.push(false))
    // }
    this.getContactActivities();
  }


  getContactActivities() {
    this._db.getLeadAndContactActivity(this.contactToShow.id || '').subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.myLeadActivites = res['data'];
        this.doneActivity = this.myLeadActivites.filter(a => a.activity_status_id == ActivityStatus.Done)
        this.doneActivity.push({
          activity_status_id: ActivityStatus.Done,
          activity_type_id: ActivityTypes.Other,
          comment: `${this.contactToShow.user_creator_name} → Lead created`,
          contact_lead_id: this.contactToShow.id || '',
          from_date: this.contactToShow.created_at || '',
          to_date: this.contactToShow.created_at || '',
        })
        this.plannedActivity = this.myLeadActivites.filter(a => a.activity_status_id == ActivityStatus.Pending)
      } else {
        this.doneActivity = [{
          activity_status_id: ActivityStatus.Done,
          activity_type_id: ActivityTypes.Other,
          comment: `${this.contactToShow.user_creator_name} → Lead created`,
          contact_lead_id: this.contactToShow.id || '',
          from_date: this.contactToShow.created_at || '',
          to_date: this.contactToShow.created_at || '',
        }];
        this.plannedActivity = [];
      }
    }, err => {
      console.log(err);
    })
  }



  markAsDone(activity: LeadsAndContactsActivity) {
    this.contactLoader = true;
    activity.activity_status_id = ActivityStatus.Done
    this._db.updateLeadAndContactActivity(activity).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getContactActivities();
        this.contactLoader = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.contactLoader = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.contactLoader = false;
    })
  }

  markAsUnDone(activity: LeadsAndContactsActivity) {
    this.contactLoader = true;
    activity.activity_status_id = ActivityStatus.Pending
    this._db.updateLeadAndContactActivity(activity).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getContactActivities();
        this.contactLoader = false;
      } else {
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.contactLoader = false;
      }
    }, err => {
      console.log(err);
      this._notify.openSnackbar('Error', SnackBarState.Error)
      this.contactLoader = false;
    })
  }

  editPhone(i) {
    this.phoneOnEditMode[i] = !this.phoneOnEditMode[i]
  }

  // addPhone(){
  //   this.contactPhones.push({phone:'',phone_type:'Work'})
  // }

  // deletePhone(index){
  //   this.contactPhones.splice(index,1)
  // }





  openAddContactForm() {
    this.openFormLoading = true;
    this.getAllPartners()
    this.openSalesEdit();
    this.getAllProducts();
    this.openEditLabel();
    this.getAllTypes();
    this.getAllCampaigns();

    // this.getLeadSubStatusByStatus('2')
    this.newContactForm.patchValue({
      'substatus_id': '4',
      'selectedCurrency': this.CurrencyList[0]
    })

    this.openFormLoading = false;

  }

  openConvertTOLeadForm() {
    this.openFormLoading = true;
    this.getLeadSubStatusByStatus('3')
    this.getAllPartners()
    this.openSalesEdit();
    this.getAllProducts();
    this.openEditLabel();
    this.getAllTypes();
    this.getAllCampaigns();
    // if(!!this.contactToShow.phone){
    //   this.contactPhones = this.contactToShow.phone;
    // }else{
    //   this.contactPhones = []
    // }
    this.newLeadForm.patchValue({
      'campaign_id': this.contactToShow.campagin_id,
      'contact_lead_id': this.contactToShow.id,
      'lead_sub_status_id': '5',
      'partner_id': this.contactToShow.partner_id,
      'sales_id': this.contactToShow.sales_id,
      'type_id': this.contactToShow.lead_type_id,
      'product_id': this.contactToShow.product_id,
      'title': this.contactToShow.title,
      'notes': this.contactToShow.notes,
      'cost': this.contactToShow.cost,
      'labels': this.contactToShow.label,
      'expected_close_date': this.contactToShow.expected_close_date,
      'selectedCurrency': this.CurrencyList.find(c => c.currencyCode == this.contactToShow.currency)
    })
    this.openFormLoading = false;
  }

  getAllTypes() {
    this._db.getAllContactAndLeadTypes().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.contactTypes = res['data']
      }
    })
  }

  getAllCampaigns() {
    this._db.getAllCampaigns().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.allCampaign = res['data']
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

  getAllSales() {
    this._auth.getUserByFilter(Department.Business_Development, AccountRoles.SALES).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.allSales = res['data']
      } else {
        this.allSales = [];
      }
    }, err => {
      this.allSales = [];
    })

  }

  getContactStatus() {
    this._db.getContactStatus().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.contactStatus = res['data']
        // this.contactStatus.map(m=>this.contactStatus.push(m))
        if (this.contactStatus.length > 2) {
          // this.contactStatus.splice(0,2)
        }
      } else {
        this.contactStatus = []
      }
    })
  }

  getMyContcats() {
    if (this.currentUser.department == Department.MANAGEMENT) {
      this._db.getOrgContact(this.contactToShow.partner_id || '').subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.personContacts = res['data'];
        } else {
          this.personContacts = []
        }
      }, err => {
        this.personContacts = []
      })
    } else {
      this._db.getMyOrgContact(this.contactToShow.partner_id || '').subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.personContacts = res['data'];
        } else {
          this.personContacts = []
        }
      }, err => {
        this.personContacts = []
      })
    }
  }


  getAllPartners() {
    if (this.currentUser.department == Department.MANAGEMENT || this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER) {
      this._db.getAllPartners(true).subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.allPartners = res['data']
          this.filteredOptions = this.newContactForm.get(['partner_id'])?.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' || typeof value === 'undefined' ? value : value.partner_name),
            map(partner_name => partner_name ? this._filter(partner_name) : this.allPartners.slice())
          );
        } else {
          this.allPartners = [];
          this.filteredOptions = this.newContactForm.get(['partner_id'])?.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' || typeof value === 'undefined' ? value : value.partner_name),
            map(partner_name => partner_name ? this._filter(partner_name) : this.allPartners.slice())
          );
        }
      })
    } else {
      this._db.getMyPartners().subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.allPartners = res['data']
          this.filteredOptions = this.newContactForm.get(['partner_id'])?.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' || typeof value === 'undefined' ? value : value.partner_name),
            map(partner_name => partner_name ? this._filter(partner_name) : this.allPartners.slice())
          );
        } else {
          this.allPartners = [];
          this.filteredOptions = this.newContactForm.get(['partner_id'])?.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' || typeof value === 'undefined' ? value : value.partner_name),
            map(partner_name => partner_name ? this._filter(partner_name) : this.allPartners.slice())
          );
        }
      })
    }
  }

  getLeadSubStatusByStatus(status_id: string) {
    this.subStatusLoading = true;
    this._db.getLeadAndContactSubStatus(status_id).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.contactSubStatus = res['data']
        this.subStatusLoading = false;

      } else {
        this.contactSubStatus = [];
        this.subStatusLoading = false;

      }
    }, err => {
      this.subStatusLoading = false;
    })
  }

  validateConvertToLead() {
    this.convertToLead()
  }

  validateRequest() {
    this.addContact();

    // if((this.contactPhones.length < 1 || this.contactPhones[0].phone.length < 10) && !this.newContactForm.get(['Email'])?.value){
    //   this._notify.openSnackbar(`Please Enter At least one communication methon` , SnackBarState.Warning , 5000)
    // }else{
    //   this.addContact()
    // }
  }

  addContact() {
    const newContact: LeadsAndContacts = {
      title: this.newContactForm.get(['title'])?.value,
      lead_type_id: this.newContactForm.get(['type_id'])?.value,
      notes: this.newContactForm.get(['notes'])?.value,
      contact_id: this.newContactForm.get(['contact_id'])?.value.id,
    }

    if (!!this.newContactForm.get(['campaign_id'])?.value) {
      newContact['campaign_id'] = this.newContactForm.get(['campaign_id'])?.value;
    }

    if (!!this.newContactForm.get(['product_id'])?.value) {
      newContact['product_id'] = this.newContactForm.get(['product_id'])?.value;
    }


    if (!!this.newContactForm.get(['substatus_id'])?.value) {
      newContact['lead_sub_status_id'] = this.newContactForm.get(['substatus_id'])?.value;
    }

    if (!!this.newContactForm.get(['sales_id'])?.value) {
      newContact['sales_id'] = this.newContactForm.get(['sales_id'])?.value;
    }

    if (!!this.newContactForm.get(['partner_id'])?.value) {
      newContact['partner_id'] = this.newContactForm.get(['partner_id'])?.value.id;
    }

    // if(!!this.newContactForm.get(['address'])?.value){
    //   newContact['address'] = this.newContactForm.get(['address'])?.value;
    // }

    if (!!this.newContactForm.get(['cost'])?.value) {
      newContact['cost'] = this.newContactForm.get(['cost'])?.value;
    }

    if (!!this.newContactForm.get(['selectedCurrency'])?.value) {
      newContact['currency'] = this.newContactForm.get(['selectedCurrency'])?.value.currencyCode;
    }

    // if(!!this.newContactForm.get(['Email'])?.value){
    //   newContact['email'] = this.newContactForm.get(['Email'])?.value;
    // }

    if (!!this.newContactForm.get(['labels'])?.value) {
      newContact['label'] = this.newContactForm.get(['labels'])?.value;
    }


    // if(!!this.contactPhones && this.contactPhones.length > 0){
    //   for (let i=0;i < this.contactPhones.length ; i++){
    //     if(this.contactPhones[i].phone.length < 8){
    //       this.contactPhones.splice(i,1)
    //     }
    //   }

    //   newContact['phone'] = this.contactPhones;
    // }

    if (this.currentUser.accRole == AccountRoles.SALES || this.currentUser.accRole == AccountRoles.MARKITING) {
      newContact.sales_id = this.currentUser.key
    }

    this._db.createNewContact(newContact).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.newContactForm.reset();
        // this.contactPhones= [{phone:'',phone_type:'Work'}];
        this.addNewOrgnization = false;
        this.newOrgAdded = false;
        this.subStatusLoading = false;
        this.getMyContacts();
      } else {
        this._notify.openSnackbar(`Error, ${JSON.stringify(res['data'])}`, SnackBarState.Warning, 5000)
      }
    }, err => {
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)

    })

  }

  displayFn(partner: Partner): string {
    return partner && partner.partner_name ? partner.partner_name : '';
  }

  getFromHTML(e) {
    if (!!e.option.value) {
      this.newContactForm.patchValue({
        'partner_id': e.option.value
      })
      this.getMyOrgContacts();
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

  getAllPartnerIndustry() {
    this._db.getPartnersIndustry().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.partnerIndustry = res['data']
      }
    })
  }

  openAddPartnerForm(partner_name) {
    this.getAllPartnerIndustry();
    this.getAllOrganizationTypes();
    if (this.currentUser.department == Department.MANAGEMENT || (this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER)) {
      this.getAllSales();
    }
    this.newPartnerForm.patchValue({
      'partner_name': partner_name
    });
  }

  addPartner() {
    // const part:Partner = {
    //   'partner_name':this.newPartnerForm.get(['partner_name'])?.value,
    //   'partner_industry_id':this.newPartnerForm.get(['industry'])?.value,
    //   'partner_address':this.newPartnerForm.get(['address'])?.value,
    //   'partner_description':this.newPartnerForm.get(['description'])?.value,
    //   'is_org':true,
    // }
    const newPartner: Partner = {
      partner_name: this.newPartnerForm.get(['partner_name'])?.value,
      is_org: true
    }
    if (!!this.newPartnerForm.get(['partner_address'])?.value) {
      newPartner.partner_address = this.newPartnerForm.get(['partner_address'])?.value
    }

    if (!!this.newPartnerForm.get(['partner_description'])?.value) {
      newPartner.partner_description = this.newPartnerForm.get(['partner_description'])?.value
    }

    if (!!this.newPartnerForm.get(['partner_photoURL'])?.value) {
      newPartner.partner_photoURL = this.newPartnerForm.get(['partner_photoURL'])?.value
    }

    if (!!this.newPartnerForm.get(['industry'])?.value) {
      newPartner.partner_industry_id = this.newPartnerForm.get(['industry'])?.value
    }
    if (!!this.newPartnerForm.get(['email'])?.value) {
      newPartner.email = this.newPartnerForm.get(['email'])?.value
    }
    if (!!this.newPartnerForm.get(['phone'])?.value) {
      newPartner.phone = this.newPartnerForm.get(['phone'])?.value
    }

    if (!!this.newPartnerForm.get(['country'])?.value) {
      newPartner.country = this.newPartnerForm.get(['country'])?.value
    }
    if (!!this.newPartnerForm.get(['organize_type_id'])?.value) {
      newPartner.organize_type_id = this.newPartnerForm.get(['organize_type_id'])?.value
    }
    if (!!this.newPartnerForm.get(['website'])?.value) {
      newPartner.website = this.newPartnerForm.get(['website'])?.value
    }

    if (this.currentUser.department == Department.MANAGEMENT || (this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER)) {
      if (!!this.newPartnerForm.get(['sales_id'])?.value) {
        newPartner.sales_id = this.newPartnerForm.get(['sales_id'])?.value
      }
    } else {
      newPartner.sales_id = this.currentUser.key
    }

    this._db.createPartner(newPartner).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this._db.getAllPartners(true).subscribe(allRes => {
          if (allRes['status'] == ResStatus.CRUD) {
            this.allPartners = allRes['data']
            this.newContactForm.patchValue({
              'partner_id': res['data']
            })
            this.newOrgAdded = true;
            this.addNewOrgnization = false;
            this.newPartnerFormopened = false;
          }
        })
      }
    })
  }


  getStatusColor(s_id): string {
    switch (s_id) {
      case '1':
        return 'bg-label-info'
      case '2':
        return 'bg-label-danger'
      default:
        return 'bg-label-warn'
    }

  }


  cancelEdit() {
    this.nameOnEditMode = false;
    this.labelOnEditMode = false;
    this.salesOnEditMode = false;
    this.emailOnEditMode = false;
    this.phoneOnEditMode = [];
    this.organizationOnEditMode = false;
    this.productOnEditMode = false;
    this.typeOnEditMode = false;
    this.addressOnEditMode = false;
    this.costOnEditMode = false;
    this.notesOnEditMode = false;
    this.campaignOnEditMode = false;

    // this.selectSteps(0);
    this._db.getContactByID(this.contactToShow.id || '').subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.contactToShow = res['data'];
        const i = this.myContacts.findIndex(c => c.id == this.contactToShow.id);
        this.myContacts[i] = this.contactToShow;
        // this.selectSteps(this.contactStatus.findIndex(s=>s.id == this.contactToShow.status_id));
      }
    })
  }

  // addPhoneNewNumber(){
  //   this.contactToShow.phone?.push({phone:'',phone_type:'Work'})
  //   this.phoneOnEditMode.push(false)
  // }

  // delPhone(i){
  //   this.phoneOnEditMode.splice(i,1)
  //   this.contactToShow.phone?.splice(i,1)
  //   this.savContactEdit('phone')
  // }

  openEditLabel() {
    this._db.getAllLables().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.lables = res['data']
      }
    })
  }
  openSalesEdit() {
    this._auth.getUserByFilter(Department.Business_Development, AccountRoles.SALES).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.salesTeam = res['data']
      }
    })
  }
  savContactEdit(paramName: string) {
    let editParams: { [k: string]: any } = {}
    switch (paramName) {
      case 'campagin_id':
        editParams.campagin_id = this.contactToShow.campagin_id;
        break;
      case 'title':
        editParams.title = this.contactToShow.title;
        break;
      case 'label':
        editParams.label = this.contactToShow.label;
        break;
      case 'sales_id':
        editParams.sales_id = this.contactToShow.sales_id;
        break;
      // case 'email':
      //   editParams.email = this.contactToShow.email;
      //   break;
      // case 'phone':
      //   editParams.phone = this.contactToShow.phone
      //   break;
      case 'partner_id':
        editParams.partner_id = this.contactToShow.partner_id;
        editParams.contact_id = this.contactToShow.contact_id;
        break;
      case 'status_id':
        editParams.status_id = this.contactToShow.status_id
        break;
      case 'product_id':
        editParams.product_id = this.contactToShow.product_id
        break;
      case 'lead_type_id':
        editParams.lead_type_id = this.contactToShow.lead_type_id
        break;
      // case 'address':
      //   editParams.address = this.contactToShow.address
      //   break;
      case 'cost':
        editParams.cost = this.contactToShow.cost
        editParams.currency = this.contactToShow.currency
        break;
      case 'notes':
        editParams.notes = this.contactToShow.notes
        break;
    }
    this._db.updateContactLead(this.contactToShow.id || '', editParams).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.cancelEdit();
      } else {
        this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`, SnackBarState.Warning, 5000)
      }
    }, err => {
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)
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
    this.newLeadForm.patchValue({
      'lead_sub_status_id': this.contactSubStatus[index].id
    })
  }

  convertToLead() {
    let editParams: { [k: string]: any } = {}
    editParams.isLead = true;
    editParams.campagin_id = this.newLeadForm.get(['campagin_id'])?.value;
    editParams.lead_sub_status_id = this.newLeadForm.get(['lead_sub_status_id'])?.value;
    editParams.title = this.newLeadForm.get(['title'])?.value;
    editParams.lead_type_id = this.newLeadForm.get(['type_id'])?.value;
    editParams.notes = this.newLeadForm.get(['notes'])?.value;
    editParams.product_id = this.newLeadForm.get(['product_id'])?.value;
    editParams.sales_id = this.newLeadForm.get(['sales_id'])?.value;
    editParams.partner_id = this.newLeadForm.get(['partner_id'])?.value;
    editParams.contact_id = this.newLeadForm.get(['contact_id'])?.value;
    // editParams.address = this.newLeadForm.get(['address'])?.value;
    // editParams.email = this.newLeadForm.get(['Email'])?.value;
    editParams.label = this.newLeadForm.get(['label'])?.value;
    editParams.cost = this.newLeadForm.get(['cost'])?.value;
    if (!!this.newLeadForm.get(['expected_close_date'])?.value) {
      editParams.expected_close_date = this._db.getDateFormatted(this.newLeadForm.get(['expected_close_date'])?.value);
    }


    // if(!!this.contactPhones && this.contactPhones.length > 0){
    //   for (let i=0;i < this.contactPhones.length ; i++){
    //     if(this.contactPhones[i].phone.length < 8){
    //       this.contactPhones.splice(i,1)
    //     }
    //   }
    //   editParams.phone = this.contactPhones;
    // }


    this._db.updateContactLead(this.newLeadForm.get(['contact_lead_id'])?.value, editParams).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.sidebarDisplay = false;
        this.getMyContacts();
        this.newLeadForm.reset();
      } else {
        this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`, SnackBarState.Warning, 5000)
      }
    }, err => {
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)
    })
  }

  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.label === o2.label : o2 === o2;
  }


  selectActiveTab(tab) {
    this.activeItem = tab.activeItem
  }



  getSideWidth() {
    if (window.screen.width >= 992) {
      return `70vw`;
    } else if (window.screen.width >= 768) {
      return `90vw`;
    } else {
      return `95vw`;
    }
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


  archiveContact(id) {
    this.contactLoader = true;

    let editParams: { [k: string]: any } = {}
    editParams.lead_sub_status_id = CloseLeadSubStatus.Archive;
    this._db.updateContactLead(id, editParams).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.sidebarDisplay = false;
        this.getMyContacts();
        this.newLeadForm.reset();
        this.contactLoader = false;

      } else {
        this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`, SnackBarState.Warning, 5000)
        this.contactLoader = false;

      }
    }, err => {
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)
      this.contactLoader = false;

    })
  }


  deleteContact(id) {
    this.contactLoader = true;
    this._db.deleteContactLead(id).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.sidebarDisplay = false;
        this.getMyContacts();
        this.newLeadForm.reset();
        this.contactLoader = false;

      } else {
        this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`, SnackBarState.Warning, 5000)
        this.contactLoader = false;

      }
    }, err => {
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)
      this.contactLoader = false;

    })
  }

  reopen(contact: LeadsAndContacts) {
    this.contactLoader = true;
    let editParams: { [k: string]: any } = {}
    editParams.lead_sub_status_id = contact.prev_lead_sub_status_id;
    this._db.updateContactLead(contact.id || '', editParams).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.sidebarDisplay = false;
        if (this.allView) {
          this.getMyContacts();
        } else if (this.archiveView) {
          this.getMyArchivedContacts();
        }
        this.newLeadForm.reset();
        this.contactLoader = false;
      } else {
        this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`, SnackBarState.Warning, 5000)
        this.contactLoader = false;
      }
    }, err => {
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)
      this.contactLoader = false;

    })
  }

  changeView(viewOpt: string) {
    this.contactLoader = true;
    if (viewOpt == 'all') {
      this.allView = true;
      this.archiveView = false;
      document.getElementById('allView')?.classList.add('viewActive')
      document.getElementById('archView')?.classList.remove('viewActive')
      this.getMyContacts();
      // this.contactLoader = false;
    } else if (viewOpt == 'arch') {
      this.archiveView = true;
      this.allView = false;
      document.getElementById('archView')?.classList.add('viewActive')
      document.getElementById('allView')?.classList.remove('viewActive')
      this.getMyArchivedContacts();

    }
  }


  deleteActivity(act: LeadsAndContactsActivity) {
    this.contactLoader = true;
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
              this.contactLoader = false;
              this._notify.openSnackbar(`Request Deleted Successfully`, SnackBarState.Success)
            } else {
              this.contactLoader = false;
            }
          })
        } else {
          this.contactLoader = false;
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }

  editActivity(act: LeadsAndContactsActivity) {
    this.openActivityForm = true;
    this.activityOnEditMOde = true;
    this.activeItem = this.items[1];
    this.activityToEdit = act;
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
    this.contactLoader = true;
    if (!!this.activityToEdit) {
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
      this.activityToEdit.contact_lead_id = this.contactToShow.id || '';
      this.activityToEdit.lead_sub_status_id = this.contactToShow.lead_sub_status_id;

      //new fields for calls and meetings
      if (this.activityToEdit.activity_type_id == ActivityTypes.Call || this.activityToEdit.activity_type_id == ActivityTypes.Meeting) {

        this.activityToEdit.activity_start_date = this._db.getDateTimeFormatted(activity_start_date)
        this.activityToEdit.activity_end_date = this._db.getDateTimeFormatted(endDateTime)
        this.activityToEdit.duration = this.newActivityForm.get(['duration'])?.value;
        this.activityToEdit.description = this.newActivityForm.get(['description'])?.value;
      }

      console.log(this.activityToEdit);

      // if (this.newActivityForm.get(['status'])?.value == true) {

      //   if (this.newActivityForm.get(['type_id'])?.value == this.ActivityTypesEnum.Call) {
      //     this.activityToEdit.activity_status_id = ActivityStatus.Answered;

      //   } else {

      //     this.activityToEdit.activity_status_id = ActivityStatus.Done;
      //   }

      // } else {

      //   if (this.newActivityForm.get(['type_id'])?.value == this.ActivityTypesEnum.Call) {
      //     this.activityToEdit.activity_status_id = ActivityStatus.NotAnswered;

      //   }
      //   else if (this.newActivityForm.get(['type_id'])?.value == ActivityTypes.Meeting &&
      //     this.activityToEdit.activity_status_id == ActivityStatus.Pending) {

      //     this.activityToEdit.activity_status_id = ActivityStatus.Scheduled;
      //   }

      // }

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
          this.contactLoader = false;
          this.activityOnEditMOde = false;
          this.activityToEdit = undefined;
        } else {
          this._notify.openSnackbar('Error', SnackBarState.Error)
          this.contactLoader = false;
        }
      }, err => {
        console.log(err);
        this._notify.openSnackbar('Error', SnackBarState.Error)
        this.contactLoader = false;
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


  addPhone() {
    const newG = new FormGroup({
      'phone': new FormControl(null, Validators.required),
      'phone_type': new FormControl(null, Validators.required),
      'extend': new FormControl(null),
    })
    this.phones.push(newG);
  }

  delPhone(i) {
    this.phones.removeAt(i);
  }


  openNewContactForm() {
    this.newPersonContactForm.patchValue({
      'partner_id': this.newContactForm.get(['partner_id'])?.value.id
    })
  }

  createNewContact() {

    this.contactLoader = true;
    const newPersonContact: Contacts = {
      partner_id: this.newPersonContactForm.get(['partner_id'])?.value,
      name: this.newPersonContactForm.get(['name'])?.value,
    }

    if (this.newPersonContactForm.get(['email'])?.value) {
      newPersonContact.email = this.newPersonContactForm.get(['email'])?.value
    }

    if (this.newPersonContactForm.get(['address'])?.value) {
      newPersonContact.address = this.newPersonContactForm.get(['address'])?.value
    }

    if (this.newContactForm.get(['title'])?.value) {
      newPersonContact.title = this.newPersonContactForm.get(['title'])?.value
    }

    if (!!this.newPersonContactForm.get(['phones'])?.value && this.newPersonContactForm.get(['phones'])?.value.length > 0) {
      const myphones: MobileNumber[] = [];
      for (let phone of this.newPersonContactForm.get(['phones'])?.value) {
        const newP: MobileNumber = {
          phone: phone.phone.number,
          phone_type: phone.phone_type,
          country_code: phone.phone.dialCode
        }

        if (!!phone.extend) {
          newP.extend = phone.extend;
        }
        myphones.push(newP)
      }
      newPersonContact.phone = myphones;
    }

    this._db.createNewPersonContact(newPersonContact).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this._notify.openSnackbar(`success`, SnackBarState.Success)
        this.newContactFormopened = false;
        this.getMyOrgContacts();
        this.newContactForm.patchValue({
          'contact_id': res['data']['id']
        })

        this.newPersonContactForm.reset()
        this.contactLoader = false;
      } else {
        this._notify.openSnackbar(`something wrong!`, SnackBarState.Warning, 7000)
        this.contactLoader = false;
      }
    }, err => {
      this._notify.openSnackbar(`Error! ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 7000)
      this.contactLoader = false;
    })

  }

  clear(table: Table) {
    table.clear();
  }
  receiveData(data: LeadsAndContacts) {
    this.contactToShow = data;
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
