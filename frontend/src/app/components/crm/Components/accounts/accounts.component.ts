import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { CurrencyModule } from 'src/app/interfaces/currency.module';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Department, OrganizationTypes, Partner, PartnerIndustry, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  CurrencyList = CurrencyModule.CurrencyList;
  currentUser: User;
  accountsLoader: boolean = false;
  myAccounts: Partner[] = [];
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
    'is_client': new FormControl(false),
    'sales_id': new FormControl(null)
  })

  partnerIndustry: PartnerIndustry[] = [];
  organizationTypes: OrganizationTypes[] = [];
  partnerToEdit: Partner;
  editMode: boolean = false;

  loading: boolean = true;
  DepartmentEnum = Department;
  AccountPositionsEnum = AccountPositions;
  allSales: User[] = [];
  sidebarDisplay = false;
  nameFilterOptions: { label: string, value: string }[] = [];
  salesFilterOptions: { label: string, value: string }[] = [];
  countryFilterOptions: { label: string, value: string }[] = [];

  constructor(private _db: DatabaseService,
    private _auth: AuthApiService,
    private _notify: NotificationService,) { }

  private setAccounts(accounts: Partner[] = []) {
    this.myAccounts = accounts;
    this.updateFilterOptions();
  }

  private updateFilterOptions() {
    this.nameFilterOptions = this.getUniqueFilterOptions('partner_name');
    this.salesFilterOptions = this.getUniqueFilterOptions('sales_name');
    this.countryFilterOptions = this.getUniqueFilterOptions('country', value => this.getCountryName(value));
  }

  private getUniqueFilterOptions(field: 'partner_name' | 'sales_name' | 'country', labelMapper?: (value: string) => string) {
    return [...new Set(
      this.myAccounts
        .map(account => (account[field] || '').toString().trim())
        .filter(value => !!value)
    )]
      .sort((a, b) => a.localeCompare(b))
      .map(value => ({ label: labelMapper ? labelMapper(value) : value, value }));
  }

  getCountryName(countryCode: string | undefined) {
    if (!countryCode) {
      return '';
    }

    const country = this.CurrencyList.find(item => item.countryCode === countryCode);
    return country?.countryName || countryCode;
  }

  ngOnInit(): void {
    this._auth.user.subscribe(user => {
      this.currentUser = user;
      this.getAllPartners();
      this.getAllPartnerIndustry();
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


  getAllPartners() {
    this.accountsLoader = true;
    if (this.currentUser.department == Department.MANAGEMENT || (this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER)) {
      this._db.getAllPartners().subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.setAccounts(res['data']);
          this.accountsLoader = false;
          this.loading = false;
        } else {
          this.setAccounts([])
          this.accountsLoader = false;
          this.loading = false;
        }
      }, err => {
        this.accountsLoader = false;
        this.loading = false;
        this.setAccounts([])
      })

    } else {
      this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms => {
        if (perms['status'] == ResStatus.CRUD) {
          const userPerms = perms['data'];
          const checking = userPerms.find(p => p.permission_id == 15)
          if (!!checking) {
            this._db.getAllPartners().subscribe(res => {
              if (res['status'] == ResStatus.CRUD) {
                this.setAccounts(res['data']);
                this.accountsLoader = false;
                this.loading = false;
              } else {
                this.setAccounts([])
                this.accountsLoader = false;
                this.loading = false;
              }
            }, err => {
              this.accountsLoader = false;
              this.loading = false;
              this.setAccounts([])
            })
          } else {
            this._db.getMyPartners().subscribe(res => {
              if (res['status'] == ResStatus.CRUD) {
                this.setAccounts(res['data']);
                this.accountsLoader = false;
                this.loading = false;
              } else {
                this.setAccounts([])
                this.accountsLoader = false;
                this.loading = false;
              }
            }, err => {
              this.accountsLoader = false;
              this.loading = false;
              this.setAccounts([])
            })
          }
        } else {
          this._db.getMyPartners().subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this.setAccounts(res['data']);
              this.accountsLoader = false;
              this.loading = false;
            } else {
              this.setAccounts([])
              this.accountsLoader = false;
              this.loading = false;
            }
          }, err => {
            this.accountsLoader = false;
            this.loading = false;
            this.setAccounts([])
          })
        }
      }, err => {
        console.log(err);
        this.loading = false;
        this.setAccounts([])
        this.accountsLoader = false;
      })
    }
  }

  openAddPartnerForm() {
    this.sidebarDisplay = true;
    this.getAllPartners();
    this.getAllPartnerIndustry();
    this.getAllOrganizationTypes();
    if (this.currentUser.department == Department.MANAGEMENT || (this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER)) {
      this.getAllSales();
    }
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


  addPartner() {
    this.accountsLoader = true;

    const newPartner: Partner = {
      partner_name: this.newPartnerForm.get(['partner_name'])?.value,
      is_org: true
    }

    if (!!this.newPartnerForm.get(['is_client'])?.value == true) {
      newPartner.is_org = false
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
        this._db.createSystemLogs(`${this.currentUser.username} Created New ORG / ${newPartner.partner_name}`, `${this.currentUser.key} Created New Partner / ${newPartner.partner_name}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe()
        this.getAllPartners();
        this.newPartnerForm.reset();
        this.accountsLoader = false;
        this._notify.openSnackbar('Done', SnackBarState.Success)
      } else {
        this.accountsLoader = false;
        this._notify.openSnackbar(`Error ${res['data']}`, SnackBarState.Error)
      }
    }, err => {
      if (err['status'] == ResStatus.ValidationError) {
        this._notify.openSnackbar(`Error ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error)
      }
      this.accountsLoader = false;

    })
  }


  submitPartForm() {
    if (this.editMode == true) {
      this.submitEditPart()
    } else {
      this.addPartner();
    }
  }

  editPartner(partner: Partner) {
    this.editMode = true;
    this.partnerToEdit = partner;
    this.getAllPartnerIndustry();
    this.getAllOrganizationTypes();
    this.getAllSales();
    this.newPartnerForm.patchValue({
      'partner_name': partner.partner_name,
      'partner_address': partner.partner_address,
      'partner_description': partner.partner_description,
      'industry': partner.partner_industry_id,
      'email': partner.email,
      'phone': partner.phone,
      'country': partner.country,
      'organize_type_id': partner.organize_type_id,
      'website': partner.website,
      'is_client': partner.is_org == '0' ? true : false,
      'sales_id': partner.sales_id
    })
  }

  submitEditPart() {
    this.accountsLoader = true;

    this.partnerToEdit.partner_name = this.newPartnerForm.get(['partner_name'])?.value

    if (!!this.newPartnerForm.get(['partner_address'])?.value) {
      this.partnerToEdit.partner_address = this.newPartnerForm.get(['partner_address'])?.value
    }

    if (!!this.newPartnerForm.get(['partner_description'])?.value) {
      this.partnerToEdit.partner_description = this.newPartnerForm.get(['partner_description'])?.value
    }

    if (!!this.newPartnerForm.get(['industry'])?.value) {
      this.partnerToEdit.partner_industry_id = this.newPartnerForm.get(['industry'])?.value
    }
    if (!!this.newPartnerForm.get(['email'])?.value) {
      this.partnerToEdit.email = this.newPartnerForm.get(['email'])?.value
    }
    if (!!this.newPartnerForm.get(['phone'])?.value) {
      this.partnerToEdit.phone = this.newPartnerForm.get(['phone'])?.value
    }

    if (!!this.newPartnerForm.get(['country'])?.value) {
      this.partnerToEdit.country = this.newPartnerForm.get(['country'])?.value
    }
    if (!!this.newPartnerForm.get(['organize_type_id'])?.value) {
      this.partnerToEdit.organize_type_id = this.newPartnerForm.get(['organize_type_id'])?.value
    }
    if (!!this.newPartnerForm.get(['website'])?.value) {
      this.partnerToEdit.website = this.newPartnerForm.get(['website'])?.value
    }

    if (this.currentUser.department == Department.MANAGEMENT || (this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER)) {
      this.partnerToEdit.sales_id = this.newPartnerForm.get(['sales_id'])?.value;
    } else {
      this.partnerToEdit.sales_id = this.currentUser.key;
    }

    this.partnerToEdit.is_org = this.newPartnerForm.get(['is_client'])?.value == true ? '0' : '1'
    // if(!!this.newPartnerForm.get(['is_client'])?.value){
    // }

    this._db.editPartner(this.partnerToEdit).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.newPartnerForm.reset();
        this.getAllPartners();
        this.editMode = false;
        this.accountsLoader = false;
        this._notify.openSnackbar('Done', SnackBarState.Success)
      }
    }, err => {
      if (err['status'] == ResStatus.ValidationError) {
        this._notify.openSnackbar(`Error ${err['error']['data']}`, SnackBarState.Error)
      }
      this.accountsLoader = false;
    })
  }



  deletePart(part: Partner) {
    this._notify.openDialog(
      'Delete Account?',
      `Are you sure you want to delete This Account?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deletePartner(part.id || '').subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this.getAllPartners()
              this._notify.openSnackbar(`Request Deleted Successfully`, SnackBarState.Success)
            }
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }

  clear(table: Table) {
    table.clear();
  }
}
