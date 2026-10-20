import { Component, OnInit } from '@angular/core';
import { AccountRoles, Department, User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-admin-vacations',
  templateUrl: './admin-vacations.component.html',
  styleUrls: ['./admin-vacations.component.scss']
})
export class AdminVacationsComponent implements OnInit {
  currentUser:User;
  DepartmentEnum = Department;
  AccountRolesEnum = AccountRoles;
  constructor(private _auth:AuthApiService) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      this.currentUser = user;      
    })
  }

}
