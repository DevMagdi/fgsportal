import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackBarState } from 'src/app/components/snackbar/snackbar.component';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AccountType, ClientNavParams, Department, User } from 'src/app/interfaces/user';
import { FormattedPermissions, Permission, PermissionStatus, UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class UserPermissionsComponent implements OnInit {
  AllUsers: User[] = [];
  // userPerms:UserPermissions = {
  //   userKey:'',
  //   username:'',
  //   permission_id:'',
  //   managerProjectsPage:false,
  //   pendingReports:false,
  //   reportsPage:false,
  //   salariesPage:false
  // };
  DepartmentEnum = Department;
  accTypeEnum = AccountType;

  allPermissions: Permission[] = [];
  myPermissions: UserPermissions[] = [];
  formattedPermissions:FormattedPermissions[];
  // userPermsTemp:UserPermissions;


  numOFCallingFUn: number = 0;
  sidebarDisplay = false;

  constructor(private _auth: AuthApiService,
    private _notify: NotificationService) { }

  ngOnInit(): void {
    // this.userPermsTemp = {
    //   userKey:'',
    //   username:'',
    //   managerProjectsPage:false,
    //   pendingReports:false,
    //   reportsPage:false,
    //   salariesPage:false
    // }
    this._auth.getAllUsers().subscribe(users => {
      if (users['status'] == ResStatus.CRUD) {
        this.AllUsers = users['data'];
      }
    })


    this._auth.getAllPermissions().subscribe(perms => {
      if (perms['status'] == ResStatus.CRUD) {
        this.allPermissions = perms['data'];
        console.log(this.allPermissions);
        
      }
    })


    // console.log(this.RoutePermissionsEnum);

  }



  getUserPermissions(userKey, username) {
    console.log('aaa');

    this.myPermissions = [];
    // if(this.numOFCallingFUn == 0){
    //   console.log('0');

    this._auth.getUserPermissionsByKey(userKey).subscribe(perms => {
      this.myPermissions = [];
      if (perms['status'] == ResStatus.CRUD) {
        this.myPermissions = perms['data']
        for (let i in this.allPermissions) {
          const permFound = this.myPermissions.find(p => p.permission_id == this.allPermissions[i].id)
          if (!permFound) {
            this.myPermissions.push({
              permission_id: this.allPermissions[i].id,
              permission_name: this.allPermissions[i].permission_name,
              userKey: userKey,
              username: username,
              status: PermissionStatus.Deactive,
              permission_group_id:this.allPermissions[i].permission_group_id,
              permission_group_name:this.allPermissions[i].permission_group_name
            })
          }else{
            permFound.permission_group_id=this.allPermissions[i].permission_group_id;
            permFound.permission_group_name=this.allPermissions[i].permission_group_name;
          }
          // else{

          // }
        }
      } else if (perms['status'] == ResStatus.Success_But_Empty) {
        this.myPermissions = []
        this.allPermissions.map(p => this.myPermissions.push({
          permission_id: p.id,
          permission_name: p.permission_name,
          userKey: userKey,
          username: username,
          status: PermissionStatus.Deactive,
          permission_group_id:p.permission_group_id,
          permission_group_name:p.permission_group_name
        }))
      }
      
      
      this.formattedPermissions=this.formatPermissionsArray(this.myPermissions);
      console.log(this.formattedPermissions);

     
      
    }, err => {
      this.myPermissions = [];
      console.log(err);
    })
    // this.numOFCallingFUn++;

    // }else{
    //   // this.numOFCallingFUn++;
    //   this.myPermissions = [];
    //   this.numOFCallingFUn = 0;
    // }

  }

  resetArr() {
    this.myPermissions = [];
  }

  editPerms() {
    this.formattedPermissions.forEach(element => {
      
      console.log(element);
      
      for (let i in element.permissions) {
        // if(this.myPermissions[i].status == true){
        //   this.myPermissions[i].status = PermissionStatus.Active
        // }else{
        //   this.myPermissions[i].status = PermissionStatus.Deactive
        // }
        console.log(this.myPermissions[i].permission_id);
        
        const editSub: Subscription = this._auth.editUserPermissions(element.permissions[i].permission_id, element.permissions[i].userKey, element.permissions[i].status).subscribe(res => {
          editSub.unsubscribe();
          const userNavPerms: ClientNavParams = {
            user_id: element.permissions[i].userKey,
            user_Name: element.permissions[i].username,
            refresh_required: true
          }
          this._auth.updateNavPerms(userNavPerms)
        })
  
      }
    });
    this._notify.openSnackbar('success', SnackBarState.Success)
  }

  formatPermissionsArray(permissions:UserPermissions[]):FormattedPermissions[]{

    const result:FormattedPermissions[] = permissions.reduce((acc, current) => {
      // Find if the group already exists in the result array
      let group = acc.find(g => g.group_id === current.permission_group_id);
      
      if (!group) {
        // If the group doesn't exist, create it
        group = {
          group_id: current.permission_group_id,
          group_name: current.permission_group_name,
          permissions: []
        };
        console.log(group);
        
        acc.push(group);
      }
    
      // Add the permission to the group's permissions array
      group.permissions.push({
        permission_id: current.permission_id,
        permission_name: current.permission_name,
        status: current.status,
        userKey: current.userKey,
        username: current.username
      });
    
      return acc;
    }, [] as any[]);
    return result;
  }
}
