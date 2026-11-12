import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AccountPositions, AccountType, Department } from '../../interfaces/user'
import { SnackBarState } from '../snackbar/snackbar.component';
import { LoadingService } from 'src/app/services/loading.service';
import { BmsAccessService } from '../bms/bms-access.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  email:string;
  password:string;
  errMessage:string;


  resetPasswordMode:boolean = false; 


  emailForgetPassword:string;
  signInCounter:number = 0;

  resetPasswordLoading= false;

  constructor(private router:Router,
              private _AuthAPi:AuthApiService,
              private _notify:NotificationService,
            private loaderService:LoadingService,
            private access:BmsAccessService) { }

  ngOnInit(): void {
    this._AuthAPi.user.subscribe(user=>{
      if(!!user){
        this.checkUser(user)
      }
    })
  }



  login(){
    
    if(!!this.email && this.email.length > 3 && !!this.password && this.password.length > 3){
      this.errMessage = '';
      this._AuthAPi.login(this.email,this.password).subscribe(user=>{
        this.checkUser(user['data'])  
      },err=>{
        this.signInCounter++
        if(err == 'Validator Errors')   {
          this.errMessage = 'Invalid Email Or Password';     
        }else if(err == 'Credential Error'){
          this.errMessage = 'Invalid Email Or Password';     
        }else{
          console.log(err);
          this.errMessage = 'Error, Please Contact System Admistration'
        }
      });
    }else{
      this.errMessage = 'Invalid Email Or Password';     
    }
  }




  /**
   * Single BMS entry point (BRD section 3).
   *
   * Department-based redirects to legacy CRM / Admin / Dev dashboards are gone:
   * every successful sign-in lands in the BMS workspace, on the first page the
   * account is actually authorised to open, or on the "no access" screen.
   */
  checkUser(loggedInUser){
    if(!loggedInUser) return;
    this.access.reset();
    this.access.abilities().subscribe(() => {
      this.router.navigateByUrl(this.access.firstLanding());
    });
  }


  forgetPassword(){
    this.resetPasswordLoading = true;
    this.loaderService.setLoading(true);
    this._AuthAPi.requestResetPassword(this.emailForgetPassword).subscribe(res=>{
      this.resetPassowrd();
      this._notify.openSnackbar('success Send Email' , SnackBarState.Success)
      this.resetPasswordLoading = false;
    this.loaderService.setLoading(false);

    },err=>{
      this.resetPasswordLoading = false;
    this.loaderService.setLoading(false);

    })
  }


  resetPassowrd(){
    this.resetPasswordMode = !this.resetPasswordMode;
  }
} 
