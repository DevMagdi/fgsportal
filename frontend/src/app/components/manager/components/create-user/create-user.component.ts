import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { User, AccountType, Department, AccountRoles, AccountPositions, UserNavParams, ClientNavParams } from 'src/app/interfaces/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ResStatus } from 'src/app/interfaces/res-status';
import { environment } from 'src/environments/environment';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import Client from 'mailgun.js/client';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CreateUserComponent implements OnInit {

  // @ViewChild('f') newuserForm: NgForm;
  @ViewChild('mymodal') modal;

  submitted = false;

  newUser: User;
  newUserTemp: User;


  newUSerNameList: User[] = [];


  myUsersList: User[] = [];
  myUsersListSearch: User[] = [];
  newUserList: Array<any> = []

  userEditMode: boolean[] = [];

  totalProductsRecords: number = 0;
  productpage: number = 1

  searchKey: string = ''

  userOnEditMode: boolean = false

  deletedMode: boolean = false;
  currentUser: User;
  closeResult: string;
  allDepartments: any[] = [];
  allSubdepartments: any[] = [];
  allPositions: any[] = [];
  subdeptLoading: boolean = false;


  DepartmentEnum = Department;//this.getMyEnumkeys(Department);
  accRolesEnum = AccountRoles; //this.getMyEnumkeys(AccountRoles);
  accPositionEnum = AccountPositions; // this.getMyEnumkeys(AccountPositions);
  newUserForm: FormGroup = new FormGroup({
    'email': new FormControl(null, Validators.required),
    'username': new FormControl(null, Validators.required),
    'firstName': new FormControl(null, Validators.required),
    'lastName': new FormControl(null, Validators.required),
    'password': new FormControl(null),
    'department': new FormControl(null, Validators.required),
    'role': new FormControl(null, Validators.required),
    'position': new FormControl(null, Validators.required),
    'key': new FormControl(null),
    'notify': new FormControl(true, Validators.required)
  })

  newServerApi = environment.newServerApi;
  userPerms: UserPermissions[] = [];

  createUserLoading: boolean = false;
  sidebarDisplay = false;
  editMode = false;

  constructor(private _auth: AuthApiService,
    private _db: DatabaseService,
    private modalService: NgbModal,
    private notify: NotificationService) { }

  ngOnInit(): void {
    // this.newUserForm = this.formBuilder.group({
    //   email: ['', [Validators.required, Validators.email]],
    //   username: ['', Validators.required],
    //   firstname: ['', Validators.required],
    //   lastname: ['', Validators.required],
    //   password: ['', [Validators.required, Validators.maxLength(6)]],
    //   acctype: ['', Validators.required]
    // });

    // this.newUser= {
    //   username:"",
    //   email:"",
    //   password:"",
    //   firstname:"",
    //   lastname:"",
    //   accType: AccountType.Emp,
    //   department: Department.TECHNICAL_TEAM,
    //   accRole: AccountRoles.Automation_Engineer,
    //   accPosition: AccountPositions.UNDER_TRAINING,
    // }
    // this.newUserTemp= {
    //   username:"",
    //   email:"",
    //   password:"",
    //   firstname:"",
    //   lastname:"",
    //   accType: AccountType.Emp,
    //   department: Department.TECHNICAL_TEAM,
    //   accRole: AccountRoles.Automation_Engineer,
    //   accPosition: AccountPositions.UNDER_TRAINING,
    // }

    this._auth.user.subscribe(
      (user) => {
        if (!!user) {
          // console.log(user);

          this.currentUser = user;
          // console.log(this.currentUser);

          if (user.department == Department.MANAGEMENT || user.department == Department.ADMINSTRATION || user.accPosition == AccountPositions.MANAGER) {
            this.getAllUser();
            this.getAllWorkDegress();
          }
          this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms => {
            if (perms['status'] == ResStatus.CRUD) {
              this.userPerms = perms['data'];
            } else {
              this.userPerms = []
            }
          }, err => {
            console.log(err);
            this.userPerms = []
          })
        } else {
          console.log("You Are Not Logged In User");
        }
      }
    )

  }

  checkIfHasPerm(perm_id) {
    const checking = this.userPerms.find(p => p.permission_id == perm_id)
    if (!!checking) {
      return true;
    } else {
      return false;
    }
  }

  validateNewUser() {
    this.createUser()
  }

  createUser() {
    this.createUserLoading = true;
    const newUser: User = {
      email: this.newUserForm.get(['email'])?.value,
      username: this.newUserForm.get(['username'])?.value,
      firstname: this.newUserForm.get(['firstName'])?.value,
      lastname: this.newUserForm.get(['lastName'])?.value,
      password: this.newUserForm.get(['password'])?.value,
      accType: AccountType.Emp,
      department: this.newUserForm.get(['department'])?.value,
      accRole: this.newUserForm.get(['role'])?.value,
      accPosition: this.newUserForm.get(['position'])?.value,
      notify: this.newUserForm.get(['notify'])?.value == true ? '1' : '0',
    }
    this._auth.createUser(newUser).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this._db.createSystemLogs(`${this.currentUser.username} Created New User ${res['data'].username}`, `${this.currentUser.key} Created New User ${res['data'].key}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe()
        this.getAllUser()
        this.newUserForm.reset();
        this.modalService.dismissAll(this.modal)
        this.createUserLoading = false;
        this.notify.openSnackbar(`User Created successfully` , SnackBarState.Success )
      } else {
        this._db.createSystemLogs(`${this.currentUser.username} Tryied To Create New User ${res}`, `${this.currentUser.key} Tryied To Create New User ${res}`, this.currentUser.key || '', this.currentUser.username, 'Faild').subscribe()
        this.createUserLoading = false;
        this.notify.openSnackbar(`${res.message}` , SnackBarState.Error )
      }
    }, err => {
      this._db.createSystemLogs(`${this.currentUser.username} Tryied To Create New User ${JSON.stringify(newUser)}`, `${this.currentUser.key} Tryied To Create New User ${JSON.stringify(err.error)}`, this.currentUser.key || '', this.currentUser.username, 'Faild').subscribe()
      this.createUserLoading = false;
      
      if(err.error['data']['message'] == 'invalid Token'){
        this.notify.openSnackbar('Session Expired , please logout and login again' , SnackBarState.Error )
      }else{
        this.notify.openSnackbar(`${JSON.stringify(err.error.data)}` , SnackBarState.Error,5000 )
      }
    })
  }


  getDepartments() {
    this._db.getAllDeparments().subscribe(departments => {
      if (!!departments && departments['status'] == ResStatus.CRUD) {
        this.allDepartments = departments['data'];
      }
    })
  }

  getSubDepartment() {


    if (!!this.newUserForm.get(['department'])?.value) {
      this.subdeptLoading = true;
      this._db.getSubDepartmentsByDeparmentID(this.newUserForm.get(['department'])?.value).subscribe(subdept => {
        if (!!subdept && subdept['status'] == ResStatus.CRUD) {
          this.allSubdepartments = subdept['data'];
          this.subdeptLoading = false;
        }
      })
    }
  }

  getAllWorkDegress() {
    this._db.getAllWorkDegree().subscribe(positions => {
      if (!!positions && positions['status'] == ResStatus.CRUD) {
        this.allPositions = positions['data'];
      }
    })
  }


  getAllUser() {
    this.myUsersList = [];
    this.myUsersListSearch = [];
    this.deletedMode = false;
    this._auth.getAllUsers().subscribe(users => {
      if (!!users && users['status'] == ResStatus.CRUD) {
        this.myUsersList = users['data'];
        this.newUserList = users['data'];
        this.myUsersListSearch = this.newUserList;
        this.myUsersListSearch = this.myUsersListSearch.sort((a, b) => {
          return compare(a.username, b.username, true);
        })
      }
    })
  }




  checkUserName() {
    console.log("key Up");

    // const newUserName =  this.newUser.username
    // this.auth.checkUserName(newUserName).subscribe(
    //   (data)=>{
    //     if(!!data){
    //       console.log(data);
    //       if(data.length > 0 ){
    //        // this.flag = "notValid"
    //       }
    //     }
    //   }
    // )
  }

  userToEdit(user: User) {
    this.userOnEditMode = true
    this.newUserForm.patchValue({
      'email': user.email,
      'username': user.username,
      'firstName': user.firstname,
      'lastName': user.lastname,
      'department': user.department.toString(),
      'role': user.accRole.toString(),
      'position': user.accPosition.toString(),
      'key': user.key
    })
    console.log('aaa');

    this.newUserForm.get('email')?.disable();

    this.getDepartments();
    this.getSubDepartment();
    this.getAllWorkDegress();
  }

  editUser() {
    const editUser: User = {
      key: this.newUserForm.get(['key'])?.value,
      email: this.newUserForm.get(['email'])?.value,
      username: this.newUserForm.get(['username'])?.value,
      firstname: this.newUserForm.get(['firstName'])?.value,
      lastname: this.newUserForm.get(['lastName'])?.value,
      department: this.newUserForm.get(['department'])?.value,
      accRole: this.newUserForm.get(['role'])?.value,
      accPosition: this.newUserForm.get(['position'])?.value,
      accType: AccountType.Emp,
    }
    this._auth.editUser(editUser).subscribe(res => {
      console.log(res['data']);

      if (res['status'] == ResStatus.CRUD) {

        this.notify.openSnackbar('user updated successfully', SnackBarState.Success)
        this._db.createSystemLogs(`${this.currentUser.username} Edit User Data ${res['data'].username}`, `${this.currentUser.key} Edit User Data ${res['data'].key}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe(res => {
          // console.log(res);
          this.editMode = false;
        }, err => {
          console.log(err);
        })
        this.getAllUser()
        this.modalService.dismissAll(this.modal)
      } else {
        this._db.createSystemLogs(`${this.currentUser.username} Tryied To Edit User Data ${res}`, `${this.currentUser.key} Tryied To Edit User Data ${res}`, this.currentUser.key || '', this.currentUser.username, 'Faild').subscribe(res => {
          // console.log(res);
        }, err => {
          console.log(err);
        })
      }
    })
    // this._auth.editUser(this.newUser)
    // .then((data)=>{
    //   console.log(data);
    //   this.userOnEditMode = false ; 
    //   this.newuserForm.reset()

    // })
    // .catch((err)=>{console.log(err)})
  }




  userSearch() {
    this.newUserList = this.myUsersListSearch
    if (this.searchKey.length > 0) {
      // || user.department.toLowerCase().includes(this.searchKey.toLowerCase())
      this.newUserList = this.newUserList.filter(user => user.email.toLowerCase().includes(this.searchKey.toLowerCase()) || user.username.toLowerCase().includes(this.searchKey.toLowerCase()))
    } else {
      this.newUserList = this.myUsersListSearch
    }
  }

  // onSubmit(form: NgForm) {
  //   this.newuserForm.reset();
  // }

  closeModal() {
    this.newUser = {
      username: "",
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      accType: AccountType.Emp,
      department: Department.TECHNICAL_TEAM,
      accRole: AccountRoles.Automation_Engineer,
      accPosition: AccountPositions.UNDER_TRAINING,
      // permissions:[]
    }
    this.userOnEditMode = false
  }


  resetPassword(user: User) {
    this.notify.openDialog(
      `Reset Password For ${user.username}?`,
      `Are you sure you want to reset password for ${user.email}?`,
      false,
      `*We Will Send Email For This Email ${user.email}`,
      true,
      false).subscribe(response => {
        if (response) {
          this._auth.requestResetPassword(user.email).subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this.notify.openSnackbar('Done', SnackBarState.Success)
              this._db.createSystemLogs(`${this.currentUser.username} Sent Reset Pssword For ${user.username}`, `${this.currentUser.key} Sent Reset Pssword For ${user.key}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe(res => {
                console.log(res);
              }, err => {
                console.log(err);
              })
            } else {
              this._db.createSystemLogs(`${this.currentUser.username} Sent Reset Pssword For ${user.username}`, `${this.currentUser.key} Sent Reset Pssword For ${user.key}`, this.currentUser.key || '', this.currentUser.username, 'Faild').subscribe(res => {
                console.log(res);
              }, err => {
                console.log(err);
              })
            }
          })
        } else {
          this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }

  disableUser(user: User) {
    this.notify.openDialog(
      'Delete User?',
      `Are you sure you want to delete This User?`,
      false,
      '*Deleteing this User Data Will Not Be restored',
      true,
      false).subscribe(response => {
        if (response) {
          this._auth.deactivateUser(user.key || '').subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this.getAllUser();
              this._db.createSystemLogs(`${this.currentUser.username} Disabled User ${user.username}`, `${this.currentUser.key} Disabled User ${user.key}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe(res => {
                console.log(res);
              }, err => {
                console.log(err);
              })
            } else {
              this._db.createSystemLogs(`${this.currentUser.username} Disabled User ${user.username}`, `${this.currentUser.key} Disabled User ${user.key}`, this.currentUser.key || '', this.currentUser.username, 'Faild').subscribe(res => {
                console.log(res);
              }, err => {
                console.log(err);
              })
            }
          })
        } else {
          this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }


  activateUser(user: User) {
    this.notify.openDialog(
      'Delete User?',
      `Are you sure you want to delete This User?`,
      false,
      '*Deleteing this User Data Will Not Be restored',
      true,
      false).subscribe(response => {
        if (response) {
          this._auth.activateUser(user.key || '').subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this.getAllUser();
              this._db.createSystemLogs(`${this.currentUser.username} Activated User ${user.username}`, `${this.currentUser.key} Actvated User ${user.key}`, this.currentUser.key || '', this.currentUser.username, 'Success').subscribe(res => {
                console.log(res);
              }, err => {
                console.log(err);
              })
            } else {
              this._db.createSystemLogs(`${this.currentUser.username} Activated User ${user.username}`, `${this.currentUser.key} Activated User ${user.key}`, this.currentUser.key || '', this.currentUser.username, 'Faild').subscribe(res => {
                console.log(res);
              }, err => {
                console.log(err);
              })
            }
          })
        } else {
          this.notify.openSnackbar('Operation Cancelled!', SnackBarState.Info);
        }
      });
  }


  allowPreviousReports(user: User) {
    user.canAddPreviousReports = !user.canAddPreviousReports;
    const now = new Date()
    user.canAddPreviousReportsDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`
    this._auth.changePreviousReportStatus(user.key || '', user.canAddPreviousReports).subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        console.log(res);
      }
    }
    )
    // this._auth.editUser(user)
  }




  getDeletedAccounts() {
    this.myUsersList = [];
    this.myUsersListSearch = [];
    this.deletedMode = true;
    this._auth.getAllDeactivatedUser().subscribe(users => {
      if (!!users && users['status'] == ResStatus.CRUD) {
        this.myUsersList = users['data'];
        this.newUserList = users['data'];
        this.myUsersListSearch = this.newUserList
      } else {
        this.myUsersList = [];
        this.newUserList = [];
        this.myUsersListSearch = [];
      }
    })
  }





  addRefreshRequiredForAllUsers() {
    for (let i in this.newUserList) {
      const userNavPerms: UserNavParams = {
        user_id: this.newUserList[i].key,
        user_Name: this.newUserList[i].username,
        refresh_required: true
      }
      this._auth.updateNavPerms(userNavPerms)
    }
    // this._auth.refreshAllUsers().subscribe(res=>{
    //   console.log(res);
    // })
  }

  addRefreshRequiredForUser(user: User) {
    const userNavPerms: ClientNavParams = {
      user_id: user.key || '',
      user_Name: user.username,
      refresh_required: true
    }
    this._auth.updateNavPerms(userNavPerms)
  }
  addRefreshRequiredForAllClients() {
    this._db.getAllClientAccounts().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        const allClients: Client = res['data'];
        for (let i in allClients) {
          const userNavPerms: ClientNavParams = {
            user_id: allClients[i].key,
            user_Name: allClients[i].fullname,
            refresh_required: true
          }
          this._auth.updateClientNavPerms(userNavPerms)
        }
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


  getUserDepartment(dept: Department) {
    switch (dept) {
      case Department.MANAGEMENT:
        return 'Management'
      case Department.TECHNICAL_TEAM:
        return 'Technical Team'
      case Department.Business_Development:
        return 'Business Development'
      case Department.ADMINSTRATION:
        return 'Administration'
    }
  }

  // To Use This Method the values Of Enum should be numbers not string

  // getMyEnumkeys(ENUM:any) {
  //   let myEnum:any = [];
  //   let objectEnum = Object.keys(ENUM);
  //   const values = objectEnum.slice( 0 , objectEnum.length / 2 );
  //   const keys = objectEnum.slice( objectEnum.length / 2 );

  //   for (let i = 0 ; i < objectEnum.length/2 ; i++ ) {     
  //     myEnum.push( { key: keys[i], value: values[i] } ); 
  //   }

  //   return myEnum;
  // }


  tabChange(event: any) {
    console.log(event);
    if (event.index == 0) {
      this.getAllUser();
    } else if (event.index == 1) {
      this.getDeletedAccounts()
    }

  }

  userToCreate() {
    this.getDepartments()
    this.sidebarDisplay = true;
    this.newUserForm.get('email')?.enable();
  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}