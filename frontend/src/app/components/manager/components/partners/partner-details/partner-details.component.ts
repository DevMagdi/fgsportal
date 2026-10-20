import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { CurrencyModule } from 'src/app/interfaces/currency.module';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, Client, Department, MobileNumber, OrganizationTypes, Partner, PartnerIndustry, User } from 'src/app/interfaces/user';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-partner-details',
  templateUrl: './partner-details.component.html',
  styleUrls: ['./partner-details.component.scss']
})
export class PartnerDetailsComponent implements OnInit {
  partnerDetailsLoader: boolean = false;
  @ViewChild('mymodal') modal;
  @ViewChild('accModal') createAccountModal;

  partnerDetails: Partner;
  currentUser: User;
  DepartmentEnum = Department;
  AccountRolesEnum = AccountRoles;
  AccPositionEnum = AccountPositions;
  closeResult: string;
  clientAccounts: Client[] = [];
  CurrencyList = CurrencyModule.CurrencyList;
  editPartnerForm: FormGroup = new FormGroup({
    'partner_name': new FormControl(null, Validators.required),
    'partner_address': new FormControl(null),
    'partner_description': new FormControl(null),
    'partner_photoURL': new FormControl(null),
    'industry': new FormControl(null, Validators.required),
    'partner_email': new FormControl(null),
    'partner_phone': new FormControl(null),
    'country': new FormControl(this.CurrencyList[0].countryCode),
    'organize_type_id': new FormControl(null),
    'website': new FormControl(null),
  })

  createClientAccountForm: FormGroup = new FormGroup({
    'email': new FormControl(null, Validators.required),
    'password': new FormControl(null, Validators.required),
    'fullname': new FormControl(null, Validators.required),
    'phone': new FormControl(null),
    'isActive': new FormControl(true, Validators.required),
    'isPrimary': new FormControl(true, Validators.required),
  })

  clientToEdit: Client;
  updateClientAccountForm: FormGroup = new FormGroup({
    'key': new FormControl(null, Validators.required),
    'email': new FormControl(null, Validators.required),
    'fullname': new FormControl(null, Validators.required),
    'phone': new FormControl(null),
    'isActive': new FormControl(true, Validators.required),
    'isPrimary': new FormControl(true, Validators.required),
  })

  organizationTypes: OrganizationTypes[] = [];
  partnerIndustry: PartnerIndustry[] = [];
  accountModal = false;
  editAccModal = false;
  mymodal = false;
  myPerms: UserPermissions[] = [];

