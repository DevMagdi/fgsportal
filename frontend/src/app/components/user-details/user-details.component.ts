import { Component, ElementRef, OnInit, Output} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountPositions, AccountRoles, AccountType, Department, MaritalStatus, MobileNumber, User } from 'src/app/interfaces/user';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';
import { SnackBarState } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  userSubscription:Subscription;
  @Output() currentUser:User;
  loggedInUser:User;
  pageToOpen:string = 'info';
  userOnEditMode:boolean = false;
  imgOnEditMode:boolean = false;
  
  newavatar:File | undefined;
  idAttachFile:File | undefined;

  url:string = '';
  IDAttach:string = '';

  MaritalStatusEnum = MaritalStatus;
  showSalary:boolean = false;
  myCurrentSalary:number;
  DepartmentEnum = Department;
  accPositionEnum = AccountPositions;
  newServerApi = environment.newServerApi;
  userPerms:UserPermissions[] = [];

  allDepartments:any[] = [];
  allSubdepartments:any[] = [];
  allPositions:any[] = [];
  subdeptLoading:boolean = false;
  roleOnEditMOde:boolean = false;
  activeIndex=0
  constructor(private _db:DatabaseService,
              private _auth:AuthApiService,
              private el: ElementRef,
              private activerouter:ActivatedRoute,
              private notify:NotificationService,
              ) {
                this.currentUser = {
                  accType:AccountType.Emp,
                  email:'',
                  firstname: '',
                  lastname: '',
                  username: '',
                  department: Department.TECHNICAL_TEAM,
                  accRole: AccountRoles.Automation_Engineer,
                  accPosition: AccountPositions.UNDER_TRAINING,
                }
               }

  ngOnInit(): void {
    this.cancelEditUser();    

    this._auth.user.subscribe(user=>{
      this.loggedInUser = user;
      this._auth.getUserPermissionsByKey(this.loggedInUser.key || '').subscribe(perms=>{
        if(perms['status'] == ResStatus.CRUD){
          this.userPerms = perms['data'];
        }else{
          this.userPerms = []
        }
      },err=>{
        console.log(err);
        this.userPerms = []
      }) 
      this.getCurrentUser();
      this.cancelEditUser();

    })
  }


  checkIfHasPerm(perm_id){
    const checking = this.userPerms.find(p=>p.permission_id == perm_id)
    if(!!checking){
      return true;
    }else{
      return false;
    }
  }

  // getMyCurrentMonthSalary(){
  //   // const getPreviousMonthDate:Date = new Date (new Date().setDate(new Date().getMonth()-1));
  //   // console.log(getPreviousMonthDate);

    
  //   if(!!this.currentUser && !!this.loggedInUser){
  //     const year = new Date().getFullYear();
  //     const month = new Date().getMonth();
      
  //     // console.log(year,month);
      
  //     this._salary.getEmpMonthlySalary(year , month , this.currentUser.key || '').subscribe(salary=>{
  //         this.myCurrentSalary = salary.Total;
  //     });
  //   }
  // }


  getCurrentUser(){
    this.activerouter.params.subscribe(parameter => {
      const userKey = parameter['id']
      console.log('Hello');
      
      this._auth.getUserByKey(userKey).subscribe(user=>{        
        if(user['status'] == ResStatus.CRUD){
          this.currentUser = user['data'];
          if(!!this.currentUser.my_total_rate){
            this.currentUser.my_total_rate = Math.round(this.currentUser.my_total_rate)
          }
          if(this.loggedInUser.key != userKey){
            if(this.loggedInUser.department != Department.MANAGEMENT && this.loggedInUser.accRole != AccountRoles.HUMAN_RESOURCE && !this.checkIfHasPerm(10)){
              this.userOnEditMode = false;
              this.IDAttach = '';
              this.idAttachFile = undefined;
              this.newavatar = undefined;
            }
          }
          if(!!this.currentUser.mobileNumber){
            const phoneSTR:any = this.currentUser.mobileNumber            
            this.currentUser.mobileNumber = JSON.parse(phoneSTR)
          }
        }},
        (err)=>{
          console.log(err);
          this.userOnEditMode = false;
          this.IDAttach = '';
          this.idAttachFile = undefined;
          this.newavatar = undefined;
        }
      )
    })
  }



  editProfileIMG(){
    this.imgOnEditMode = true;
    this.url = this.currentUser.photoURL? `${this.newServerApi}${this.currentUser.photoURL}` : "" ;    
    this.cancelEditUser();
  }


  saveEditIMg(){
    const fd : FormData = new FormData()
    if(!!this.newavatar){
      fd.append('photoURL' , this.newavatar , this.newavatar.name)
      fd.append('user_id' , this.currentUser.key || '')      
      this._auth.editProfilePhoto(fd).subscribe(res=>{        
        if(res['status']==ResStatus.CRUD){
          this.notify.openSnackbar('Image Updated', SnackBarState.Success)
          this.imgOnEditMode = false;
          this.url = '';
          this.newavatar = undefined;
          this.getCurrentUser();
          let user ={
            photoURL : res['data']['photoURL'],
            key : this.currentUser.key,
          }
          this.currentUser.photoURL=res['data']['photoURL']
          this._auth.user.next(this.currentUser)
        }
      },err=>{
        console.log(err);
        this.notify.openSnackbar(`Error, ${JSON.stringify(err['error']['data'])}` ,SnackBarState.Error , 10000)
      })
    }

  }

  cancelEditIMg(){
    this.imgOnEditMode = false;
    this.url = '';
    this.newavatar = undefined;
    this.getCurrentUser();
    // this.notify.openSnackbar("Cancelled" ,SnackBarState.Info)
  }


  editUser(){
    this.userOnEditMode = true;
    this.cancelEditIMg();
  }

  cancelEditUser(){
    this.userOnEditMode = false;
    this.IDAttach = '';
    this.idAttachFile = undefined;
    this.newavatar = undefined;
    this.roleOnEditMOde = false;
    // this.getCurrentUser();
    // this.notify.openSnackbar("Cancelled" ,SnackBarState.Info)
  }


  saveEditUser(){
    if(this.currentUser.firstname.length >= 20 || this.currentUser.lastname.length >= 20){
      this.notify.openSnackbar('First Name Or Last Name is too long', SnackBarState.Error)
      return;
    }else if(this.currentUser.firstname.length < 2 || this.currentUser.lastname.length < 2){
      this.notify.openSnackbar('First Name Or Last Name is too short', SnackBarState.Error)
      return;
    }
    this._auth.editProfileData(this.currentUser).subscribe(res=>{
      if(res['status'] == ResStatus.CRUD){
        this.notify.openSnackbar('Profile Updated', SnackBarState.Success)
        this.getCurrentUser();
        this.userOnEditMode = false;
        this.roleOnEditMOde = false;
        this._auth.user.next(this.currentUser)
      }else{
        this.notify.openSnackbar(`Error ,${res['data']}` , SnackBarState.Error , 5000)
        this._db.createSystemLogs(
          `${this.currentUser.username} has error while updating his profile Error, ${JSON.stringify(res['data'])} => ${JSON.stringify(this.currentUser)}`,
          `${this.currentUser.key} has error while updating his profile Error, ${JSON.stringify(res['data'])}`,
          this.currentUser.key || '',
          this.currentUser.username,
          'Faild'
        ).subscribe()
      }
    },err=>{
      this.notify.openSnackbar(`Error , ${err['error']['data']}` , SnackBarState.Error , 5000)
      this._db.createSystemLogs(
        `${this.currentUser.username} has error while updating his profile Error, ${err['error']['data']} => ${JSON.stringify(this.currentUser)}`,
        `${this.currentUser.key} has error while updating his profile Error, ${err['error']['data']}`,
        this.currentUser.key || '',
        this.currentUser.username,
        'Faild'
      ).subscribe()
    })    
  }

  deletePhone(i){
    this.currentUser.mobileNumber?.splice(i,1)
  }
  addPhone(){
    const newPhone:MobileNumber={
      phone:'',
      phone_type:''
    }
    if(!!this.currentUser.mobileNumber && this.currentUser.mobileNumber.length > 0){
      this.currentUser.mobileNumber.push(newPhone)
    }else{
      this.currentUser.mobileNumber = [newPhone]
    }
  }

  imageupload(event:any , forprofile:boolean){
    if(forprofile){
      const files=event.target.files;
      const mimeType=files[0].type;
      if(!mimeType.includes('image')){
        this.notify.openSnackbar('Invalid File Type', SnackBarState.Error)
      }else{
        this.newavatar = event.target.files[0]
        if (event.target.files){
          var reader = new FileReader()
          reader.readAsDataURL(event.target.files[0])
          reader.onload = (event:any) =>{
            this.url = event.target.result;
          }
        }
      }
    }else{
      this.idAttachFile = event.target.files[0]
      if (event.target.files){
        var reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onload = (event:any) =>{
          this.IDAttach = event.target.result;
        }
      }
    }
   
   }

  openPage(pageName:string){
    this.pageToOpen = pageName;
    
    let pagesList = this.el.nativeElement.querySelector('.pagesList')
    for(let i=0; i < pagesList.children.length ; i++){
      pagesList.children[i].classList.remove('activePage');
      if(pagesList.children[i].id == pageName){
        pagesList.children[i].classList.add('activePage');
      }
    }    
  }


  salaryToggle(){
    this.showSalary = !this.showSalary;
  }

  getDepartments(){
    this._db.getAllDeparments().subscribe(departments=>{
      if(!!departments && departments['status'] == ResStatus.CRUD){
        this.allDepartments = departments['data'];
        this.getSubDepartment();
      }
    })
  }

  getSubDepartment(){ 
    this.subdeptLoading = true; 
    this._db.getSubDepartmentsByDeparmentID(this.currentUser.department).subscribe(subdept=>{
      if(!!subdept && subdept['status'] == ResStatus.CRUD){       
        this.allSubdepartments = subdept['data'];
        this.subdeptLoading = false;
      }
    })
  }

  getAllWorkDegress(){
    this._db.getAllWorkDegree().subscribe(positions=>{
      if(!!positions && positions['status'] == ResStatus.CRUD){
        this.allPositions = positions['data'];
      }
    })
  }

  getUserRoles(){
    this.getDepartments();
    this.getAllWorkDegress();
    this.roleOnEditMOde = true
  }

  saveRolesEditUser(){
    const editUser:User = {
      key:this.currentUser.key,
      email:this.currentUser.email,
      username:this.currentUser.username,
      firstname:this.currentUser.firstname,
      lastname:this.currentUser.lastname,
      department:this.currentUser.department,
      accRole:this.currentUser.accRole,
      accPosition:this.currentUser.accPosition,
      accType:AccountType.Emp,
    }
    this._auth.editUser(editUser).subscribe(res=>{     
      if(res['status'] == ResStatus.CRUD){
        this.notify.openSnackbar('Profile Updated', SnackBarState.Success)
        this.getCurrentUser();
        this.userOnEditMode = false;
        this.roleOnEditMOde = false;
        this._db.createSystemLogs(`${this.currentUser.username} Edit User Data ${res['data'].username}` , `${this.currentUser.key} Edit User Data ${res['data'].key}`, this.currentUser.key || '', this.currentUser.username , 'Success').subscribe()
      }else{
        this._db.createSystemLogs(`${this.currentUser.username} Tryied To Edit User Data ${res}` , `${this.currentUser.key} Tryied To Edit User Data ${res}`, this.currentUser.key || '' , this.currentUser.username , 'Faild').subscribe(res=>{
        },err=>{
          console.log(err);
        })
      }
    })
  }
}
