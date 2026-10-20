import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationStatus, Notifying } from 'src/app/interfaces/notification';
import { User } from 'src/app/interfaces/user';
import { MessagingService } from 'src/app/services/messaging.service';
import * as moment from 'moment'
import { Subscription } from 'rxjs';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss']
})
export class NotificationPageComponent implements OnInit {
  myNotifications:Notifying[] = [];
  currentUser:User;
  lastLimit:number = 5;
  newServerApi = environment.newServerApi;
  constructor(private message:MessagingService,
              private _auth:AuthApiService,
              private router:Router) { }

  ngOnInit(): void {
    this._auth.user.subscribe(
      (user)=>{
        this.currentUser = user;
        if(!!user){
          this.message.getNotificationByUser(user.key , this.lastLimit).subscribe(
            (notification)=>{
              this.myNotifications = notification;
            }
          )
        }else{
          this.router.navigateByUrl('/signin');
        }
      }
    )
  }


  timeCalculation(specDate){
    const now:any = new Date()
    const secDate:any = new Date(specDate)
    const def = now - secDate
    return def / (1000 * 3600 * 24);
  }


  loadMore(){
    this.lastLimit = this.lastLimit + 5 ;
    this.message.getNotificationByUser(this.currentUser.key || '' , this.lastLimit).subscribe(
      (notification)=>{
        this.myNotifications = notification;
      }
    )
  }


  deleteNotification(notify:Notifying){
    this.message.deleteNotification(notify)
  }

  readNotification(notify:Notifying){    
    if(notify.status == NotificationStatus.unSeen){
      notify.status = NotificationStatus.Seen;
      this.message.updateNotification(notify).then(
        ()=>{
          if(!!notify.redirection)this.router.navigateByUrl(notify.redirection);
        }
      )
    }else{      
      if(!!notify.redirection)this.router.navigateByUrl(notify.redirection);
    }
  }


  markAsUnSeen(notify:Notifying){
    notify.status = NotificationStatus.unSeen;
    this.message.updateNotification(notify)
  }


  markAsSeen(notify){
    notify.status = NotificationStatus.Seen;
    this.message.updateNotification(notify)
  }


  markAllAsRead(){
    const readAllSubscription:Subscription =  this.message.getNotificationByUser(this.currentUser.key||"", 0).subscribe(
      (notifs)=>{
        readAllSubscription.unsubscribe()
        if(!!notifs && notifs.length > 0){
          const unReadList =  notifs.filter(notify=>notify.status == NotificationStatus.unSeen)
          if(!!unReadList && unReadList.length > 0){
            for (let i in unReadList){
              this.markAsSeen(unReadList[i])
            }
          }  
        }
      }
    )
  }


  getTime(dateString) {
    // console.log(moment(dateString).format('MM-DD-YYYY'));
    const timestampPositive = Date.parse(dateString)
    // console.log(timestampPositive);

    if(Number.isNaN(timestampPositive)){      
      return  dateString;//moment(moment.unix(timestampPositive  / 1000)).startOf('minute').fromNow();
    }else{
      return moment(moment.unix(timestampPositive  / 1000)).startOf('minute').fromNow();
    }
  }
}
