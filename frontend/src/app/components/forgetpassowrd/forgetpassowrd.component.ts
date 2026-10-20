import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-forgetpassowrd',
  templateUrl: './forgetpassowrd.component.html',
  styleUrls: ['./forgetpassowrd.component.scss']
})
export class ForgetpassowrdComponent implements OnInit {
  emailForgetPassword:string;
  resetPasswordForm:FormGroup = new FormGroup({
    'password' : new FormControl(null , Validators.required),
    'confirmPassword' : new FormControl(null , Validators.required),
  })
  errMessage:string;

  loading:boolean = false;
  constructor(private _auth:AuthApiService,
              private activerouter:ActivatedRoute,
              private router:Router) { }
  
  ngOnInit(): void {
    this._auth.user.subscribe(user=>{
      if(!!user){
        this.router.navigate(['/'])
      }
    })
  }


  validatePassowrd(){ 
    if(this.resetPasswordForm.get(['password'])?.value != this.resetPasswordForm.get(['confirmPassword'])?.value){
      console.log("Not Valid");

      
    }else{
      this.resetPassword();
    }
  }


  resetPassword(){
    this.loading = true;
    const token = this.activerouter.snapshot.queryParams['token']
    const email = this.activerouter.snapshot.queryParams['email']
    const pass = this.resetPasswordForm.get(['password'])?.value
    const confirmPass = this.resetPasswordForm.get(['confirmPassword'])?.value
    console.log(email,pass,confirmPass,token);
    
    this._auth.setNewPassword(email,pass,confirmPass,token).subscribe(res=>{
      console.log(res);
      this.router.navigate(['/signin'])
      this.loading = false;

    },err=>{
      console.log(err);
      this.errMessage = JSON.stringify(err['error']['data']);
      this.loading = false;
    })
  }
}
