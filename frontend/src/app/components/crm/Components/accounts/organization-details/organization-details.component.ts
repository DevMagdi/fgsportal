import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Campaign } from 'src/app/interfaces/campaign';
import { CurrencyModule } from 'src/app/interfaces/currency.module';
import { Contacts, Labels, LeadsAndContacts, LeadsAndContactsSubStatus, LeadsAndContactsTypes, LeadsAndContactsActivity } from 'src/app/interfaces/leadsAndContacts';
import { Products } from 'src/app/interfaces/products';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Department, MobileNumber, OrganizationTypes, Partner, PartnerIndustry, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { DurationCalculationService } from 'src/app/services/duration-calculation.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss']
})
export class OrganizationDetailsComponent implements OnInit {
  CurrencyList = CurrencyModule.CurrencyList;

  orgDetailsLoading: boolean = false;
  currentOrgDetails: Partner;
  currentUser: User;
  AccountRoleEnum = AccountRoles;
  departmentEnum = Department;
  AccountPositionsEnum = AccountPositions;
  salesTeam: User[] = [];
  items: MenuItem[];
  partnerIndustry: PartnerIndustry[] = [];
  organizationTypes: OrganizationTypes[] = [];
  subStatusLoading: boolean = false;
  contactSubStatus: LeadsAndContactsSubStatus[] = [];
  contactTypes: LeadsAndContactsTypes[] = [];
  products: Products[] = [];
  allCampaign: Campaign[] = [];

  contactLoading: boolean = false;
  myPersonContacts: Contacts[] = [];
  newContactFormopened: boolean = false;
  newPersonContactForm: FormGroup = new FormGroup({
    'name': new FormControl(null, Validators.required),
    // 'partner_id':new FormControl(null, Validators.required),
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

  filteredContacts: any[];
  activeLeadCurrency: string[] = [];
  lables: Labels[] = [];
  isLead: boolean = false;

  newValue: string | number | Date | boolean = '';
  editName: boolean = false;
  editDescription: boolean = false;
  editOwner: boolean = false;
  editIndustry: boolean = false;
  editType: boolean = false;
  editCountry: boolean = false;
  editAddress: boolean = false;
  editEmail: boolean = false;
  editPhone: boolean = false;
  editWebsite: boolean = false;

  sidebarDisplay = false;
  oopDisplay = false;
  newLeadForm: FormGroup = new FormGroup({
    'lead_sub_status_id': new FormControl(null),
    'contact_lead_id': new FormControl(null),
    'contact_id': new FormControl(null),
    'campaign_id': new FormControl(null),
    'sales_id': new FormControl(null),
    'type_id': new FormControl(null, Validators.required),
    'product_id': new FormControl(null),
    'title': new FormControl(null, Validators.required),
    'notes': new FormControl(null, Validators.required),
    'cost': new FormControl(null),
    'labels': new FormControl(null),
    'expected_close_date': new FormControl(new Date()),
    'selectedCurrency': new FormControl(this.CurrencyList[0]),
  })

  myOpps: LeadsAndContacts[] = [];
  myLeads: LeadsAndContacts[] = [];
  leadActivities: LeadsAndContactsActivity[] = [];

  imgOnEditMode: boolean = false;
  newavatar: File | undefined;
  url: string = '';
  newServerApi = environment.newServerApi;
  showActivityForm: boolean = false;

  constructor(private _db: DatabaseService,
    private _auth: AuthApiService,
    private _notify: NotificationService,
    private route: ActivatedRoute,
    private dCalc: DurationCalculationService,
    private _router: Router) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user => {
      this.currentUser = user;
      this.getcurrentOrgDetails();
    })

    this.items = [
      {
        label: 'Add New Opportunity', command: () => {
          // this.update();
          document.getElementById('openAddOppModal')?.click();
        }
      },
      {
        label: 'Add New Lead', command: () => {
          document.getElementById('openAddLeadModal')?.click();
        }
      },
      {
        label: 'Add New Contact', command: () => {
          document.getElementById('openAddContactModal')?.click();
        }
      },
    ];
  }

