import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResStatus } from 'src/app/interfaces/res-status';
import { User, UserNavParams } from 'src/app/interfaces/user';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-dev-reports',
  templateUrl: './dev-reports.component.html',
  styleUrls: ['./dev-reports.component.scss']
})
export class DevReportsComponent implements OnInit {
  private userSub: Subscription;
  currentUser!:User;
  myNavParams:UserNavParams;
  constructor(private _auth:AuthApiService) { }

  ngOnInit(): void {
    this.getPermissions();
  }
getPermissions(){
  this.userSub = this._auth.user.subscribe(
    (data)=>{ 
      if(!!data){
        
        this.currentUser = data;
        this._auth.getNavPermsByUserID(this.currentUser.key || '').subscribe(res=>{
          if(!!res.refresh_required){
            res.refresh_required = false;
            this._auth.updateNavPerms(res).finally(()=>{
              window.location.reload()
            })
          }else{
            this.myNavParams = res;




            if(!this.myNavParams.open_to_work_counter){
              this.myNavParams.open_to_work_counter = 0;
            }

            if(!this.myNavParams.pendingReport){
              this.myNavParams.pendingReport = 0;
            }


            // Count Requests Section 

            if(!this.myNavParams.pendingPublicRequest){
              this.myNavParams.pendingPublicRequest = 0;
            }
            if(!this.myNavParams.pendingIncentiveRequest){
              this.myNavParams.pendingIncentiveRequest = 0;
            }


            if(!this.myNavParams.pendingTransportationRequest){
              this.myNavParams.pendingTransportationRequest = 0;
            }

            
      

          }
        })
      }
    })
}
}
