import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

  constructor(private _http:HttpClient) { }

  supportCenter(user_email:string , subject:string, body:string):void{
    
    this._http.post(`${environment.serverAPI}/sendsupportmail/` , {"receiver_email":user_email,"subject":subject,"body":body} ).subscribe(res=>{
      // console.log(res);
    })
    
  }

  sendNewMail(user_email:string , subject:string, body:string):void{    
    this._http.post(`${environment.serverAPI}/sendmail/` , {"receiver_email":user_email,"subject":subject,"body":body} ).subscribe(res=>{
      // console.log(res);
    })
  }



}
