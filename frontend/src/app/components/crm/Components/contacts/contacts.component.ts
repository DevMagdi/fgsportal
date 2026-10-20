import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { Contacts } from 'src/app/interfaces/leadsAndContacts';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, Department, MobileNumber, Partner, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  currentUser: User;
  contactsLoader: boolean = false;
  myContacts: Contacts[] = [];
  newContactForm: FormGroup = new FormGroup({
    'name': new FormControl(null, Validators.required),
    'partner_id': new FormControl(null, Validators.required),
    'email': new FormControl(null),
    'address': new FormControl(null),
    'title': new FormControl(null),
    'phones': new FormArray([
      new FormGroup({
        'phone': new FormControl(null),
        'phone_type': new FormControl(null),
        'extend': new FormControl(null),
      })
    ])
  })
  // ,Validators.pattern("^((\\+2-?)|0)?[0-9]{11}$")
  phones = this.newContactForm.get('phones') as FormArray;
  editMode: boolean = false;
  contactToEdit: Contacts;
  allPartners: Partner[] = [];

  showOptions = false;
  selectedOption: string;


  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.Egypt,
    CountryISO.UnitedStates,
  ];

  sidebarDisplay = false;
  constructor(private _auth: AuthApiService,
    private _db: DatabaseService,
    private _notify: NotificationService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(res => {
      this.currentUser = res;
      this.getAllPersonContacts();
    })
  }
  openAddContactForm() {
    this.getAllPartners();
  }

  getAllPartners() {
    if (this.currentUser.department == Department.MANAGEMENT || this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER) {
      this._db.getAllPartners(true).subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.allPartners = res['data'];
        } else {
          this.allPartners = []
        }
      }, err => {
        this.allPartners = [];
      })
    } else {
      this._db.getMyPartners().subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.allPartners = res['data'];
        } else {
          this.allPartners = []
        }
      }, err => {
        this.allPartners = [];
      })
    }
  }

  createNewContact() {
    this.contactsLoader = true;
    const newPersonContact: Contacts = {
      partner_id: this.newContactForm.get(['partner_id'])?.value,
      name: this.newContactForm.get(['name'])?.value,
    }


    if (!this.newContactForm.get(['email'])?.value && !this.newContactForm.get(['phones'])?.value[0].phone) {

      this._notify.openSnackbar('Please enter email or phone number', SnackBarState.Error);
      return
    }
    if (this.newContactForm.get(['email'])?.value) {
      newPersonContact.email = this.newContactForm.get(['email'])?.value
    }

    if (this.newContactForm.get(['address'])?.value) {
      newPersonContact.address = this.newContactForm.get(['address'])?.value
    }
    if (this.newContactForm.get(['title'])?.value) {
      newPersonContact.title = this.newContactForm.get(['title'])?.value
    }

    if (!!this.newContactForm.get(['phones'])?.value && this.newContactForm.get(['phones'])?.value.length > 0) {

      const myphones: MobileNumber[] = [];
      for (let phone of this.newContactForm.get(['phones'])?.value) {
        if (phone.phone) {
          if (phone.phone.number[0] == '0' && phone.phone.countryCode == 'EG') {
            phone.phone.number = phone.phone.number.substring(1)
          }
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
      }
      myphones.length > 0 ? newPersonContact.phone = myphones : null;
    }

    this._db.createNewPersonContact(newPersonContact).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getAllPersonContacts();
        this._notify.openSnackbar(`success`, SnackBarState.Success)
        this.newContactForm.reset()
        this.contactsLoader = false;
      } else {
        this._notify.openSnackbar(`something wrong!`, SnackBarState.Warning, 7000)
        this.contactsLoader = false;
      }
    }, err => {
      this._notify.openSnackbar(`Error! ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 7000)
      this.contactsLoader = false;
    })

  }


  getAllPersonContacts() {
    this.contactsLoader = true;
    if (this.currentUser.department == Department.MANAGEMENT || this.currentUser.department == Department.Business_Development && this.currentUser.accPosition == AccountPositions.MANAGER) {
      this._db.getAllPersonContacts().subscribe(res => {
        if (res['status'] == ResStatus.CRUD) {
          this.myContacts = res['data'];
          this.contactsLoader = false;
        } else {
          this.myContacts = []
          this.contactsLoader = false;
        }
      }, err => {
        this.myContacts = [];
        this.contactsLoader = false;
      })
    } else {
      this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms => {
        if (perms['status'] == ResStatus.CRUD) {
          const userPerms = perms['data'];
          const checking = userPerms.find(p => p.permission_id == 15)
          if (!!checking) {
            this._db.getAllPersonContacts().subscribe(res => {
              if (res['status'] == ResStatus.CRUD) {
                this.myContacts = res['data'];
                this.contactsLoader = false;
              } else {
                this.myContacts = []
                this.contactsLoader = false;
              }
            }, err => {
              this.myContacts = [];
              this.contactsLoader = false;
            })
          } else {
            this._db.getMyPersonContacts().subscribe(res => {
              if (res['status'] == ResStatus.CRUD) {
                this.myContacts = res['data'];
                this.contactsLoader = false;
              } else {
                this.myContacts = []
                this.contactsLoader = false;
              }
            }, err => {
              this.myContacts = [];
              this.contactsLoader = false;
            })
          }
        } else {
          this._db.getMyPersonContacts().subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this.myContacts = res['data'];
              this.contactsLoader = false;
            } else {
              this.myContacts = []
              this.contactsLoader = false;
            }
          }, err => {
            this.myContacts = [];
            this.contactsLoader = false;
          })
        }
      }, err => {
        console.log(err);
      })

    }
  }


  addPhone() {
    // ,Validators.pattern("^((\\+2-?)|0)?[0-9]{11}$")
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

  closeForm() {
    this.newContactForm.reset();
    this.editMode = false;
  }


  editContact(contact: Contacts) {
    this.editMode = true;
    this.contactToEdit = contact;
    this.getAllPartners();
    // this.phones.length = contact.phone?.length

    if (!!contact.phone && contact.phone.length > 0) {
      for (let i in contact.phone) {
        const newG = new FormGroup({
          'phone': new FormControl(null, Validators.required),
          'phone_type': new FormControl(null, Validators.required),
          'extend': new FormControl(null),
        })
        if (parseInt(i) != 0) {
          this.phones.push(newG);
        } else {
          this.phones[parseInt(i)] = newG
        }

      }
    }
    // this.phones.reset();
    this.newContactForm.patchValue({
      'name': contact.name,
      'partner_id': contact.partner_id,
      'email': contact.email,
      'address': contact.address,
      'phones': contact.phone,
      'title': contact.title
    })
    this.phones = this.newContactForm.get('phones') as FormArray;
  }



  submitEditContact() {
    this.contactsLoader = true;
    this.contactToEdit.partner_id = this.newContactForm.get(['partner_id'])?.value;
    this.contactToEdit.name = this.newContactForm.get(['name'])?.value;
    this.contactToEdit.email = this.newContactForm.get(['email'])?.value
    this.contactToEdit.address = this.newContactForm.get(['address'])?.value
    this.contactToEdit.title = this.newContactForm.get(['title'])?.value

    if (!!this.newContactForm.get(['phones'])?.value && this.newContactForm.get(['phones'])?.value.length > 0) {
      const myphones: MobileNumber[] = [];
      for (let phone of this.newContactForm.get(['phones'])?.value) {
        if (phone.phone) {
          if (phone.phone.number[0] == '0' && phone.phone.countryCode == 'EG') {
            phone.phone.number = phone.phone.number.substring(1)
          }
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
      }
      myphones.length > 0 ? this.contactToEdit.phone = myphones : null;
    }

    this._db.updatePersonContact(this.contactToEdit).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getAllPersonContacts();
        this._notify.openSnackbar(`success`, SnackBarState.Success)
        this.newContactForm.reset()
        this.contactsLoader = false;
      } else {
        this._notify.openSnackbar(`something wrong!`, SnackBarState.Warning, 7000)
        this.contactsLoader = false;
      }
    }, err => {
      this._notify.openSnackbar(`Error! ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 7000)
      this.contactsLoader = false;
    })
  }


  submitContactForm() {
    if (this.editMode == true) {
      this.submitEditContact()
    } else {
      this.createNewContact()
    }
  }

  deleteContact(contact: Contacts) {
    this._notify.openDialog(
      'Delete Contact?',
      `Are you sure you want to delete This Contact?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.contactsLoader = true;
          this._db.deletePersonContact(contact.id || '').subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this.getAllPersonContacts()
              this._notify.openSnackbar(`Contact Deleted Successfully`, SnackBarState.Success)
              this.contactsLoader = false;
            } else {
              this._notify.openSnackbar(`something wrong ${JSON.stringify(response['data'])}`, SnackBarState.Warning, 5000)
              this.contactsLoader = false;
            }
          }, err => {
            this._notify.openSnackbar(`Error ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error, 5000)
            this.contactsLoader = false;
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