  constructor(private _auth: AuthApiService,
    private _db: DatabaseService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private _notify: NotificationService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user => {
      this.currentUser = user;
      this.checkIfHasPermission();
      this.getPartnerDetails();
    })
  }


  checkIfHasPermission() {
    this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.myPerms = res['data']
      }
    })
  }

  checkIfHasPerm(permKey:string) {
    const checking = this.myPerms.find(p => p.permission_id == permKey)
    if (!!checking) {
      return true;
    } else {
      return false;
    }
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

  getPartnerDetails() {
    const partnerID = this.route.snapshot.params.id
    this._db.getPartnerByID(partnerID).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.partnerDetails = res['data'];
        if (!!res['data']['account']) {
          this.clientAccounts = res['data']['account']
          for (let i in this.clientAccounts) {
            if (!!this.clientAccounts[i].phone) {
              const phoneSTR: any = this.clientAccounts[i].phone
              this.clientAccounts[i].phone = JSON.parse(phoneSTR)
            }
          }
        } else {
          this.clientAccounts = [];
        }
      }
    })
  }

  getAllPartnerIndustry() {
    this._db.getPartnersIndustry().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.partnerIndustry = res['data']
      }
    })
  }

  editPartner() {
    this.getAllPartnerIndustry();
    this.getAllOrganizationTypes();

    this.editPartnerForm.patchValue({
      'partner_name': this.partnerDetails.partner_name,
      'partner_address': this.partnerDetails.partner_address,
      'partner_description': this.partnerDetails.partner_description,
      'partner_photoURL': this.partnerDetails.partner_photoURL,
      'industry': this.partnerDetails.partner_industry_id?.toString(),
      'partner_email': this.partnerDetails.email,
      'partner_phone': this.partnerDetails.phone,
      'country': this.partnerDetails.country,
      'organize_type_id': this.partnerDetails.organize_type_id?.toString(),
      'website': this.partnerDetails.website,
    })
  }


  saveEditPartner() {
    this.partnerDetails.partner_name = this.editPartnerForm.get(['partner_name'])?.value

    if (!!this.editPartnerForm.get(['partner_address'])?.value) {
      this.partnerDetails.partner_address = this.editPartnerForm.get(['partner_address'])?.value
    }

    if (!!this.editPartnerForm.get(['partner_description'])?.value) {
      this.partnerDetails.partner_description = this.editPartnerForm.get(['partner_description'])?.value
    }

    if (!!this.editPartnerForm.get(['industry'])?.value) {
      this.partnerDetails.partner_industry_id = this.editPartnerForm.get(['industry'])?.value
    }


    if (!!this.editPartnerForm.get(['partner_email'])?.value) {
      this.partnerDetails.email = this.editPartnerForm.get(['partner_email'])?.value
    }
    if (!!this.editPartnerForm.get(['partner_phone'])?.value) {
      this.partnerDetails.phone = this.editPartnerForm.get(['partner_phone'])?.value
    }

    if (!!this.editPartnerForm.get(['country'])?.value) {
      this.partnerDetails.country = this.editPartnerForm.get(['country'])?.value
    }

    if (!!this.editPartnerForm.get(['organize_type_id'])?.value) {
      this.partnerDetails.organize_type_id = this.editPartnerForm.get(['organize_type_id'])?.value
    }
    if (!!this.editPartnerForm.get(['website'])?.value) {
      this.partnerDetails.website = this.editPartnerForm.get(['website'])?.value
    }

    this._db.editPartner(this.partnerDetails).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.editPartnerForm.reset();
        this.modalService.dismissAll(this.modal)
        this.getPartnerDetails();
        this._notify.openSnackbar(`Done`, SnackBarState.Success);
        this.mymodal = false;
      }
    }, err => {
      if (err['status'] == ResStatus.ValidationError) {
        this._notify.openSnackbar(`Error ${err['error']['data']}`, SnackBarState.Error)
      }
    })
  }

  deletePartner() {
    this._notify.openDialog(
      'Delete Client?',
      `Are you sure you want to delete This Client?`,
      false,
      '*Deleteing this Client will delete also all related accounts',
      true,
      false).subscribe(response => {
        if (response) {
          this._db.deletePartner(this.partnerDetails.id || '').subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this._db.createSystemLogs(`${this.currentUser.username} Deleted ${this.partnerDetails.partner_name}`, `${this.currentUser.key} Deleted ${this.partnerDetails.id}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe(res => {
              }, console.log)
              this._notify.openSnackbar('Client Deleted Successfully', SnackBarState.Success)
              this.router.navigate(['/manager/partners'])
            } else {
              this._db.createSystemLogs(`${this.currentUser.username} Deleted ${this.partnerDetails.partner_name}`, `${this.currentUser.key} Deleted ${this.partnerDetails.id}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
              }, console.log)
              console.log(res['data']);
              this._notify.openSnackbar('Somthing Wrong While Deleting Project', SnackBarState.Error)
            }
          }, err => {
            console.log(err)
            this._db.createSystemLogs(`${this.currentUser.username} Deleted ${this.partnerDetails.partner_name}`, `${this.currentUser.key} Deleted ${this.partnerDetails.id}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
            }, console.log)
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }


  getCountryName(country_code) {
    const coun = this.CurrencyList.find(c => c.countryCode == country_code)
    if (!!coun) {
      return coun.countryName
    } else {
      return ''
    }
  }

  createClientAccount() {
    this.partnerDetailsLoader = true;
    const newPrimaryContact: Client = {
      email: this.createClientAccountForm.get(['email'])?.value,
      password: this.createClientAccountForm.get(['password'])?.value,
      fullname: this.createClientAccountForm.get(['fullname'])?.value,
      active: this.createClientAccountForm.get(['isActive'])?.value,
      primary: this.createClientAccountForm.get(['isPrimary'])?.value,
      partner_id: this.partnerDetails.id || '',
      hamada: true
    }
    if (!!this.createClientAccountForm.get(['phone'])?.value) {
      const newPhone: MobileNumber = {
        phone: this.createClientAccountForm.get(['phone'])?.value,
        phone_type: 'phone'
      }
      newPrimaryContact.phone = [newPhone];
    }
    this._db.createPrimaryContact(newPrimaryContact).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getPartnerDetails();
        this.createClientAccountForm.reset();
        this.modalService.dismissAll(this.createAccountModal)
        this._notify.openSnackbar('Success', SnackBarState.Success)
        this.partnerDetailsLoader = false;
        this.accountModal = false;
      } else {
        this._notify.openSnackbar(`Error ${res['data']}`, SnackBarState.Error)
        this.partnerDetailsLoader = false;
      }
    }, err => {
      if (err['status'] == ResStatus.ValidationError) {
        this._notify.openSnackbar(`Error ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error)
        this.partnerDetailsLoader = false;
      }
    })
  }

  updateClientAccount() {
    this.partnerDetailsLoader = true;
    const editPrimaryContact: Client = {
      key: this.updateClientAccountForm.get(['key'])?.value,
      email: this.updateClientAccountForm.get(['email'])?.value,
      fullname: this.updateClientAccountForm.get(['fullname'])?.value,
      active: this.updateClientAccountForm.get(['isActive'])?.value,
      primary: this.updateClientAccountForm.get(['isPrimary'])?.value,
    }
    if (!!this.updateClientAccountForm.get(['phone'])?.value) {
      const newPhone: MobileNumber = {
        phone: this.updateClientAccountForm.get(['phone'])?.value,
        phone_type: 'phone'
      }
      editPrimaryContact.phone = [newPhone];
    }
    this._db.updateContact(editPrimaryContact).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.getPartnerDetails();
        this.updateClientAccountForm.reset();
        this.modalService.dismissAll(this.createAccountModal)
        this._notify.openSnackbar('Success', SnackBarState.Success)
        this.partnerDetailsLoader = false;
        this.editAccModal = false;
      } else {
        this._notify.openSnackbar(`Error ${res['data']}`, SnackBarState.Error)
        this.partnerDetailsLoader = false;
      }
    }, err => {
      if (err['status'] == ResStatus.ValidationError) {
        this._notify.openSnackbar(`Error ${JSON.stringify(err['error']['data'])}`, SnackBarState.Error)
        this.partnerDetailsLoader = false;
      }
    })
  }

  open(content) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  changeActivateUser(client: Client) {
    this._notify.openDialog(
      `${client.active == true ? 'Deactivate' : 'Activate'} Client?`,
      `Are you sure you want to ${client.active == true ? 'Deactivate' : 'Activate'} This Client?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.partnerDetailsLoader = true;

          client.active = !client.active
          this._db.updateContact(client).subscribe(res => {
            this.partnerDetailsLoader = false;

            if (res['status'] == ResStatus.CRUD) {
              this._db.createSystemLogs(`${this.currentUser.username} ${client.active == true ? 'Activated' : 'Deactivated'} ${client.fullname}`, `${this.currentUser.key} ${client.active == true ? 'Activated' : 'Deactivated'} ${client.key}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe(res => {
              }, console.log)
              this._notify.openSnackbar(`Client ${client.active == true ? 'Activated' : 'Deactivated'} Successfully`, SnackBarState.Success)
            } else {
              this._db.createSystemLogs(`${this.currentUser.username} ${client.active == true ? 'Activated' : 'Deactivated'} ${client.fullname}`, `${this.currentUser.key} ${client.active == true ? 'Activated' : 'Deactivated'} ${client.key}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
              }, console.log)
              console.log(res['data']);
              this._notify.openSnackbar('Somthing Wrong While Deleting Project', SnackBarState.Error)
            }
          }, err => {
            this.partnerDetailsLoader = false;
            console.log(err)
            this._db.createSystemLogs(`${this.currentUser.username} ${client.active == true ? 'Activated' : 'Deactivated'} ${client.fullname} => Error ${JSON.stringify(err.error)}`, `${this.currentUser.key} ${client.active == true ? 'Activated' : 'Deactivated'} ${client.key}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
            }, console.log)
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }


  deleteClientAccount(client: Client) {
    this._notify.openDialog(
      'Delete Client Account?',
      `Are you sure you want to delete This Client Account?`,
      false,
      '',
      true,
      false).subscribe(response => {
        if (response) {
          this.partnerDetailsLoader = true;
          this._db.deleteContact(client).subscribe(res => {
            this.partnerDetailsLoader = false;

            if (res['status'] == ResStatus.CRUD) {
              this._db.createSystemLogs(`${this.currentUser.username} Deleted ${client.fullname}`, `${this.currentUser.key} Deleted ${client.key}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe(res => {
              }, console.log)
              this._notify.openSnackbar(`Client Deleted Successfully`, SnackBarState.Success)
              this.clientAccounts.splice(this.clientAccounts.findIndex(c => c.key == client.key), 1)
            } else {
              this._db.createSystemLogs(`${this.currentUser.username} Deleted ${client.fullname}`, `${this.currentUser.key} Deleted ${client.key}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
              }, console.log)
              console.log(res['data']);
              this._notify.openSnackbar('Somthing Wrong While Deleting Project', SnackBarState.Error)
            }
          }, err => {
            this.partnerDetailsLoader = false;
            console.log(err)
            this._db.createSystemLogs(`${this.currentUser.username} Deleted ${client.fullname} => Error ${JSON.stringify(err.error)}`, `${this.currentUser.key} Deleted ${client.key}`, this.currentUser.key || '', this.currentUser.username, 'Fail').subscribe(res => {
            }, console.log)
          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }


  openEditClient(client: Client) {
    this.updateClientAccountForm.patchValue({
      'key': client.key,
      'email': client.email,
      'fullname': client.fullname,
      'isActive': client.active,
      'isPrimary': client.primary
    })


    if (!!client.phone && client.phone.length > 0) {
      this.updateClientAccountForm.patchValue({
        'phone': client.phone[0].phone
      })
    } else {
      this.updateClientAccountForm.patchValue({
        'phone': ''
      })
    }

    if (this.updateClientAccountForm.get('isActive')?.value == 1) {
      this.updateClientAccountForm.patchValue({
        'isActive': true
      })
    } else {
      this.updateClientAccountForm.patchValue({
        'isActive': false
      })
    }

    if (this.updateClientAccountForm.get('isPrimary')?.value == 1) {
      this.updateClientAccountForm.patchValue({
        'isPrimary': true
      })
    } else {
      this.updateClientAccountForm.patchValue({
        'isPrimary': false
      })
    }
  }


  resetPasswordForClient(client) {
    this._notify.openDialog(
      `Reset Password For ${client.fullname}?`,
      `Are you sure you want to reset password for ${client.email}?`,
      false,
      `*We Will Send Email For This Email ${client.email}`,
      true,
      false).subscribe(response => {
        if (response) {
          this.partnerDetailsLoader = true;

          this._db.clientResetPassword(client.email).subscribe(res => {
            this.partnerDetailsLoader = false;
            if (res['status'] == ResStatus.CRUD) {
              this._notify.openSnackbar('Done', SnackBarState.Success)
              this._db.createSystemLogs(`${this.currentUser.username} Sent Reset Pssword For ${client.fullname}`, `${this.currentUser.key} Sent Reset Pssword For ${client.key}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe(res => {
                console.log(res);
              }, err => {
                console.log(err);
              })
            } else {
              this._db.createSystemLogs(`${this.currentUser.username} Sent Reset Pssword For ${client.fullname}`, `${this.currentUser.key} Sent Reset Pssword For ${client.key}`, this.currentUser.key || '', this.currentUser.username, 'Faild').subscribe(res => {
                console.log(res);
              }, err => {
                console.log(err);
              })
            }
          }, err => {
            this.partnerDetailsLoader = false;
            this._db.createSystemLogs(`${this.currentUser.username} Sent Reset Pssword For ${client.fullname} => Error ${JSON.stringify(err.error)}`, `${this.currentUser.key} Sent Reset Pssword For ${client.key}`, this.currentUser.key || '', this.currentUser.username, 'Faild').subscribe(res => {
              console.log(res);
            }, err => {
              console.log(err);
            })
            this._notify.openSnackbar('Error', SnackBarState.Error)

          })
        } else {
          this._notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }


}
