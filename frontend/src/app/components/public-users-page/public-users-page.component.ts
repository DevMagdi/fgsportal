import { Component, OnInit } from '@angular/core';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-public-users-page',
  templateUrl: './public-users-page.component.html',
  styleUrls: ['./public-users-page.component.scss']
})
export class PublicUsersPageComponent implements OnInit {
  myUsersList:User[] = [];
  myUsersListSearch:User[] = [];
  searchKey:string = '';
  newServerApi = environment.newServerApi;

  constructor(private _auth:AuthApiService) { }

  ngOnInit(): void {
    this._auth.getAllUsers().subscribe((data)=>{
      if(data['status'] == ResStatus.CRUD){
        this.myUsersList = data['data'];
        this.myUsersListSearch = data['data'];
      }
    },err=>{console.log(err);}
    )

  }


  userSearch(){
    this.myUsersList = this.myUsersListSearch
    if(this.searchKey.length > 0){
      this.myUsersList =  this.myUsersList.filter(user=> user.email.toLowerCase().includes(this.searchKey.toLowerCase()) || user.username.toLowerCase().includes(this.searchKey.toLowerCase()))
      // || user.accType.toLowerCase().includes(this.searchKey.toLowerCase())
    }else{
      this.myUsersList = this.myUsersListSearch
    }    
  }


}
