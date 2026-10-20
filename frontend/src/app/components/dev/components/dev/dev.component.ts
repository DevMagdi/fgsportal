import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.scss']
})
export class DevComponent implements OnInit {

  constructor(private _auth:AuthApiService) { }

  ngOnInit(): void {
    // this._auth.user.subscribe(userFromLocal=>{
    //   if(!!userFromLocal){
    //     console.log("userFromLocal",userFromLocal);
    //     this._auth.getCurrentLoggedInUser().subscribe(userFromME=>{
    //       const meUser:User = userFromME['data']
    //       console.log("userFromME",meUser);
    //       if(meUser.department == userFromLocal.department && meUser.accType == userFromLocal.accType && meUser.accRole == userFromLocal.accRole && meUser.accPosition == userFromLocal.accPosition){
    //         console.log(true);
    //       }else{
    //         console.log(false);
    //       }
    //     })
        
    //   }      
    // })
    
  }

}