  getOrgLeadsAndOpportunities() {
    this._db.getLeadsByPartnerID(this.currentOrgDetails.id || '').subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        const resData: LeadsAndContacts[] = res['data'];
        this.myOpps = resData.filter(c => c.isLead == '1')
        this.myLeads = resData.filter(c => c.isLead == '0')
      } else {
        this.myOpps = [];
        this.myLeads = [];
      }
    }, err => {
      this.myOpps = [];
      this.myLeads = [];
    })
  }


  getcurrentOrgDetails() {
    this.orgDetailsLoading = true;
    const OrgID = this.route.snapshot.params.id;
    this._db.getPartnerByID(OrgID).subscribe(res => {
      this.orgDetailsLoading = false;
      if (res['status'] == ResStatus.CRUD) {
        this.currentOrgDetails = res['data'];
        this.getMyOrgContacts();
        this.getOrgLeadsAndOpportunities();
        this.GetLeadActivities(OrgID);
      }
    }, err => {
      this.orgDetailsLoading = false;
    })
  }

  cancelEdit() {
    this.newValue = '';
    this.editName = false;
    this.editDescription = false;
    this.editOwner = false;
    this.editIndustry = false;
    this.editType = false;
    this.editCountry = false;
    this.editAddress = false;
    this.editEmail = false;
    this.editPhone = false;
    this.editWebsite = false;
    // this.editCost= false;
    // this.editProduct= false;
    // this.editContact= false;
    // this.phoneOnEditMode = [];
    // this.editPartner = false;
    // this.editLabels = false;
    // this.editDate = false;
    // this.orgDetailsLoading = false;
    // this.editCampaign = false;
  }

  openEditCurrentOrgDetails(editedField: string) {
    this.cancelEdit();

    switch (editedField) {
      case 'name':
        this.editName = true;
        this.newValue = this.currentOrgDetails.partner_name;
        break
      case 'sales_id':
        this.editOwner = true;
        this.newValue = this.currentOrgDetails.sales_id || '';
        this.getSalesTeam()
        break

      case 'industry':
        this.editIndustry = true;
        this.newValue = this.currentOrgDetails.partner_industry_id || '';
        this.getAllPartnerIndustry();
        break
      case 'type':
        this.editType = true;
        this.newValue = this.currentOrgDetails.organize_type_id || '';
        this.getAllOrganizationTypes();
        break
      case 'country':
        this.editCountry = true;
        this.newValue = this.currentOrgDetails.country || '';
        break
      case 'address':
        this.editAddress = true;
        this.newValue = this.currentOrgDetails.partner_address || '';
        break
      case 'email':
        this.editEmail = true;
        this.newValue = this.currentOrgDetails.email || '';
        break
      case 'phone':
        this.editPhone = true;
        this.newValue = this.currentOrgDetails.phone || '';
        break

      case 'website':
        this.editWebsite = true;
        this.newValue = this.currentOrgDetails.website || '';
        break

      case 'description':
        this.editDescription = true;
        this.newValue = this.currentOrgDetails.partner_description || '';
        break
    }
  }


  saveEditOrg(editedField: string) {
    this.orgDetailsLoading = true;

    let editParams: { [k: string]: any } = {}
    switch (editedField) {
      case 'name':
        editParams.partner_name = this.newValue;
        break;
      case 'sales_id':
        editParams.sales_id = this.newValue;
        break;
      case 'is_org':
        editParams.is_org = this.newValue;
        break;
      case 'partner_industry_id':
        editParams.partner_industry_id = this.newValue;
        break;
      case 'organize_type_id':
        editParams.organize_type_id = this.newValue;
        break;
      case 'country':
        editParams.country = this.newValue;
        break;
      case 'partner_address':
        editParams.partner_address = this.newValue;
        break;
      case 'email':
        editParams.email = this.newValue;
        break;
      case 'phone':
        editParams.phone = this.newValue;
        break;
      case 'website':
        editParams.website = this.newValue;
        break;
      case 'partner_description':
        editParams.partner_description = this.newValue;
        break;
    }
    this._db.editSpecificPartnerData(this.currentOrgDetails.id || '', editParams).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getcurrentOrgDetails();
        this.cancelEdit();
        this._notify.openSnackbar('Done', SnackBarState.Success);
      } else {
        this._notify.openSnackbar(`Warning, ${JSON.stringify(res['data'])}`, SnackBarState.Warning, 5000)
        this.orgDetailsLoading = false;
      }
    }, err => {
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)
      this.orgDetailsLoading = false;

    })
  }


  getSalesTeam() {
    this._auth.getUserByFilter(Department.Business_Development, AccountRoles.SALES).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.salesTeam = res['data']
      }
    })
  }


  switchIsOrg() {
    this._notify.openDialog(
      `Mark As ${this.currentOrgDetails.is_org == '1' ? 'Client' : 'Not Client'}?`,
      `Are you sure you want to Mark As ${this.currentOrgDetails.is_org == '1' ? 'Client' : 'Not Client'}?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          if (this.currentOrgDetails.is_org == '1') {
            this.currentOrgDetails.is_org = '0'
          } else {
            this.currentOrgDetails.is_org = '1'
          }
          this.newValue = this.currentOrgDetails.is_org
          this.saveEditOrg('is_org')
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }

  deletePart() {
    this._notify.openDialog(
      'Delete Organization?',
      `Are you sure you want to delete This Organization?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deletePartner(this.currentOrgDetails.id || '').subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this._notify.openSnackbar(`Organization Deleted Successfully`, SnackBarState.Success)
              this._router.navigate(['/CRM/accounts'])
            }
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }


  getAllPartnerIndustry() {
    this._db.getPartnersIndustry().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.partnerIndustry = res['data']
      } else {
        this.partnerIndustry = [];
      }
    }, err => {
      this.partnerIndustry = [];
    })
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



  getCountry(cc: string) {
    return this.CurrencyList.find(c => c.countryCode == cc)
  }

  createNewLead() {
    this.orgDetailsLoading = true;
    const newContact: LeadsAndContacts = {
      title: this.newLeadForm.get(['title'])?.value,
      lead_type_id: this.newLeadForm.get(['type_id'])?.value,
      notes: this.newLeadForm.get(['notes'])?.value,
      isLead: !this.isLead,
      contact_id: this.newLeadForm.get(['contact_id'])?.value.id,
      partner_id: this.currentOrgDetails.id
    }

    if (!!this.newLeadForm.get(['campaign_id'])?.value) {
      newContact['campaign_id'] = this.newLeadForm.get(['campaign_id'])?.value;
    }
    if (!!this.newLeadForm.get(['product_id'])?.value) {
      newContact['product_id'] = this.newLeadForm.get(['product_id'])?.value;
    }


    if (!!this.newLeadForm.get(['lead_sub_status_id'])?.value) {
      newContact['lead_sub_status_id'] = this.newLeadForm.get(['lead_sub_status_id'])?.value;
    }

    if (!!this.newLeadForm.get(['sales_id'])?.value) {
      newContact['sales_id'] = this.newLeadForm.get(['sales_id'])?.value;
    }

    if (!!this.newLeadForm.get(['partner_id'])?.value) {
      newContact['partner_id'] = this.newLeadForm.get(['partner_id'])?.value.id;
    }

    if (!!this.newLeadForm.get(['cost'])?.value) {
      newContact['cost'] = this.newLeadForm.get(['cost'])?.value;
    }

    if (!!this.newLeadForm.get(['selectedCurrency'])?.value) {
      newContact['currency'] = this.newLeadForm.get(['selectedCurrency'])?.value.currencyCode;
    }

    if (!!this.newLeadForm.get(['labels'])?.value) {
      newContact['label'] = this.newLeadForm.get(['labels'])?.value;
    }

    if (!!this.newLeadForm.get(['expected_close_date'])?.value) {
      newContact['expected_close_date'] = this._db.getDateFormatted(this.newLeadForm.get(['expected_close_date'])?.value);
    }

    if (this.currentUser.accRole == AccountRoles.SALES) {
      newContact.sales_id = this.currentUser.key
    }

    this._db.createNewContact(newContact).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.newLeadForm.reset();
        this.orgDetailsLoading = false;
        // this.addNewOrgnization = false;
        // this.subStatusLoading = false;
        // this.getMyLeads();
        this.getOrgLeadsAndOpportunities();

      } else {
        this._notify.openSnackbar(`Error, ${JSON.stringify(res['data'])}`, SnackBarState.Warning, 5000)
        this.orgDetailsLoading = false;
      }
    }, err => {
      this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)
      this.orgDetailsLoading = false;
    })


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


  // openNewContactForm(){
  //   this.newPersonContactForm.patchValue({
  //     'partner_id':this.newLeadForm.get(['partner_id'])?.value.id
  //   })
  // }

  createNewContact() {
    this.orgDetailsLoading = true;
    const newPersonContact: Contacts = {
      partner_id: this.currentOrgDetails.id || '',
      name: this.newPersonContactForm.get(['name'])?.value,
    }

    if (this.newPersonContactForm.get(['email'])?.value) {
      newPersonContact.email = this.newPersonContactForm.get(['email'])?.value
    }

    if (this.newPersonContactForm.get(['address'])?.value) {
      newPersonContact.address = this.newPersonContactForm.get(['address'])?.value
    }

    if (this.newPersonContactForm.get(['title'])?.value) {
      newPersonContact.title = this.newPersonContactForm.get(['title'])?.value
    }

    if (!!this.newPersonContactForm.get(['phones'])?.value && this.newPersonContactForm.get(['phones'])?.value.length > 0) {
      const myphones: MobileNumber[] = [];
      for (let phone of this.newPersonContactForm.get(['phones'])?.value) {
        const newP: MobileNumber = {
          phone: phone.phone.number,
          phone_type: phone.phone_type,
          country_code: phone.phone.dialCode,
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
        // this.getMyOrgContacts();
        this.newLeadForm.patchValue({
          'contact_id': res['data']['id']
        })
        this.newPersonContactForm.reset()
        this.orgDetailsLoading = false;
      } else {
        this._notify.openSnackbar(`something wrong!`, SnackBarState.Warning, 7000)
        this.orgDetailsLoading = false;
      }
    }, err => {
      this._notify.openSnackbar(`Error! ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 7000)
      this.orgDetailsLoading = false;
    })

  }

  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.label === o2.label : o2 === o2;
  }



  openAddLeadForm() {
    this.orgDetailsLoading = true;
    this.openSalesEdit();
    this.getAllProducts();
    this.openEditLabel();
    this.getAllTypes();
    this.getAllCampaigns();
    this.getMyOrgContacts();

    if (this.isLead == false) {
      this.getLeadSubStatusByStatus('3')
      this.newLeadForm.patchValue({
        'selectedCurrency': this.CurrencyList[0]
      })
    } else {
      this.newLeadForm.patchValue({
        'lead_sub_status_id': '4',
        'selectedCurrency': this.CurrencyList[0]
      })
    }


    this.orgDetailsLoading = false;

  }

  getLeadSubStatusByStatus(status_id: string) {
    this.subStatusLoading = true;
    this._db.getLeadAndContactSubStatus(status_id).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.contactSubStatus = res['data']
        this.newLeadForm.patchValue({
          'lead_sub_status_id': this.contactSubStatus[0].id
        })
        this.subStatusLoading = false;

      } else {
        this.contactSubStatus = [];
        this.subStatusLoading = false;

      }
    }, err => {
      this.subStatusLoading = false;
    })
  }

  openSalesEdit() {
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

  openEditLabel() {
    this._db.getAllLables().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.lables = res['data']
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

  getAllCampaigns() {
    this._db.getAllCampaigns().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.allCampaign = res['data']
      }
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

  getMyOrgContacts() {
    this.contactLoading = true;
    if (this.currentUser.department == Department.MANAGEMENT || this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER) {
      this._db.getOrgContact(this.currentOrgDetails.id || '').subscribe(res => {
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
      this._db.getMyOrgContact(this.currentOrgDetails.id || '').subscribe(res => {
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



  editProfileIMG() {
    this.imgOnEditMode = true;
    this.url = this.currentOrgDetails.partner_photoURL ? `${this.newServerApi}${this.currentOrgDetails.partner_photoURL}` : "";
  }


  saveEditIMg() {
    this.orgDetailsLoading = true;
    const fd: FormData = new FormData()
    if (!!this.newavatar) {
      fd.append('partner_photoURL', this.newavatar, this.newavatar.name)
      fd.append('partner_id', this.currentOrgDetails.id || '')
      this._db.editPartnerLogo(fd).subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this._notify.openSnackbar('Image Updated', SnackBarState.Success)
          this.imgOnEditMode = false;
          this.url = '';
          this.newavatar = undefined;
          this.getcurrentOrgDetails();
          this.orgDetailsLoading = false;
        } else {
          this.orgDetailsLoading = false;
        }
      }, err => {
        this._notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 10000)
        this.orgDetailsLoading = false;
      })
    }

  }

  cancelEditIMg() {
    this.imgOnEditMode = false;
    this.url = '';
    this.newavatar = undefined;
    this.getcurrentOrgDetails();
    // this.notify.openSnackbar("Cancelled" ,SnackBarState.Info)
  }

  imageupload(event: any) {
    const files = event.target.files;
    const mimeType = files[0].type;
    if (!mimeType.includes('image')) {
      this._notify.openSnackbar('Invalid File Type', SnackBarState.Error)
    } else {
      this.newavatar = event.target.files[0]
      if (event.target.files) {
        var reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onload = (event: any) => {
          this.url = event.target.result;
        }
      }
    }
  }

  GetLeadActivities(orgID: string) {
    this.orgDetailsLoading = true;
    this._db.GetLeadActivities(orgID).subscribe(res => {
      console.log(res);
      if (res['status'] == ResStatus.CRUD) {
        this.leadActivities = res['data'];
        console.log(this.leadActivities);
      } else {
        this.leadActivities = []
      }
      this.orgDetailsLoading = false;
    }, err => {
      this.leadActivities = [];
      this.orgDetailsLoading = false;
    })
  }

}
